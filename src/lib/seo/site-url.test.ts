import { describe, expect, it } from 'vitest'

import { resolveSiteUrl } from './site-url'

describe('resolveSiteUrl', () => {
  it('falls back to localhost outside production', () => {
    expect(resolveSiteUrl(undefined, false)).toBe('http://localhost:3000')
  })

  /**
   * Guards the defect this function exists for: a production build without the variable
   * used to bake `http://localhost:3000` into the canonical, hreflang, Open Graph and
   * sitemap of both prerendered locales. Failing the build is the only place this can
   * still be caught — the pages are static HTML afterwards.
   */
  it('fails a production build when the variable is missing', () => {
    expect(() => resolveSiteUrl(undefined, true)).toThrow(/NEXT_PUBLIC_SITE_URL is required/)
    expect(() => resolveSiteUrl('   ', true)).toThrow(/NEXT_PUBLIC_SITE_URL is required/)
  })

  it('rejects a non-https origin in production', () => {
    expect(() => resolveSiteUrl('http://vanta-detailing.pl', true)).toThrow(/must use https/)
  })

  it('rejects a value that is not an absolute URL', () => {
    expect(() => resolveSiteUrl('vanta-detailing.pl', true)).toThrow(/absolute URL/)
    expect(() => resolveSiteUrl('https://', true)).toThrow(/absolute URL/)
  })

  it('quotes the raw value in the error, not the stripped one', () => {
    expect(() => resolveSiteUrl('https://', true)).toThrow('got "https://"')
  })

  it('strips trailing slashes so callers can concatenate paths', () => {
    expect(resolveSiteUrl('https://vanta-detailing.pl///', true)).toBe('https://vanta-detailing.pl')
    expect(resolveSiteUrl('http://localhost:4000/', false)).toBe('http://localhost:4000')
  })

  it('accepts a valid production origin unchanged', () => {
    expect(resolveSiteUrl('https://vanta-detailing.pl', true)).toBe('https://vanta-detailing.pl')
  })
})
