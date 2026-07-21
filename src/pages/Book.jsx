import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Car,
  Droplets,
} from 'lucide-react'
import useReveal from '../lib/useReveal'
import { getBookedSlots } from '../lib/bookingDb'
import { SERVICES, EXTERIOR_ADDON } from '../lib/site'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const STEPS = ['Service', 'Extras', 'Date', 'Time', 'Your Info']

// --- Pacific-time "today" so the calendar can't offer a past day ---
function ptNow() {
  const s = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  return new Date(s)
}
function ymd(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function prettyDate(ymdStr) {
  if (!ymdStr) return ''
  const [y, m, d] = ymdStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

// --- 30-min slots, 8:00 AM – 4:30 PM ---
function buildSlots() {
  const out = []
  for (let h = 8; h <= 16; h++) {
    for (const m of [0, 30]) {
      const ampm = h >= 12 ? 'PM' : 'AM'
      const hr12 = h % 12 === 0 ? 12 : h % 12
      out.push(`${hr12}:${String(m).padStart(2, '0')} ${ampm}`)
    }
  }
  return out
}
const ALL_SLOTS = buildSlots()

function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export default function Book() {
  useReveal([])
  const navigate = useNavigate()
  const today = useMemo(ptNow, [])

  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    serviceId: 'premium',
    exterior: false,
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    vehicle: '',
    notes: '',
  })

  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [booked, setBooked] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (step !== 3 || !data.date) return
    let active = true
    setLoadingSlots(true)
    getBookedSlots(data.date)
      .then((b) => {
        if (active) setBooked(b || [])
      })
      .catch(() => {
        // If the worker isn't reachable yet, show all slots as open.
        if (active) setBooked([])
      })
      .finally(() => active && setLoadingSlots(false))
    return () => {
      active = false
    }
  }, [step, data.date])

  const service = SERVICES.find((s) => s.id === data.serviceId)
  const total = (service?.price || 0) + (data.exterior ? EXTERIOR_ADDON.price : 0)
  const set = (patch) => setData((d) => ({ ...d, ...patch }))

  const canContinue = () => {
    if (step === 1) return !!data.serviceId
    if (step === 2) return true
    if (step === 3) return !!data.date
    if (step === 4) return !!data.time
    if (step === 5)
      return (
        data.name.trim() &&
        data.phone.replace(/\D/g, '').length === 10 &&
        /\S+@\S+\.\S+/.test(data.email) &&
        data.address.trim() &&
        data.vehicle.trim()
      )
    return false
  }

  const next = () => {
    if (!canContinue()) {
      toast.error(
        step === 5 ? 'Please complete all required fields.' : 'Please make a selection to continue.'
      )
      return
    }
    if (step < 5) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/checkout', {
        state: {
          draft: {
            serviceId: data.serviceId,
            serviceName: service.name,
            exterior: data.exterior,
            date: data.date,
            time: data.time,
            name: data.name.trim(),
            phone: data.phone,
            email: data.email.trim(),
            address: data.address.trim(),
            vehicle: data.vehicle.trim(),
            notes: data.notes.trim(),
            basePrice: service.price,
            exteriorPrice: data.exterior ? EXTERIOR_ADDON.price : 0,
            total,
          },
        },
      })
    }
  }

  const back = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  const firstWeekday = new Date(view.getFullYear(), view.getMonth(), 1).getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const todayYmd = ymd(today)
  const atMinMonth =
    view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth()

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(view.getFullYear(), view.getMonth(), d))
  }

  return (
    <div className="book-page">
      <div className="container">
        <div className="book-head fx">
          <span className="eyebrow center">Book Your Detail</span>
          <h1>Reserve your shine</h1>
          <p className="lead" style={{ maxWidth: 520, margin: '0 auto' }}>
            Four quick steps. Pick a package, choose a time, and you’re set.
          </p>
        </div>

        <div className="progress fx">
          {STEPS.map((label, i) => {
            const idx = i + 1
            const state = step === idx ? 'active' : step > idx ? 'done' : ''
            return (
              <div className={`p-node ${state}`} key={label}>
                <span className="p-dot">{step > idx ? <Check size={18} /> : idx}</span>
                <span className="p-label">{label}</span>
                <span className="p-line" />
              </div>
            )
          })}
        </div>

        <div className="book-card fx fx-d1">
          {step === 1 && (
            <>
              <h2 className="step-title">Choose your package</h2>
              <p className="step-desc">Pick your interior detail package. You can add an exterior wash next.</p>
              <div className="opt-list">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    className={`opt ${data.serviceId === s.id ? 'sel' : ''}`}
                    onClick={() => set({ serviceId: s.id })}
                  >
                    <span className="opt-check">{data.serviceId === s.id && <Check />}</span>
                    <span className="opt-body">
                      <span className="pr">${s.price}</span>
                      <span className="nm">{s.name}</span>
                      <span className="ds">{s.tagline}</span>
                      <span className="opt-feats">
                        {s.features.map((f) => (
                          <span className="opt-feat" key={f}>
                            <Check size={14} /> {f}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="step-title">Add an exterior wash?</h2>
              <p className="step-desc">
                Optional — add a full hand wash &amp; shine to your {service.name}. Leave it off to
                continue with interior only.
              </p>
              <div className="opt-list">
                <button
                  className={`opt addon ${data.exterior ? 'sel' : ''}`}
                  onClick={() => set({ exterior: !data.exterior })}
                >
                  <span className="opt-check">{data.exterior && <Check />}</span>
                  <span className="opt-body">
                    <span className="pr">+${EXTERIOR_ADDON.price}</span>
                    <span className="nm">
                      <Droplets
                        size={16}
                        style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--aqua-deep)' }}
                      />
                      Add {EXTERIOR_ADDON.name}
                    </span>
                    <span className="ds">
                      Hand wash, rims, tire scrub, door jambs &amp; spot-free hand dry.
                    </span>
                    <span className="opt-feats">
                      {EXTERIOR_ADDON.features.map((f) => (
                        <span className="opt-feat" key={f}>
                          <Check size={14} /> {f}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="step-title">Pick a date</h2>
              <p className="step-desc">Choose the day you’d like your {service.name.toLowerCase()}.</p>
              <div className="cal">
                <div className="cal-head">
                  <button
                    className="cal-nav"
                    aria-label="Previous month"
                    disabled={atMinMonth}
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="mo">
                    {MONTHS[view.getMonth()]} {view.getFullYear()}
                  </span>
                  <button
                    className="cal-nav"
                    aria-label="Next month"
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="cal-grid">
                  {DOW.map((d) => (
                    <span className="cal-dow" key={d}>
                      {d}
                    </span>
                  ))}
                  {cells.map((cell, i) => {
                    if (!cell) return <span className="cal-day empty" key={`e${i}`} />
                    const cellYmd = ymd(cell)
                    const isPast = cellYmd < todayYmd
                    const isSel = data.date === cellYmd
                    return (
                      <button
                        key={cellYmd}
                        className={`cal-day ${isSel ? 'sel' : ''}`}
                        disabled={isPast}
                        onClick={() => set({ date: cellYmd, time: '' })}
                      >
                        {cell.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
              {data.date && (
                <p style={{ marginTop: 16, color: 'var(--text-2)', fontSize: '0.92rem' }}>
                  Selected: <b style={{ color: 'var(--text)' }}>{prettyDate(data.date)}</b>
                </p>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="step-title">Pick a time</h2>
              <p className="step-desc">
                Times for <b>{prettyDate(data.date)}</b> · 30-minute slots.
              </p>
              {loadingSlots ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: 'var(--text-2)',
                    padding: '30px 0',
                  }}
                >
                  <Loader2 size={20} className="spin" /> Checking availability…
                </div>
              ) : (
                <div className="slots">
                  {ALL_SLOTS.map((t) => {
                    const taken = booked.includes(t)
                    return (
                      <button
                        key={t}
                        className={`slot ${data.time === t ? 'sel' : ''}`}
                        disabled={taken}
                        onClick={() => set({ time: t })}
                        title={taken ? 'Already booked' : ''}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="step-title">Your details</h2>
              <p className="step-desc">Where we’re headed and how to reach you.</p>

              <div className="mini-summary">
                <span className="ms-left">
                  <span className="ms-svc">
                    {service.name}
                    {data.exterior ? ' + Exterior Wash' : ''}
                  </span>
                  <span className="ms-when">
                    {prettyDate(data.date)} · {data.time}
                  </span>
                </span>
                <span className="ms-total">${total}</span>
              </div>

              <div className="field">
                <label htmlFor="name">Full name *</label>
                <input
                  id="name"
                  value={data.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="phone">Phone *</label>
                  <div className="phone-input">
                    <span className="phone-flag">
                      <img src="https://flagcdn.com/w40/us.png" alt="USA" />
                      +1
                    </span>
                    <input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => set({ phone: formatPhone(e.target.value) })}
                      placeholder="(714) 555-0199"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => set({ email: e.target.value })}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="address">Service address *</label>
                <input
                  id="address"
                  value={data.address}
                  onChange={(e) => set({ address: e.target.value })}
                  placeholder="123 Brea Blvd, Brea, CA"
                  autoComplete="street-address"
                />
              </div>

              <div className="field">
                <label htmlFor="vehicle">
                  <Car
                    size={15}
                    style={{ verticalAlign: '-2px', marginRight: 6, color: 'var(--aqua-deep)' }}
                  />
                  Vehicle (year, make &amp; model) *
                </label>
                <input
                  id="vehicle"
                  value={data.vehicle}
                  onChange={(e) => set({ vehicle: e.target.value })}
                  placeholder="2021 Toyota RAV4 — Silver"
                />
              </div>

              <div className="field">
                <label htmlFor="notes">Notes for our team (optional)</label>
                <textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                  placeholder="Gate code, pet hair, specific stains, where to park…"
                />
              </div>
            </>
          )}

          <div className="step-nav">
            <button className="btn btn-outline" onClick={back}>
              <ChevronLeft size={18} /> {step === 1 ? 'Home' : 'Back'}
            </button>
            <button className="btn btn-primary" onClick={next} disabled={!canContinue()}>
              {step === 5 ? 'Continue to Payment' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="book-actionbar">
        <button className="btn btn-back" onClick={back} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
        <button className="btn btn-primary btn-continue" onClick={next} disabled={!canContinue()}>
          {step === 5 ? 'Continue to Payment' : 'Continue'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
