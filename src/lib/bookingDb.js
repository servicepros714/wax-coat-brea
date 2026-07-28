// ============================================================
// bookingDb.js — production data layer
// Talks to the Cloudflare Worker (shared `detailing-bookings` D1).
// All calls are scoped to this site's `source` tag.
// ============================================================

import { SITE } from './site'

const API = import.meta.env.VITE_API_URL // https://wax-coat-brea-v2-worker.4ocky8996.workers.dev
const SOURCE = SITE.source

function url(path) {
  return `${API}${path}`
}

async function jsonOrThrow(res) {
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data
}

// --- Availability: which 30-min slots are already taken on a date (source-scoped) ---
export async function getBookedSlots(dateStr) {
  const res = await fetch(url(`/api/slots?source=${encodeURIComponent(SOURCE)}&date=${encodeURIComponent(dateStr)}`))
  const data = await jsonOrThrow(res)
  // Worker returns { booked: ["09:00", "10:30", ...] }
  return (data && data.booked) || []
}

// --- Create a booking row ---
export async function createBooking(booking) {
  const res = await fetch(url('/api/bookings'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...booking, source: SOURCE }),
  })
  return jsonOrThrow(res) // { id: "WCB-...", ... }
}

// --- Create a Stripe PaymentIntent (Worker uses automatic_payment_methods) ---
export async function createPaymentIntent(amountCents, meta = {}) {
  const res = await fetch(url('/api/create-payment-intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountCents, source: SOURCE, metadata: meta }),
  })
  const data = await jsonOrThrow(res)
  return data.clientSecret
}

// --- Update payment_status after a successful charge (or Pay Later) ---
export async function updateBookingPayment(id, payment_status) {
  const res = await fetch(url(`/api/bookings/${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status, source: SOURCE }),
  })
  return jsonOrThrow(res)
}
