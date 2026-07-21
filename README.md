# Wax Coat Car Detailing — Brea

Booking website for **Wax Coat Car Detailing** (Brea, CA). Built on the Service Pros
stack: Vite + React 18, React Router, Stripe, Cloudflare Pages + a Cloudflare Worker
writing to the shared `detailing-bookings` D1 database.

Aesthetic: **Liquid Chrome / Hydro-Gloss** — cool white + chrome silver + electric aqua,
pulled from the logo. Deliberately different from every other site in the portfolio
(floating glass pill nav, split diagonal hero, water-bead motif, marquee trust strip,
chrome-framed before/after slider).

---

## Site identifiers (unique — do not reuse)

| Thing | Value |
|---|---|
| `source` tag | `wax-coat-brea` |
| Booking ID prefix | `WCB-` |
| Worker URL | `https://wax-coa-detailing-worker.austin80565.workers.dev` |

> WORKER NAME CHECK: the brief said `wax-coa-detailing-worker` (missing the **t**).
> If that was a typo for `wax-coat-detailing-worker`, deploy the Worker under the correct
> name and update the single `VITE_API_URL` line in `.env.local`.

---

## 1. Run locally

```bash
npm install
npm run dev
```

Out of the box it runs in **demo mode** (the placeholder Stripe key triggers a simulated
checkout) so you can click through the whole flow without a backend. Bookings won't be
stored until the Worker is live.

---

## 2. Front-end env — `.env.local` (committed on purpose)

```
VITE_API_URL=https://wax-coa-detailing-worker.austin80565.workers.dev
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_your_key
```

The publishable key is safe to commit. Replacing the placeholder with a real `pk_...`
key switches checkout from demo mode to live Stripe (Card + Apple Pay / Google Pay / Link).

---

## 3. Deploy the Worker (Cloudflare dashboard — no CLI)

1. Workers & Pages -> Create -> Worker. Name it `wax-coa-detailing-worker`
   (or `wax-coat-detailing-worker` — see the note above). Paste `worker/worker.js`.
2. Settings -> Variables -> D1 database bindings:
   - Variable name: `DB`
   - D1 database: `detailing-bookings`
3. Settings -> Variables -> Secrets:
   - `STRIPE_SECRET_KEY` = your `sk_live_...` (or `sk_test_...`)
4. Deploy. The Worker creates the shared `bookings` table with `IF NOT EXISTS`, so it's
   safe to run alongside every other site's worker.

The Worker enables **`automatic_payment_methods[enabled]=true`** on the PaymentIntent —
this is what makes Stripe Link / Apple Pay / Google Pay work. (The Link button only shows
when Link is enabled in Stripe for the active mode — test vs. live.)

---

## 4. Deploy the site (Cloudflare Pages via GitHub Actions)

Push to `main`. The included `.github/workflows/deploy.yml` runs `npm run build`
(no VITE secret injection) and publishes `dist` to a Pages project named `wax-coat-brea`.

Required GitHub repo secrets:
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

`public/_redirects` handles SPA routing. Build output is `dist`.

---

## 5. Booking flow

`Service -> Date -> Time -> Your Info -> Checkout -> Confirmation`

- 30-minute slots, 8:00 AM – 4:30 PM. Availability is **source-scoped** and uses
  Pacific-time date logic; the Worker also re-checks for double-booking at insert.
- Checkout: real Stripe card confirmation, `ExpressCheckoutElement`, `PREPAY` coupon
  (**$15 off**), price bar, and a **Reserve now, pay later** option
  (`payment_status` = `Paid` / `Pay Later`).
- Mobile: site-wide sticky **Call Now + Book Online** bar (hidden on
  `/book`, `/checkout`, `/confirmation`); the booking steps get their own sticky
  **Back + Continue** bar.

---

## 6. Making it yours

- **Photos:** the before/after slider (`src/components/BeforeAfter.jsx`) shows styled
  gradient placeholders until you pass real `before` / `after` image URLs in
  `src/pages/Home.jsx` (`<BeforeAfter before="..." after="..." />`). Drop images in
  `public/` and reference them as `/your-photo.jpg`.
- **Copy / prices / contact:** everything lives in `src/lib/site.js`.
- **Colors / fonts:** design tokens are the `:root` block at the top of
  `src/styles/index.css`.

---

## Structure

```
src/
  components/  Navbar, Footer, MobileActionBar, BrandMark, BeforeAfter
  pages/       Home, Book, Checkout, Confirmation
  lib/         site.js (config), bookingDb.js (Worker API), useReveal.js
  styles/      index.css (full design system)
worker/        worker.js (Cloudflare Worker -> shared D1)
```
