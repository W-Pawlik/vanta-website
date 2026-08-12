/**
 * Three packages. `featured` decides who wears the "most popular" label — the label
 * text itself is one string in the dictionaries, not a per-package field.
 *
 * Names, taglines, feature lists and CTA copy live in the dictionaries.
 */
export const PACKAGE_SLUGS = ['refresh', 'signature', 'black-label'] as const

export type PackageSlug = (typeof PACKAGE_SLUGS)[number]

export type Package = {
  slug: PackageSlug
  priceFrom: number
  featured: boolean
  /** Roughly what the same scope costs bought service by service. Shown quietly. */
  separateValue?: number
}

export const packages: readonly Package[] = [
  { slug: 'refresh', priceFrom: 699, featured: false },
  { slug: 'signature', priceFrom: 1799, featured: true, separateValue: 2150 },
  { slug: 'black-label', priceFrom: 3499, featured: false },
]
