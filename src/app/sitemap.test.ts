import { describe, expect, it } from 'vitest'

import { siteUrl } from '@/data/site'
import { locales } from '@/i18n/config'

import sitemap from './sitemap'

describe('sitemap', () => {
  it('lists one absolute URL per locale', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual(
      locales.map((locale) => `${siteUrl}/${locale}`),
    )
  })

  /**
   * hreflang stated in the sitemap has to agree with hreflang stated in the page — a
   * crawler that finds two different alternate sets can trust neither. Every entry
   * therefore declares both locales plus `x-default`, and every entry declares itself.
   */
  it('declares the same reciprocal alternate set on every entry', () => {
    for (const entry of sitemap()) {
      expect(entry.alternates?.languages).toEqual({
        pl: `${siteUrl}/pl`,
        en: `${siteUrl}/en`,
        'x-default': siteUrl,
      })
      expect(Object.values(entry.alternates?.languages ?? {})).toContain(entry.url)
    }
  })

  it('omits lastModified rather than stamping the build clock', () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBeUndefined()
    }
  })
})
