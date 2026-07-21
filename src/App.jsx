import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import Home from './pages/Home'
import Book from './pages/Book'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'

// Routes where the site's mobile action bar (Call / Book) is hidden.
const HIDE_BAR = ['/book', '/checkout', '/confirmation']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const showBar = !HIDE_BAR.some((p) => pathname.startsWith(p))

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className={showBar ? 'has-mbar' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {showBar && <Footer />}
      {showBar && <MobileActionBar />}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '14px',
            background: '#0d141d',
            color: '#fbfdfe',
            fontFamily: 'DM Sans, sans-serif',
            border: '1px solid rgba(99,214,255,0.25)',
          },
          success: { iconTheme: { primary: '#00b4f0', secondary: '#fff' } },
        }}
      />
    </>
  )
}
