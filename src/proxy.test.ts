import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { proxy } from './proxy'

function request(pathname: string, acceptLanguage?: string) {
  return new NextRequest(`https://vanta-detailing.pl${pathname}`, {
    headers: acceptLanguage ? { 'accept-language': acceptLanguage } : undefined,
  })
}

describe('proxy', () => {
  it('leaves an already prefixed path alone', () => {
    expect(proxy(request('/pl'))).toBeUndefined()
    expect(proxy(request('/en/system'))).toBeUndefined()
  })

  it('sends a visitor with no preference to the studio’s home market', () => {
    expect(proxy(request('/'))?.headers.get('location')).toBe('https://vanta-detailing.pl/pl')
  })

  it('honours the first supported tag in Accept-Language, ignoring the region', () => {
    expect(proxy(request('/', 'en-GB,en;q=0.9,pl;q=0.8'))?.headers.get('location')).toBe(
      'https://vanta-detailing.pl/en',
    )
    expect(proxy(request('/', 'de-DE,de;q=0.9,en;q=0.7'))?.headers.get('location')).toBe(
      'https://vanta-detailing.pl/en',
    )
    expect(proxy(request('/', 'de-DE'))?.headers.get('location')).toBe(
      'https://vanta-detailing.pl/pl',
    )
  })

  it('keeps the requested path when it prefixes the locale', () => {
    expect(proxy(request('/system', 'pl'))?.headers.get('location')).toBe(
      'https://vanta-detailing.pl/pl/system',
    )
  })

  /**
   * The redirect target is derived from Accept-Language, so a shared cache that does not
   * key on that header will hand an English visitor the Polish redirect. Declaring `Vary`
   * is the only thing that makes the response correctly cacheable.
   */
  it('declares that the redirect varies by Accept-Language', () => {
    expect(proxy(request('/'))?.headers.get('vary')).toBe('Accept-Language')
  })
})
