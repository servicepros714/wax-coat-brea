import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Phone,
  Star,
  Droplets,
  Sparkles,
  ShieldCheck,
  Car,
  Clock,
  MapPin,
  CalendarCheck,
  Hand,
  Waves,
} from 'lucide-react'
import BeforeAfter from '../components/BeforeAfter'
import useReveal from '../lib/useReveal'
import { SITE, SERVICES, EXTERIOR_ADDON } from '../lib/site'

function DropCheck() {
  // water-drop shaped bullet check
  return (
    <svg className="drop-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5s6 6.4 6 10.4A6 6 0 0 1 6 12.9C6 8.9 12 2.5 12 2.5Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M9.6 13.2l1.7 1.7 3.3-3.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3s6 6.4 6 10.4A6 6 0 1 1 6 13.4C6 9.4 12 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.5"
      />
    </svg>
  )
}

function HeroCar() {
  return (
    <svg className="hero-car" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F8FB" />
          <stop offset="0.45" stopColor="#C8D3DB" />
          <stop offset="0.56" stopColor="#8A99A6" />
          <stop offset="1" stopColor="#E2E9EE" />
        </linearGradient>
        <linearGradient id="hc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8DE2FF" />
          <stop offset="1" stopColor="#0093D4" />
        </linearGradient>
      </defs>
      <path
        d="M22 96c3-6 10-9 20-10l24-30c6-8 15-12 25-12l86-2c16 0 31 6 43 17l20 18c17 2 30 6 39 13 6 5 8 12 6 20l-2 9c-1 5-5 8-11 8H30c-6 0-10-4-11-9l-2-11c-1-7 1-14 5-18Z"
        fill="url(#hc-body)"
      />
      <path
        d="M70 55c6-8 15-12 25-12l84-2c15 0 30 6 41 16l14 13-150 3-32 1 18-19Z"
        fill="url(#hc-glass)"
        opacity="0.92"
      />
      <path d="M96 44l73-2 4 32-96 2 19-32Z" fill="#0A121A" opacity="0.28" />
      <circle cx="96" cy="118" r="20" fill="#0A121A" />
      <circle cx="96" cy="118" r="20" stroke="url(#hc-body)" strokeWidth="6" />
      <circle cx="96" cy="118" r="7" fill="#5FD8FF" opacity="0.55" />
      <circle cx="288" cy="118" r="20" fill="#0A121A" />
      <circle cx="288" cy="118" r="20" stroke="url(#hc-body)" strokeWidth="6" />
      <circle cx="288" cy="118" r="7" fill="#5FD8FF" opacity="0.55" />
      <path d="M250 60l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" fill="#EAFBFF" />
    </svg>
  )
}

export default function Home() {
  useReveal([])

  const stripItems = [
    { icon: <Droplets />, t: 'Hydrophobic Wax Coat' },
    { icon: <MapPin />, t: 'Serving Brea & North OC' },
    { icon: <Car />, t: 'Cars · Trucks · SUVs' },
    { icon: <ShieldCheck />, t: 'Fully Insured' },
    { icon: <Clock />, t: 'Same-Week Slots' },
    { icon: <Star />, t: '5-Star Rated' },
  ]

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow fx">Auto Detailing · {SITE.city}</span>
              <h1 className="h-display fx fx-d1">
                Water <span className="txt-aqua">beads.</span> Dirt slides.{' '}
                <span className="txt-chrome">Shine stays.</span>
              </h1>
              <p className="lead fx fx-d2">
                Wax Coat gives your car a slick, hydrophobic finish that repels water and locks in a
                deep, wet-look gloss. Interior deep-cleans and exterior wax coating in Brea — booked
                online in under two minutes.
              </p>
              <div className="hero-actions fx fx-d3">
                <Link to="/book" className="btn btn-primary btn-lg">
                  Book Your Detail <ArrowRight size={18} />
                </Link>
                <a href={SITE.phoneHref} className="btn btn-outline btn-lg">
                  <Phone size={18} /> {SITE.phone}
                </a>
              </div>
              <div className="hero-trust fx fx-d3">
                <div className="trust-chip">
                  <span className="n">1,200+</span>
                  <span className="l">Cars Coated</span>
                </div>
                <div className="trust-chip">
                  <span className="n">5.0★</span>
                  <span className="l">Avg. Rating</span>
                </div>
                <div className="trust-chip">
                  <span className="n">6+ mo</span>
                  <span className="l">Coat Protection</span>
                </div>
              </div>
            </div>

            <div className="hero-visual fx fx-d2">
              <span className="bead b1" />
              <span className="bead b2" />
              <span className="bead b3" />
              <div className="hero-panel">
                <div className="hero-surface" />
                <div className="hero-shine" />
                <HeroCar />
                <div className="hero-badge">
                  <span className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </span>
                  <span className="txt">
                    <b>“Looked brand new.”</b>
                    <br />
                    Real reviews from Brea drivers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* wave divider into next section */}
        <div className="wave-divider">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 44C160 84 320 84 480 60S800 8 960 12s320 52 480 40v38H0V44Z"
              fill="#0d141d"
            />
          </svg>
        </div>
      </section>

      {/* ============ TRUST STRIP (marquee) ============ */}
      <div className="strip">
        <div className="strip-track">
          {[...stripItems, ...stripItems].map((it, i) => (
            <span className="strip-item" key={i}>
              {it.icon} {it.t}
            </span>
          ))}
        </div>
      </div>

      {/* ============ SERVICES ============ */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head center fx">
            <span className="eyebrow center">The Menu</span>
            <h2 className="h-xl" style={{ margin: '14px 0 14px' }}>
              Pick your <span className="txt-aqua">detail package</span>
            </h2>
            <p className="lead">
              Two interior packages, plus an exterior wax coat you can add to either. Straight
              pricing — what you see is what you pay.
            </p>
          </div>

          <div className="svc-grid">
            {SERVICES.map((s, idx) => (
              <div className={`svc-card fx fx-d${idx + 1} ${s.featured ? 'featured' : ''}`} key={s.id}>
                {s.featured && <span className="svc-flag">Most Booked</span>}
                <div className="svc-top">
                  <span className="svc-name">{s.name}</span>
                  <span className="svc-price">${s.price}</span>
                </div>
                <p className="svc-sub">{s.tagline}</p>
                <ul className="svc-list">
                  {s.features.map((f) => (
                    <li key={f}>
                      <DropCheck /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Exterior add-on card */}
            <div className="svc-card fx fx-d3">
              <div className="svc-top">
                <span className="svc-name">{EXTERIOR_ADDON.name}</span>
                <span className="svc-price">
                  <span className="plus">+</span>${EXTERIOR_ADDON.price}
                </span>
              </div>
              <p className="svc-sub">Add the outside shine to any interior package.</p>
              <ul className="svc-list">
                {EXTERIOR_ADDON.features.map((f) => (
                  <li key={f}>
                    <DropCheck /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="svc-cta fx">
            <Link to="/book" className="btn btn-primary btn-lg">
              Book Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ THE COAT DIFFERENCE (ink) ============ */}
      <section className="section section--ink">
        <div className="container">
          <div className="section-head fx">
            <span className="eyebrow">The Coat Difference</span>
            <h2 className="h-xl" style={{ margin: '14px 0 14px' }}>
              Not just clean. <span className="txt-aqua">Coated.</span>
            </h2>
            <p className="lead">
              Anyone can wash a car. Our finishing wax coat is what keeps it looking detailed weeks
              after we leave your driveway.
            </p>
          </div>

          <div className="why-grid">
            {[
              {
                icon: <Droplets />,
                h: 'Water Beads Off',
                p: 'The hydrophobic coat makes rain and rinse water roll straight off, carrying grime with it and cutting down on water spots.',
              },
              {
                icon: <Sparkles />,
                h: 'Deep Wet-Look Gloss',
                p: 'A layered wax finish that reflects light like glass — the "just-detailed" shine that lasts, not a one-day buff.',
              },
              {
                icon: <ShieldCheck />,
                h: 'Real Protection',
                p: 'A sacrificial coat shields your paint from UV, bird droppings, and road film so the clear coat underneath stays healthy.',
              },
            ].map((f, i) => (
              <div className={`why-card fx fx-d${i + 1}`} key={f.h}>
                <span className="why-icon">{f.icon}</span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESULTS (before/after) ============ */}
      <section className="section section--paper2" id="results">
        <div className="container">
          <div className="ba-wrap">
            <div className="fx">
              <span className="eyebrow">See The Shine</span>
              <h2 className="h-xl" style={{ margin: '14px 0 18px' }}>
                Drag to reveal the <span className="txt-aqua">wax coat</span>
              </h2>
              <p className="lead" style={{ marginBottom: 24 }}>
                Same car, same lighting — one side detailed and coated, the other left as it came in.
                Pull the handle across to compare.
              </p>
              <ul className="svc-list" style={{ marginBottom: 28 }}>
                {[
                  'Paint decontaminated and hand-dried spot-free',
                  'Interior extracted, shampooed, and UV-protected',
                  'Finishing wax coat applied by hand for even gloss',
                ].map((t) => (
                  <li key={t} style={{ color: 'var(--text)' }}>
                    <DropCheck /> {t}
                  </li>
                ))}
              </ul>
              <Link to="/book" className="btn btn-primary">
                Get This Result <ArrowRight size={18} />
              </Link>
            </div>
            <div className="fx fx-d1">
              <BeforeAfter />
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-2)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  marginTop: 14,
                }}
              >
                Swap in your own before/after photos in <code>Results</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="section" id="process">
        <div className="container">
          <div className="section-head center fx">
            <span className="eyebrow center">How It Works</span>
            <h2 className="h-xl" style={{ margin: '14px 0 14px' }}>
              Booked to <span className="txt-aqua">coated</span> in four steps
            </h2>
          </div>

          <div className="steps">
            {[
              {
                icon: <CalendarCheck />,
                h: 'Book Online',
                p: 'Choose your package, date, and time. Pay now for $15 off or settle up after.',
              },
              {
                icon: <MapPin />,
                h: 'We Arrive',
                p: 'We come to your Brea driveway or you drop in — whatever works for your day.',
              },
              {
                icon: <Hand />,
                h: 'We Detail',
                p: 'Interior extraction, exterior wash, and the finishing wax coat, all by hand.',
              },
              {
                icon: <Waves />,
                h: 'You Shine',
                p: 'Drive away with a beading, wet-look finish that turns heads and repels water.',
              },
            ].map((s, i) => (
              <div className={`step fx fx-d${i + 1}`} key={s.h}>
                <span className="num">{i + 1}</span>
                <span className="step-icon">{s.icon}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="section section--paper2" id="reviews">
        <div className="container">
          <div className="section-head center fx">
            <span className="eyebrow center">Word On The Street</span>
            <h2 className="h-xl" style={{ margin: '14px 0 14px' }}>
              Brea drivers <span className="txt-aqua">keep coming back</span>
            </h2>
          </div>

          <div className="reviews">
            {[
              {
                q: 'Booked at night, coated by the next afternoon. The water literally rolls off now — my car has never looked this glossy.',
                n: 'Marcus D.',
                m: 'Tesla Model 3 · Brea',
              },
              {
                q: 'The interior looked showroom-new and the exterior coat still beads weeks later. Fair price, zero hassle, easy online booking.',
                n: 'Priya S.',
                m: 'Honda CR-V · Fullerton',
              },
              {
                q: 'These guys are meticulous. Door jambs, rims, the works. The wax coat gloss is unreal in the sun. Already booked my next one.',
                n: 'Anthony R.',
                m: 'Ford F-150 · Brea',
              },
            ].map((r, i) => (
              <div className={`review fx fx-d${i + 1}`} key={r.n}>
                <span className="stars">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} />
                  ))}
                </span>
                <p>“{r.q}”</p>
                <div className="who">
                  <span className="ava">{r.n.charAt(0)}</span>
                  <span>
                    <span className="nm" style={{ display: 'block' }}>
                      {r.n}
                    </span>
                    <span className="mt">{r.m}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="section--tight">
        <div className="container">
          <div className="cta-band fx">
            <div className="txt">
              <span className="eyebrow">Ready when you are</span>
              <h2 className="h-xl" style={{ marginTop: 12 }}>
                Ready for the <span className="txt-aqua">gloss?</span>
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Grab a slot this week. Pay online and take $15 off with code{' '}
                <b style={{ color: 'var(--aqua-glow)' }}>PREPAY</b>.
              </p>
            </div>
            <div className="actions">
              <Link to="/book" className="btn btn-primary btn-lg">
                Book Online <CalendarCheck size={18} />
              </Link>
              <a href={SITE.phoneHref} className="btn btn-outline btn-lg">
                <Phone size={18} /> Call {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
