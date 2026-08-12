import { describe, expect, it } from 'vitest'

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
    })
  })

  it('maps the locale onto an Open Graph locale', () => {
    expect(buildMetadata({ locale: 'pl' }).openGraph?.locale).toBe('pl_PL')
    expect(buildMetadata({ locale: 'en' }).openGraph?.locale).toBe('en_GB')
  })

  it('resolves a relative OG image against the site origin', () => {
    expect(buildMetadata({ locale: 'pl' }).openGraph?.images).toEqual([
      expect.objectContaining({
        url: expect.stringMatching(/^https?:\/\/.+\/images\/og-default/),
      }),
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
