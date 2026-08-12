/**
 * Locale configuration. Kept free of any Next.js import so it can be used from
 * Server Components, Client Components, Route Handlers and the proxy alike.
 */
export const locales = ['pl', 'en'] as const

export type Locale = (typeof locales)[number]

/** Polish is the studio's home market, so it is the fallback. */
export const defaultLocale: Locale = 'pl'

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value)
}

export const localeMeta: Record<Locale, { short: string; name: string; htmlLang: string }> = {
  pl: { short: 'PL', name: 'Polski', htmlLang: 'pl' },
  en: { short: 'EN', name: 'English', htmlLang: 'en' },
}

/** Strips a leading `/pl` or `/en` so a path can be re-prefixed with another locale. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }
  return pathname
}

export function withLocale(pathname: string, locale: Locale): string {
  const bare = stripLocale(pathname)
  return bare === '/' ? `/${locale}` : `/${locale}${bare}`
}
