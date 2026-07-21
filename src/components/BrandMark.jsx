// A compact chrome sports-car mark with an aqua shine + water drop,
// echoing the Wax Coat logo. Pure SVG so it scales crisply anywhere.
export default function BrandMark({ size = 38, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wc-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBFDFE" />
          <stop offset="0.46" stopColor="#D4DEE5" />
          <stop offset="0.56" stopColor="#94A3B0" />
          <stop offset="1" stopColor="#E7EEF2" />
        </linearGradient>
        <linearGradient id="wc-aqua" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#63D6FF" />
          <stop offset="0.5" stopColor="#00B4F0" />
          <stop offset="1" stopColor="#0086C7" />
        </linearGradient>
      </defs>

      {/* rounded badge */}
      <rect x="1.5" y="1.5" width="61" height="61" rx="16" fill="#0A121A" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="16"
        stroke="url(#wc-aqua)"
        strokeWidth="1.6"
        opacity="0.5"
      />

      {/* car silhouette */}
      <path
        d="M9 36c1-1.6 3.3-2.4 6-2.6l5.4-6.2c1.4-1.6 3.4-2.5 5.5-2.6l12.8-.4c3.3-.1 6.5 1.2 8.8 3.6l3.4 3.5c2.4.4 4.3 1.2 5.6 2.5.9.9 1.2 2.1 1 3.3l-.4 2.3c-.2 1-1 1.7-2 1.8"
        fill="url(#wc-chrome)"
      />
      <path
        d="M9 36c1-1.6 3.3-2.4 6-2.6l5.4-6.2c1.4-1.6 3.4-2.5 5.5-2.6l12.8-.4c3.3-.1 6.5 1.2 8.8 3.6l3.4 3.5c2.4.4 4.3 1.2 5.6 2.5.9.9 1.2 2.1 1 3.3l-.4 2.3c-.2 1-1 1.7-2 1.8"
        stroke="#EAF1F5"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />
      {/* windshield sweep in aqua */}
      <path
        d="M24 25.6c1.3-.1 12-.4 12-.4 2.2-.1 4.4.7 6 2.2l2.2 2.1-18 .5 -4.2.1z"
        fill="url(#wc-aqua)"
        opacity="0.9"
      />
      {/* shine spark */}
      <path
        d="M47 25.5l1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1z"
        fill="#EAFBFF"
      />

      {/* wheels */}
      <circle cx="22" cy="41" r="4.4" fill="#0A121A" stroke="url(#wc-chrome)" strokeWidth="1.6" />
      <circle cx="45" cy="41" r="4.4" fill="#0A121A" stroke="url(#wc-chrome)" strokeWidth="1.6" />

      {/* water drops */}
      <path d="M31 47.5c0 1.3-1 2.3-2.2 2.3s-2.2-1-2.2-2.3c0-1.3 2.2-3.6 2.2-3.6s2.2 2.3 2.2 3.6z" fill="url(#wc-aqua)" />
      <path d="M38.5 48c0 1-.8 1.8-1.7 1.8s-1.7-.8-1.7-1.8c0-1 1.7-2.8 1.7-2.8s1.7 1.8 1.7 2.8z" fill="url(#wc-aqua)" opacity="0.75" />
    </svg>
  )
}
