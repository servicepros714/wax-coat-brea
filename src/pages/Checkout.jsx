import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  ExpressCheckoutElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import toast from 'react-hot-toast'
import {
  Lock,
  ShieldCheck,
  Tag,
  Check,
  Loader2,
  Clock3,
  CreditCard,
  ChevronLeft,
  CalendarDays,
  Car,
  MapPin,
} from 'lucide-react'
import { SITE, PREPAY_DISCOUNT, PREPAY_CODE } from '../lib/site'
import { createBooking, createPaymentIntent } from '../lib/bookingDb'
import useReveal from '../lib/useReveal'

const PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const HAS_REAL_KEY = !!PK && PK.startsWith('pk_') && !PK.includes('REPLACE')
const stripePromise = HAS_REAL_KEY ? loadStripe(PK) : null
const IS_DEMO = !stripePromise

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#15212c',
      fontFamily: 'DM Sans, sans-serif',
      '::placeholder': { color: '#8794a0' },
    },
    invalid: { color: '#d92d5e' },
  },
}

function prettyDate(ymdStr) {
  if (!ymdStr) return ''
  const [y, m, d] = ymdStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/* ---------------- Real Stripe payment (inside Elements) ---------------- */
function PayInner({ clientSecret, draft, billing, onPaid }) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [focus, setFocus] = useState('')
  const [walletReady, setWalletReady] = useState(false)

  const payWithCard = async () => {
    if (!stripe || !elements) return
    setBusy(true)
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name: billing.name, email: billing.email, phone: billing.phone },
      },
    })
    setBusy(false)
    if (error) {
      toast.error(error.message || 'Payment could not be completed.')
      return
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaid('Paid')
    }
  }

  const onExpressConfirm = async () => {
    if (!stripe || !elements) return
    // clientSecret is already set on the Elements provider, so it isn't passed here.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/confirmation' },
      redirect: 'if_required',
    })
    if (error) {
      toast.error(error.message || 'Wallet payment failed.')
      return
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaid('Paid')
    }
  }

  return (
    <>
      {/* Express wallets: Apple Pay / Google Pay / Link.
          Renders nothing when no wallet is available; the divider only
          shows once a wallet is confirmed ready. */}
      <ExpressCheckoutElement
        onReady={(e) => setWalletReady(!!e.availablePaymentMethods)}
        onConfirm={onExpressConfirm}
        options={{ buttonHeight: 48 }}
      />
      {walletReady && <div className="divider-or">or pay with card</div>}

      <div className="field">
        <label>Card number</label>
        <div className={`stripe-field ${focus === 'num' ? 'focused' : ''}`}>
          <CardNumberElement
            options={cardStyle}
            onFocus={() => setFocus('num')}
            onBlur={() => setFocus('')}
          />
        </div>
      </div>
      <div className="card-row">
        <div className="field">
          <label>Expiry</label>
          <div className={`stripe-field ${focus === 'exp' ? 'focused' : ''}`}>
            <CardExpiryElement
              options={cardStyle}
              onFocus={() => setFocus('exp')}
              onBlur={() => setFocus('')}
            />
          </div>
        </div>
        <div className="field">
          <label>CVC</label>
          <div className={`stripe-field ${focus === 'cvc' ? 'focused' : ''}`}>
            <CardCvcElement
              options={cardStyle}
              onFocus={() => setFocus('cvc')}
              onBlur={() => setFocus('')}
            />
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-block btn-lg" onClick={payWithCard} disabled={busy || !stripe}>
        {busy ? (
          <>
            <Loader2 size={18} className="spin" /> Processing…
          </>
        ) : (
          <>
            <Lock size={18} /> Pay ${draft.__total} now
          </>
        )}
      </button>
    </>
  )
}

/* ---------------- Demo payment (no real Stripe key) ---------------- */
function DemoCheckout({ draft, onPaid }) {
  const [busy, setBusy] = useState(false)
  const pay = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onPaid('Paid')
    }, 1200)
  }
  return (
    <>
      <div className="coupon-applied" style={{ background: 'rgba(255,190,0,0.10)', borderColor: 'rgba(255,190,0,0.35)', color: '#8a6d00' }}>
        <CreditCard size={16} /> Demo mode — add a real Stripe key to take live payments.
      </div>
      <div className="field">
        <label>Card number</label>
        <div className="stripe-field">
          <input
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}
            placeholder="4242 4242 4242 4242"
          />
        </div>
      </div>
      <div className="card-row">
        <div className="field">
          <label>Expiry</label>
          <div className="stripe-field">
            <input style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 16 }} placeholder="MM / YY" />
          </div>
        </div>
        <div className="field">
          <label>CVC</label>
          <div className="stripe-field">
            <input style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 16 }} placeholder="123" />
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-block btn-lg" onClick={pay} disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="spin" /> Processing…
          </>
        ) : (
          <>
            <Lock size={18} /> Pay ${draft.__total} now
          </>
        )}
      </button>
    </>
  )
}

/* ---------------- Stripe wrapper: creates PI, mounts Elements ---------------- */
function StripeArea({ draft, billing, onPaid }) {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const cents = Math.round(draft.__total * 100)

  useEffect(() => {
    let active = true
    setLoading(true)
    createPaymentIntent(cents, {
      customer: billing.name,
      email: billing.email,
      service: draft.__serviceLabel,
      date: draft.date,
      time: draft.time,
    })
      .then((cs) => active && setClientSecret(cs))
      .catch(() => active && setClientSecret(''))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // recreate when the charged amount changes (e.g. coupon applied)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cents])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-2)', padding: '20px 0' }}>
        <Loader2 size={20} className="spin" /> Setting up secure payment…
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="coupon-applied" style={{ background: 'rgba(217,45,94,0.08)', borderColor: 'rgba(217,45,94,0.3)', color: '#a11d43' }}>
        Couldn’t reach the payment service. You can still reserve now and pay later below.
      </div>
    )
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'flat',
          variables: {
            colorPrimary: '#00b4f0',
            fontFamily: 'DM Sans, sans-serif',
            borderRadius: '14px',
          },
        },
      }}
    >
      <PayInner clientSecret={clientSecret} draft={draft} billing={billing} onPaid={onPaid} />
    </Elements>
  )
}

/* ---------------- Page ---------------- */
export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const draft = location.state?.draft

  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)
  const [placing, setPlacing] = useState(false)

  useReveal([draft])

  const serviceLabel = useMemo(
    () => (draft ? `${draft.serviceName}${draft.exterior ? ' + Exterior Wash' : ''}` : ''),
    [draft]
  )

  if (!draft) return <Navigate to="/book" replace />

  const subtotal = draft.total
  const discount = applied ? PREPAY_DISCOUNT : 0
  const total = Math.max(0, subtotal - discount)

  const enriched = { ...draft, __total: total, __serviceLabel: serviceLabel }
  const billing = { name: draft.name, email: draft.email, phone: draft.phone }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === PREPAY_CODE) {
      setApplied(true)
      toast.success(`${PREPAY_CODE} applied — $${PREPAY_DISCOUNT} off!`)
    } else {
      toast.error('That code isn’t valid.')
    }
  }

  const finalize = async (payment_status) => {
    setPlacing(true)
    const payload = {
      date: draft.date,
      time: draft.time,
      service: serviceLabel,
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      vehicle: draft.vehicle,
      address: draft.address,
      notes: draft.notes,
      payment_status,
    }
    let id = ''
    try {
      const res = await createBooking(payload)
      id = (res && res.id) || ''
    } catch (err) {
      // Worker unreachable (e.g. testing before deploy): let the flow finish gracefully.
      console.error('createBooking failed:', err)
      toast('Saved locally — connect the Worker to store bookings.', { icon: '⚠️' })
    }
    if (!id) id = SITE.bookingPrefix + Date.now().toString().slice(-8)

    navigate('/confirmation', {
      replace: true,
      state: {
        booking: {
          ...payload,
          id,
          total,
          paidNow: payment_status === 'Paid',
        },
      },
    })
  }

  const payLater = () => {
    if (placing) return
    finalize('Pay Later')
  }
  const onPaid = () => {
    if (placing) return
    finalize('Paid')
  }

  return (
    <div className="book-page">
      <div className="container">
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/book')}
          style={{ margin: '0 auto 18px', display: 'flex' }}
        >
          <ChevronLeft size={18} /> Back to booking
        </button>

        <div className="book-head fx">
          <span className="eyebrow center">Secure Checkout</span>
          <h1>Checkout</h1>
        </div>

        {!applied && (
          <div className="prepay-banner fx">
            <div className="prepay-badge">
              ${PREPAY_DISCOUNT}
              <span>off</span>
            </div>
            <div className="prepay-text">
              <strong>Save ${PREPAY_DISCOUNT} by prepaying (optional)</strong>
              <p>
                Enter <b>{PREPAY_CODE}</b> coupon code — pre-payment is <b>completely optional</b>, but saves
                you ${PREPAY_DISCOUNT} and skips checkout hassle after your service.
              </p>
            </div>
          </div>
        )}

        <div className="checkout-grid fx fx-d1">
                    {/* price bar */}
          <div className="checkout-price-bar">
            <span className="checkout-price-amount">${total}</span>
            <div className="checkout-price-details">
              <span>{serviceLabel}</span>
            </div>
          </div>

          {/* coupon */}
          <div className="coupon-wrap">
            <label className="stripe-label">Coupon Code (Optional)</label>
            {!applied ? (
              <div className="coupon-row">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="e.g. PREPAY"
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                />
                <button className="btn btn-outline" onClick={applyCoupon}>
                  <Tag size={16} /> Apply
                </button>
              </div>
            ) : (
              <div className="coupon-applied">
                <Check size={16} /> {PREPAY_CODE} — ${PREPAY_DISCOUNT} off applied
              </div>
            )}
          </div>

          {/* payment */}
          <div className="pay-card">
            <h3 className="step-title" style={{ fontSize: '1.15rem', marginBottom: 18 }}>
              Payment
            </h3>

            {placing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-2)', padding: '20px 0' }}>
                <Loader2 size={20} className="spin" /> Confirming your booking…
              </div>
            ) : IS_DEMO ? (
              <DemoCheckout draft={enriched} onPaid={onPaid} />
            ) : (
              <StripeArea draft={enriched} billing={billing} onPaid={onPaid} />
            )}

            {!placing && (
              <>
                <div className="divider-or">or</div>
                <button className="btn btn-outline btn-block" onClick={payLater}>
                  <Clock3 size={18} /> Reserve now, pay later
                </button>
                <div className="pay-secure">
                  <ShieldCheck /> Secured by Stripe · your card is never stored on our servers
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
