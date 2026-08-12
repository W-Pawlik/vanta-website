/** Non-breaking space. Written as an escape so it is visible in a diff. */
const NBSP = ' '

/**
 * `useGrouping: 'always'` is deliberate: Polish CLDR sets minimumGroupingDigits
 * to 2, so `1600` would otherwise render as `1600`. The brief specifies `1 600`.
 */
const priceFormatter = new Intl.NumberFormat('pl-PL', {
  maximumFractionDigits: 0,
  useGrouping: 'always',
})

/** `1600` -> `1 600 zł`, with non-breaking spaces so a price never wraps. */
export function formatPrice(amount: number): string {
  return `${priceFormatter.format(amount).replace(/\s/g, NBSP)}${NBSP}zł`
}

/** `1600` -> `od 1 600 zł`. The only price form the site shows publicly. */
export function formatPriceFrom(amount: number): string {
  return `od${NBSP}${formatPrice(amount)}`
}

/** `1` -> `01`. Section eyebrows and process steps are always two digits. */
export function formatOrdinal(index: number): string {
  return String(index).padStart(2, '0')
}

/** `4.9` -> `4,9`. Polish decimal separator for ratings and stats. */
export function formatDecimal(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}
