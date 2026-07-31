import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, ArrowRight } from 'lucide-react'
import logo from '../assets/logo.png'
import { SITE } from '../lib/site'

const LINKS = [
  { label: 'Services', to: '/#services' },
  { label: 'Results', to: '/#results' },
  { label: 'Process', to: '/#process' },
  { label: 'Reviews', to: '/#reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (to) => {
    setOpen(false)
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(to)
    }
  }

  return (
    <>
      <div className={`nav-wrap ${scrolled ? 'scrolled' : ''}`}>
        <nav className="nav" aria-label="Primary">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <img src={logo} alt="Wax Coat Car Detailing — Brea" className="brand-mark" />
          </Link>

          <div className="nav-links">
            {LINKS.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.to)
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="nav-cta">
            <a className="nav-phone" href={SITE.phoneHref}>
              <Phone /> {SITE.phone}
            </a>
            <Link className="btn btn-primary" to="/book">
              Book Online
            </Link>
            <button
              className="hamburger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </div>

      {/* mobile overlay */}
      <div className={`m-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="m-menu-top">
          <span className="brand">
            <img src={logo} alt="Wax Coat Car Detailing — Brea" className="brand-mark" />
          </span>
          <button className="m-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="m-links">
          {LINKS.map((l, i) => (
            <a
              key={l.to}
              href={l.to}
              onClick={(e) => {
                e.preventDefault()
                go(l.to)
              }}
            >
              {l.label}
              <span className="idx">0{i + 1}</span>
            </a>
          ))}
        </div>

        <div className="m-menu-foot">
          <a className="btn btn-outline btn-block" href={SITE.phoneHref}>
            <Phone size={18} /> {SITE.phone}
          </a>
          <button
            className="btn btn-primary btn-block"
            onClick={() => go('/book')}
          >
            Book Online <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
