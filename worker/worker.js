/**
 * Wax Coat Car Detailing — Brea | Cloudflare Worker
 * ------------------------------------------------------------------
 * Backend for the booking site. Talks to the SHARED D1 database
 * `detailing-bookings` (account austin80565). All reads/writes are
 * scoped to this site's `source` tag so portfolio sites never collide.
 *
 * Dashboard setup (manual, no CLI):
 *   1. Create/deploy this Worker as:  wax-coat-detailing-worker-v2
 *   2. Settings → Variables → D1 database bindings:
 *        Variable name:  DB
 *        D1 database:    detailing-bookings
 *   3. Settings → Variables → Secrets:
 *        STRIPE_SECRET_KEY = sk_live_...  (or sk_test_...)
 *
 * Endpoints:
 *   GET   /api/slots?date=YYYY-MM-DD        -> { booked: ["9:00 AM", ...] }
 *   POST  /api/bookings                     -> { id: "WCB-...", ...row }
 *   PATCH /api/bookings/:id                 -> { ok: true, ...row }
 *   POST  /api/create-payment-intent        -> { clientSecret }
 * ------------------------------------------------------------------
 */

const SOURCE = 'wax-coat-brea' // unique to this site — never reused
const PREFIX = 'WCB-' // unique booking-ID prefix
const DEFAULT_STATUS = 'Confirmed'

// Fields the admin dashboard is allowed to PATCH (reschedule support included)
const PATCHABLE = new Set([
  'date',
  'time',
  'service',
  'name',
  'phone',
  'email',
  'vehicle',
  'address',
  'notes',
  'status',
  'payment_status',
  'reschedule_date',
  'reschedule_time',
  'original_date',
  'original_time',
  'notes2',
])

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

// Shared schema — IF NOT EXISTS so every site's worker is safe to run.
async function ensureSchema(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        date TEXT,
        time TEXT,
        service TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        vehicle TEXT,
        address TEXT,
        notes TEXT,
        source TEXT,
        created_at TEXT,
        status TEXT,
        reschedule_date TEXT,
        reschedule_time TEXT,
        notes2 TEXT,
        original_date TEXT,
        original_time TEXT,
        payment_status TEXT
      )`
    )
    .run()
}

function newId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6)
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0')
  return `${PREFIX}${stamp}${rand}`
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS })
    }

    // Payment-intent creation doesn't touch D1, so it works even before the
    // database binding is wired up — lets Stripe be tested standalone.
    const needsDb = path !== '/api/create-payment-intent'

    try {
      if (needsDb) {
        if (!env.DB) {
          return json({ error: 'Database not configured yet for this Worker.' }, 503)
        }
        await ensureSchema(env.DB)
      }

      // ---- availability (source-scoped) ----
      if (path === '/api/slots' && request.method === 'GET') {
        const date = url.searchParams.get('date')
        if (!date) return json({ booked: [] })
        const { results } = await env.DB.prepare(
          `SELECT time FROM bookings
           WHERE source = ? AND date = ?
           AND (status IS NULL OR status != 'Cancelled')`
        )
          .bind(SOURCE, date)
          .all()
        const booked = (results || []).map((r) => r.time)
        return json({ booked })
      }

      // ---- create booking ----
      if (path === '/api/bookings' && request.method === 'POST') {
        const b = await request.json()

        // required minimum
        if (!b.date || !b.time || !b.name) {
          return json({ error: 'Missing required booking fields.' }, 400)
        }

        // double-booking guard (source-scoped)
        const existing = await env.DB.prepare(
          `SELECT id FROM bookings
           WHERE source = ? AND date = ? AND time = ?
           AND (status IS NULL OR status != 'Cancelled')`
        )
          .bind(SOURCE, b.date, b.time)
          .first()
        if (existing) {
          return json({ error: 'That time was just booked. Please pick another slot.' }, 409)
        }

        const id = newId()
        const created_at = new Date().toISOString()
        const payment_status = b.payment_status === 'Paid' ? 'Paid' : 'Pay Later'

        await env.DB.prepare(
          `INSERT INTO bookings
            (id, date, time, service, name, phone, email, vehicle, address, notes,
             source, created_at, status, payment_status)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        )
          .bind(
            id,
            b.date,
            b.time,
            b.service || '',
            b.name,
            b.phone || '',
            b.email || '',
            b.vehicle || '',
            b.address || '',
            b.notes || '',
            SOURCE,
            created_at,
            DEFAULT_STATUS,
            payment_status
          )
          .run()

        return json({ id, date: b.date, time: b.time, payment_status })
      }

      // ---- update booking (admin: status / payment / reschedule) ----
      if (path.startsWith('/api/bookings/') && request.method === 'PATCH') {
        const id = decodeURIComponent(path.split('/').pop())
        const body = await request.json()

        const cols = []
        const vals = []
        for (const [k, v] of Object.entries(body)) {
          if (PATCHABLE.has(k)) {
            cols.push(`${k} = ?`)
            vals.push(v)
          }
        }
        if (cols.length === 0) return json({ error: 'No patchable fields.' }, 400)

        vals.push(id, SOURCE)
        await env.DB.prepare(
          `UPDATE bookings SET ${cols.join(', ')} WHERE id = ? AND source = ?`
        )
          .bind(...vals)
          .run()

        const row = await env.DB.prepare(`SELECT * FROM bookings WHERE id = ? AND source = ?`)
          .bind(id, SOURCE)
          .first()
        return json({ ok: true, booking: row })
      }

      // ---- Stripe PaymentIntent ----
      if (path === '/api/create-payment-intent' && request.method === 'POST') {
        const { amount, metadata = {} } = await request.json()
        if (!amount || amount < 50) {
          return json({ error: 'Invalid amount.' }, 400)
        }

        const form = new URLSearchParams()
        form.set('amount', String(Math.round(amount)))
        form.set('currency', 'usd')
        // This is the key line: enables Link / Apple Pay / Google Pay
        form.set('automatic_payment_methods[enabled]', 'true')
        form.set('metadata[source]', SOURCE)
        for (const [k, v] of Object.entries(metadata)) {
          if (v != null) form.set(`metadata[${k}]`, String(v))
        }

        const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: form.toString(),
        })
        const pi = await resp.json()
        if (!resp.ok) {
          return json({ error: (pi.error && pi.error.message) || 'Stripe error' }, 502)
        }
        return json({ clientSecret: pi.client_secret })
      }

      return json({ error: 'Not found' }, 404)
    } catch (err) {
      return json({ error: err.message || 'Server error' }, 500)
    }
  },
}
