import { Link } from 'react-router-dom'
import { Phone, MapPin, Mail, Clock, Instagram, Facebook, Star } from 'lucide-react'
import BrandMark from './BrandMark'
import { SITE } from '../lib/site'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <span className="brand">
              <BrandMark className="brand-mark" size={40} />
              <span className="brand-text">
                <span className="b1">
                  Wax<span style={{ color: 'var(--aqua-glow)' }}>Coat</span>
                </span>
                <span className="b2">Detailing · Brea</span>
              </span>
            </span>
            <p>
              Interior and exterior auto detailing in Brea, CA. We bring the showroom shine to your
              driveway with a hydrophobic wax coat that beads water and holds its gloss.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--aqua-glow)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span style={{ color: 'var(--chrome-2)', fontSize: '0.85rem', marginLeft: 4 }}>
                Rated 5.0 by local drivers
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <a href="/#services">Detail Packages</a>
            <a href="/#results">Before &amp; After</a>
            <a href="/#process">How It Works</a>
            <a href="/#reviews">Reviews</a>
            <Link to="/book">Book Online</Link>
          </div>

          <div className="footer-col">
            <h4>Hours</h4>
            <span className="fi">
              <Clock /> Mon–Fri · 8am–5pm
            </span>
            <span className="fi">
              <Clock /> Saturday · 8am–4pm
            </span>
            <span className="fi">
              <Clock /> Sunday · By appointment
            </span>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href={SITE.phoneHref}>
              <Phone /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`}>
              <Mail /> {SITE.email}
            </a>
            <span className="fi">
              <MapPin /> {SITE.address}
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {SITE.name} — {SITE.city}. All rights reserved.
          </span>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
