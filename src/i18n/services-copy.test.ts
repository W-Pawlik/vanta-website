import { describe, expect, it } from 'vitest'

import { ALL_PRICE_ITEM_KEYS, PRICE_GROUPS } from '@/data/price-list'
import { SERVICE_SLUGS, services } from '@/data/services'
import { locales } from '@/i18n/config'
import { dictionaryFor } from '@/i18n/dictionaries'

/**
 * Service variants and price-list rows are keyed by plain strings, so TypeScript cannot
 * prove that every key in `src/data/` has copy in every language. This test does it
 * instead — a variant added without its wording fails here rather than rendering as
 * `undefined` on the page.
 */
describe.each(locales)('service copy — %s', (locale) => {
  const dict = dictionaryFor(locale)

  it('names every service category', () => {
    for (const slug of SERVICE_SLUGS) {
      const copy = dict.services.items[slug]

      expect(copy?.name, `missing name for ${slug}`).toBeTruthy()
      expect(copy?.description, `missing description for ${slug}`).toBeTruthy()
      expect(copy?.imageAlt, `missing alt for ${slug}`).toBeTruthy()
      expect(copy?.includes.length, `no "includes" for ${slug}`).toBeGreaterThan(0)
    }
  })

  it('names every price variant of every category', () => {
    for (const service of services) {
      const copy = dict.services.items[service.slug]
      const variants = copy.variants as Record<string, { name: string; description: string }>

      for (const variant of service.variants) {
        const variantCopy = variants[variant.key]

        expect(variantCopy?.name, `missing name for ${service.slug}/${variant.key}`).toBeTruthy()
        expect(
          variantCopy?.description,
          `missing description for ${service.slug}/${variant.key}`,
        ).toBeTruthy()
      }
    }
  })

  it('names every price-list group', () => {
    for (const group of PRICE_GROUPS) {
      expect(dict.services.pricelist.groups[group], `missing group name ${group}`).toBeTruthy()
    }
  })

  it('names every price-list row', () => {
    const items = dict.services.pricelist.items

    for (const key of ALL_PRICE_ITEM_KEYS) {
      const entry = items[key as keyof typeof items]

      expect(entry?.name, `missing name for price item ${key}`).toBeTruthy()
      expect(entry?.description, `missing description for price item ${key}`).toBeTruthy()
    }
  })

  it('has no price-list copy without a matching row in the data', () => {
    // Guards the other direction: leftover copy after a row is removed.
    expect(Object.keys(dict.services.pricelist.items).sort()).toEqual(
      [...ALL_PRICE_ITEM_KEYS].sort(),
    )
  })
})

describe('service data', () => {
  it('uses unique price-list keys, which the flat dictionary depends on', () => {
    expect(new Set(ALL_PRICE_ITEM_KEYS).size).toBe(ALL_PRICE_ITEM_KEYS.length)
  })

  it('gives every category at least two variants, so the drawer has something to show', () => {
    for (const service of services) {
      expect(service.variants.length, service.slug).toBeGreaterThan(1)
    }
  })
})
