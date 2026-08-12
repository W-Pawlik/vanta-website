/**
 * Four service categories, each with its own price variants.
 *
 * The categories were deliberately renamed away from the earlier list:
 *
 * - `Powłoka ceramiczna` → **Ochrona lakieru**, because a coating is one option
 *   inside a wider category that also covers wax and sealant.
 * - `Full Detail` → **Usługi dodatkowe**. Full Detail is a *package*, not a service
 *   category, and having it in both places was the source of the overlap between
 *   Services and Packages.
 *
 * Structure and numbers only — every string lives in the dictionaries, keyed by
 * `slug` and by variant `key`. `services-copy.test.ts` guards that mapping.
 */
export const SERVICE_SLUGS = [
  'paint-correction',
  'paint-protection',
  'interior',
  'additional',
] as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[number]

export type ServiceVariant = {
  key: string
  /** Starting price in PLN. Formatted by formatPriceFrom(), never stored formatted. */
  priceFrom: number
}

export type Service = {
  slug: ServiceSlug
  image: string
  variants: readonly ServiceVariant[]
}

export const services: readonly Service[] = [
  {
    slug: 'paint-correction',
    image: '/images/service-paint-correction.jpg',
    variants: [
      { key: 'one-step', priceFrom: 900 },
      { key: 'two-step', priceFrom: 1400 },
      { key: 'multi-step', priceFrom: 1900 },
    ],
  },
  {
    slug: 'paint-protection',
    image: '/images/service-ceramic-coating.jpg',
    variants: [
      { key: 'wax', priceFrom: 350 },
      { key: 'ceramic-1y', priceFrom: 900 },
      { key: 'ceramic-3y', priceFrom: 1600 },
      { key: 'ceramic-5y', priceFrom: 2400 },
    ],
  },
  {
    slug: 'interior',
    image: '/images/service-interior.jpg',
    variants: [
      { key: 'basic', priceFrom: 450 },
      { key: 'full', priceFrom: 750 },
      { key: 'leather', priceFrom: 950 },
    ],
  },
  {
    slug: 'additional',
    image: '/images/service-full-detail.jpg',
    variants: [
      { key: 'wheels', priceFrom: 180 },
      { key: 'engine-bay', priceFrom: 180 },
      { key: 'glass', priceFrom: 350 },
      { key: 'presale', priceFrom: 450 },
    ],
  },
]

/**
 * The list view shows one number per category: the cheapest variant. Derived rather
 * than stored, so it can never drift from the variants below it.
 */
export function lowestPrice(service: Service): number {
  return Math.min(...service.variants.map((variant) => variant.priceFrom))
}
