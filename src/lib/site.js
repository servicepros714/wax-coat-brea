// ============================================================
// Wax Coat Car Detailing — Brea | site-wide config
// Source tag + booking prefix are UNIQUE to this site.
// ============================================================

export const SITE = {
  name: 'Wax Coat Car Detailing',
  city: 'Brea, CA',
  shortName: 'Wax Coat Brea',
  phone: '(714) 582-1312',
  phoneHref: 'tel:+17145821312',
  email: 'book@waxcoatbrea.com',
  address: 'Brea, CA',
  // --- Worker / D1 identifiers (do not reuse across sites) ---
  source: 'wax-coat-brea',
  bookingPrefix: 'WCB-',
}

// Default Service Pros service menu (identical across the portfolio)
export const SERVICES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
    tagline: 'Interior refresh, done right.',
    featured: false,
    features: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Detail',
    price: 200,
    tagline: 'The full interior transformation.',
    featured: true,
    features: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating',
    ],
  },
]

// Exterior Wash is an add-on (+$50) that can be layered on either package
export const EXTERIOR_ADDON = {
  id: 'exterior',
  name: 'Exterior Wash',
  price: 50,
  tagline: 'Add the outside shine.',
  features: [
    'Hand-Washed Exterior',
    'Detailed Rim Cleaning',
    'Tire Scrub and Degrease',
    'Door Jamb & Panel Wipe-Down',
    'Premium Tire Shine Application',
    'Spot-Free Hand Drying',
  ],
}

export const PREPAY_DISCOUNT = 15 // PREPAY coupon = $15 off when paying now
export const PREPAY_CODE = 'PREPAY'
