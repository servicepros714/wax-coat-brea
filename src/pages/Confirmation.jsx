import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import {
  Check,
  CalendarDays,
  Clock,
  Car,
  MapPin,
  Phone,
  BadgeCheck,
  Home,
} from 'lucide-react'
import { SITE } from '../lib/site'

function prettyDate(ymdStr) {
  if (!ymdStr) return ''
  const [y, m, d] = ymdStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Confirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  if (!booking) return <Navigate to="/" replace />

  const paid = booking.paidNow

  return (
    <div className="confirm-wrap">
      <div className="confirm-card">
        <div className="confirm-check">
          <Check size={44} strokeWidth={3} />
        </div>

        <span className="eyebrow center" style={{ justifyContent: 'center' }}>
          Booking Confirmed
        </span>
        <h1 className="h-xl" style={{ margin: '14px 0 6px' }}>
          You’re on the schedule
        </h1>
        <p className="lead">
          Thanks, {booking.name.split(' ')[0]}. We’ll send a confirmation to{' '}
          <b style={{ color: 'var(--text)' }}>{booking.email}</b> and text a reminder before your
          appointment.
        </p>

        <span className="confirm-id">Booking #{booking.id}</span>

        <div className="confirm-detail">
          <div className="cd-row">
            <span className="k">
              <BadgeCheck /> Service
            </span>
            <span className="val">{booking.service}</span>
          </div>
          <div className="cd-row">
            <span className="k">
              <CalendarDays /> Date
            </span>
            <span className="val">{prettyDate(booking.date)}</span>
          </div>
          <div className="cd-row">
            <span className="k">
              <Clock /> Time
            </span>
            <span className="val">{booking.time}</span>
          </div>
          <div className="cd-row">
            <span className="k">
              <Car /> Vehicle
            </span>
            <span className="val">{booking.vehicle}</span>
          </div>
          <div className="cd-row">
            <span className="k">
              <MapPin /> Address
            </span>
            <span className="val">{booking.address}</span>
          </div>
          <div className="cd-row">
            <span className="k">
              <BadgeCheck /> Payment
            </span>
            <span className="val">
              {paid ? (
                <span style={{ color: 'var(--aqua-deep)' }}>Paid · ${booking.total}</span>
              ) : (
                <span>Pay on arrival · ${booking.total}</span>
              )}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <a className="btn btn-primary btn-block btn-lg" href={SITE.phoneHref}>
            <Phone size={18} /> Call us at {SITE.phone}
          </a>
          <button className="btn btn-outline btn-block" onClick={() => navigate('/')}>
            <Home size={18} /> Back to home
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--text-2)' }}>
          Need to reschedule? Just give us a call and we’ll find a new time.
        </p>
      </div>
    </div>
  )
}
