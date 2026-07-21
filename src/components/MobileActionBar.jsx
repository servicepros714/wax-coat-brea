import { useNavigate } from 'react-router-dom'
import { Phone, CalendarCheck } from 'lucide-react'
import { SITE } from '../lib/site'

// Site-wide mobile action bar. Shown on marketing pages only;
// App.jsx hides it on /book, /checkout, /confirmation.
export default function MobileActionBar() {
  const navigate = useNavigate()
  return (
    <div className="m-actionbar" role="navigation" aria-label="Quick actions">
      <a className="btn btn-call" href={SITE.phoneHref}>
        <Phone size={18} /> Call Now
      </a>
      <button className="btn btn-primary" onClick={() => navigate('/book')}>
        <CalendarCheck size={18} /> Book Online
      </button>
    </div>
  )
}
