import { describe, expect, it } from 'vitest'

import { siteUrl } from '@/data/site'
import { dictionaryFor } from '@/i18n/dictionaries'

import { buildMetadata } from './metadata'

const pl = dictionaryFor('pl')
const en = dictionaryFor('en')

describe('buildMetadata', () => {
  it('uses the locale’s own title and description', () => {
    expect(buildMetadata({ locale: 'pl' }).title).toBe(pl.meta.title)
    expect(buildMetadata({ locale: 'en' }).title).toBe(en.meta.title)
    expect(buildMetadata({ locale: 'en' }).description).toBe(en.meta.description)
  })

  it('suffixes a page title with the brand', () => {
    expect(buildMetadata({ locale: 'pl', title: 'Design system' }).title).toBe(
      'Design system | VANTA',
    )
  })

  it('prefixes the canonical URL with the locale', () => {
    expect(buildMetadata({ locale: 'en' }).alternates?.canonical).toBe('/en')
    expect(buildMetadata({ locale: 'pl', path: '/system' }).alternates?.canonical).toBe(
      '/pl/system',
    )
  })

  it('declares every locale as an alternate, which is what marks them as translations', () => {
    expect(buildMetadata({ locale: 'pl' }).alternates?.languages).toEqual({
      pl: '/pl',
      en: '/en',
      'x-default': '/',
    })
  })

  /**
   * `x-default` has to point at the unprefixed path, because that is the URL the proxy
   * uses to negotiate the locale from Accept-Language. Pointing it at a locale would
   * declare a language-specific URL as the language-neutral one.
   */
  it('points x-default at the unprefixed path, not at a locale', () => {
    const languages = buildMetadata({ locale: 'en', path: '/system' }).alternates?.languages

    expect(languages?.['x-default']).toBe('/system')
    expect(languages?.en).toBe('/en/system')
  })

  it('maps the locale onto an Open Graph locale', () => {
    expect(buildMetadata({ locale: 'pl' }).openGraph?.locale).toBe('pl_PL')
    expect(buildMetadata({ locale: 'en' }).openGraph?.locale).toBe('en_GB')
  })

  /**
   * Asserted against `siteUrl` rather than a loose `https?://` pattern: the pattern used
   * to accept `http://localhost:3000`, so it passed on a production build whose canonical
   * and OG image pointed at localhost. `resolveSiteUrl` now rejects that at build time —
   * this keeps the assertion from drifting back to something that cannot tell them apart.
   */
  it('resolves a relative OG image against the site origin', () => {
    expect(buildMetadata({ locale: 'pl' }).openGraph?.images).toEqual([
      expect.objectContaining({ url: `${siteUrl}/images/og-default.jpg` }),
    ])
  })

  it('passes an absolute OG image through untouched', () => {
    expect(
      buildMetadata({ locale: 'pl', image: 'https://cdn.example.com/og.jpg' }).openGraph?.images,
    ).toEqual([expect.objectContaining({ url: 'https://cdn.example.com/og.jpg' })])
  })

  it('keeps the Twitter card in sync with Open Graph', () => {
    expect(
      buildMetadata({ locale: 'en', title: 'Packages', description: 'Three options.' }).twitter,
    ).toMatchObject({
      card: 'summary_large_image',
      title: 'Packages | VANTA',
      description: 'Three options.',
    })
  })
})
