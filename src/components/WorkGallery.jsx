import { useState } from 'react'

// Recent work gallery: one chrome-framed hero shot with a thumbnail row
// beneath it. Swap the paths/tags below for your own photos — drop the
// files in `public/work/` and keep the array in this order.
const WORK = [
  {
    src: '/work/work-1.jpg',
    tag: 'Premium Detail',
    alt: 'Interior shampooed, extracted, and UV-protected after a premium detail',
  },
  {
    src: '/work/work-2.jpg',
    tag: 'Interior Extraction',
    alt: 'Hot-water extraction pulling dirt from cloth seats and carpet',
  },
  {
    src: '/work/work-3.jpg',
    tag: 'Exterior Wash',
    alt: 'Hand-washed paint dried spot-free with a finishing wax coat',
  },
]

export default function WorkGallery({ items = WORK }) {
  const [active, setActive] = useState(0)
  const current = items[active]

  return (
    <div className="wg">
      <figure className="wg-frame">
        <div className="wg-inner">
          <img src={current.src} alt={current.alt} />
          <span className="wg-gloss" aria-hidden="true" />
          <figcaption className="wg-tag">{current.tag}</figcaption>
        </div>
      </figure>

      <div className="wg-thumbs">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={`wg-thumb${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Show ${item.tag}`}
            aria-pressed={i === active}
          >
            <img src={item.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
