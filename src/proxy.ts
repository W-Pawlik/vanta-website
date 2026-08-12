import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, locales } from '@/i18n/config'

/**
 * Every route lives under `/[locale]`, so a request without a locale prefix has to
 * be redirected to one.
 *
 * Locale is picked from `Accept-Language` with Polish as the fallback — the studio
 * is in Warsaw, so a visitor with no preference gets Polish. No negotiation library:
 * with two locales a prefix scan is enough and keeps the proxy dependency-free
 * (the proxy may run at the edge, where shared modules are a liability).
 */
function pickLocale(request: NextRequest) {
  const header = request.headers.get('accept-language')
  if (!header) return defaultLocale

  // "en-GB,en;q=0.9,pl;q=0.8" → ["en-gb", "en", "pl"], already in priority order.
  const requested = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .filter((tag): tag is string => Boolean(tag))

  for (const tag of requested) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${pickLocale(request)}` : `/${pickLocale(request)}${pathname}`

  const response = NextResponse.redirect(url)
  // The target depends on Accept-Language, so any shared cache has to key on it.
  // Without this a cached `/` → `/pl` is served to an English visitor and vice versa.
  response.headers.set('Vary', 'Accept-Language')

  return response
}

export const config = {
  // Skip Next internals and anything with a file extension (images, robots.txt,
  // sitemap.xml, the manifest) — those must not be locale-prefixed.
  matcher: ['/((?!_next|.*\\.).*)'],
}
