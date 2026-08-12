import { describe, expect, it } from 'vitest'

import { formatDecimal, formatOrdinal, formatPrice, formatPriceFrom } from './format'

/** Non-breaking spaces are intentional in the output but noisy in assertions. */
const readable = (value: string) => value.replace(/ /g, ' ')

describe('formatPrice', () => {
  it('groups thousands and appends the currency', () => {
    expect(readable(formatPrice(1600))).toBe('1 600 zł')
    expect(readable(formatPrice(900))).toBe('900 zł')
  })

  it('groups four-digit prices, which Polish CLDR would otherwise leave ungrouped', () => {
    expect(readable(formatPrice(3499))).toBe('3 499 zł')
  })

  it('uses non-breaking spaces so a price never wraps mid-value', () => {
    expect(formatPrice(2400)).not.toMatch(/ /)
  })

  it('drops fractions — the site never advertises grosze', () => {
    expect(readable(formatPrice(699.99))).toBe('700 zł')
  })
})

describe('formatPriceFrom', () => {
  it('prefixes the "od" qualifier', () => {
    expect(readable(formatPriceFrom(3499))).toBe('od 3 499 zł')
  })

  it('keeps the whole phrase unbreakable', () => {
    expect(formatPriceFrom(1600)).not.toMatch(/ /)
  })
})

describe('formatOrdinal', () => {
  it('pads single digits to two', () => {
    expect(formatOrdinal(1)).toBe('01')
    expect(formatOrdinal(4)).toBe('04')
  })

  it('leaves two-digit values untouched', () => {
    expect(formatOrdinal(12)).toBe('12')
  })
})

describe('formatDecimal', () => {
  it('uses the Polish decimal comma', () => {
    expect(formatDecimal(4.9)).toBe('4,9')
  })

  it('pads to the requested precision', () => {
    expect(formatDecimal(5)).toBe('5,0')
    expect(formatDecimal(4.85, 2)).toBe('4,85')
  })
})
