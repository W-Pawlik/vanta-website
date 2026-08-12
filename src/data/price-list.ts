/**
 * The detailed price list, shown in a drawer rather than as a section.
 *
 * This is the layer that was missing: a visitor who wants one specific thing —
 * wheels cleaned, a single seat shampooed, tar removed, glass sealed — previously
 * had no way to find out roughly what it costs, so the page implied the studio only
 * sells big jobs.
 *
 * It is deliberately **not** a section: twenty-odd rows on the page would wreck the
 * minimal flow. Three levels of the offer, in order of commitment:
 * Services (what we do) → this list (what one thing costs) → Packages (a ready set).
 *
 * Item keys are globally unique so the dictionary can stay a flat record.
 * `services-copy.test.ts` guards that every key here has copy in both languages.
 */
export const PRICE_GROUPS = ['paint', 'wheels', 'interior', 'glass', 'additional'] as const

export type PriceGroup = (typeof PRICE_GROUPS)[number]

export type PriceListItem = {
  key: string
  priceFrom: number
  /** Priced per item rather than per car — e.g. shampooing a single seat. */
  perUnit?: boolean
}

export const priceList: Record<PriceGroup, readonly PriceListItem[]> = {
  paint: [
    { key: 'detailing-wash', priceFrom: 120 },
    { key: 'decontamination', priceFrom: 180 },
    { key: 'clay-bar', priceFrom: 150 },
    { key: 'correction-one-step', priceFrom: 900 },
    { key: 'correction-two-step', priceFrom: 1400 },
    { key: 'correction-multi-step', priceFrom: 1900 },
  ],
  wheels: [
    { key: 'wheel-detailing', priceFrom: 180 },
    { key: 'wheel-decontamination', priceFrom: 120 },
    { key: 'wheel-ceramic', priceFrom: 350 },
    { key: 'tyre-dressing', priceFrom: 60 },
  ],
  interior: [
    { key: 'seat-shampoo', priceFrom: 80, perUnit: true },
    { key: 'upholstery-shampoo', priceFrom: 450 },
    { key: 'leather-cleaning', priceFrom: 250 },
    { key: 'leather-conditioning', priceFrom: 180 },
    { key: 'ozone', priceFrom: 120 },
  ],
  glass: [
    { key: 'glass-polishing', priceFrom: 200 },
    { key: 'glass-hydrophobic', priceFrom: 150 },
    { key: 'glass-full-set', priceFrom: 350 },
  ],
  additional: [
    { key: 'engine-bay', priceFrom: 180 },
    { key: 'tar-removal', priceFrom: 100 },
    { key: 'iron-fallout', priceFrom: 120 },
    { key: 'presale-preparation', priceFrom: 450 },
  ],
}

/** Flat list of every item key, for iteration and for the copy-completeness test. */
export const ALL_PRICE_ITEM_KEYS = PRICE_GROUPS.flatMap((group) =>
  priceList[group].map((item) => item.key),
)
