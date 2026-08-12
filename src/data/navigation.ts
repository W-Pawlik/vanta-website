/**
 * Section ids double as scroll anchors and appear in the URL, so they are kept
 * language-neutral English — `#uslugi` on the English page would read as sloppy.
 * Sections must render the matching `id`.
 */
export const SECTION_IDS = {
  services: 'services',
  work: 'work',
  process: 'process',
  packages: 'packages',
  lead: 'quote',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

/** Nav order. Labels come from the dictionary, keyed by these values. */
export const NAV_ITEM_KEYS = ['services', 'work', 'process', 'packages'] as const

export type NavItemKey = (typeof NAV_ITEM_KEYS)[number]

export const primaryCtaHref = `#${SECTION_IDS.lead}` as const
