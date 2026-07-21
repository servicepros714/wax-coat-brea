import { useCallback, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

// Chrome-framed before/after reveal.
// `after` sits on top and is clipped from the left as the handle moves.
// Drop in real photos via the `before` / `after` image props; when omitted,
// styled gradient placeholders render so the layout still looks finished.
export default function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After' }) {
  const [pos, setPos] = useState(50)
  const frameRef = useRef(null)
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, pct)))
  }, [])

  const onDown = (e) => {
    dragging.current = true
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX)
  }
  const onMove = (e) => {
    if (!dragging.current) return
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }

  return (
    <div className="ba-frame">
      <div
        className="ba-inner"
        ref={frameRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        role="slider"
        aria-label="Drag to compare before and after"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4))
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4))
        }}
      >
        {/* base = before */}
        {before ? (
          <img className="ba-layer" src={before} alt={beforeLabel} draggable="false" />
        ) : (
          <div className="ba-layer ba-ph before">Your “before” photo</div>
        )}

        {/* top = after, clipped from the left */}
        {after ? (
          <img
            className="ba-layer ba-after"
            src={after}
            alt={afterLabel}
            draggable="false"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          />
        ) : (
          <div
            className="ba-layer ba-after ba-ph after"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            Freshly wax-coated
          </div>
        )}

        <span className="ba-tag before">{beforeLabel}</span>
        <span className="ba-tag after">{afterLabel}</span>

        <div className="ba-handle" style={{ left: `${pos}%` }}>
          <div className="ba-knob">
            <ChevronsLeftRight />
          </div>
        </div>
      </div>
    </div>
  )
}
