/**
 * Resolves the absolute origin used by `metadataBase`, canonical, hreflang, Open Graph
 * and the sitemap.
 *
 * Kept dependency-free on purpose: `data/site.ts` reaches this module, and `error.tsx`
 * is a Client Component that imports `data/site.ts`, so anything pulled in here also
 * lands in the client bundle. No Zod, no URL helpers beyond the platform.
 *
 * The production build **fails** on a missing or non-HTTPS value rather than falling
 * back. Both locales are prerendered as static HTML, so the origin is baked into
 * canonical and hreflang at build time — a wrong value cannot be corrected at runtime,
 * and a silent localhost fallback ships a canonical pointing at an unreachable host.
 */

const DEV_FALLBACK = 'http://localhost:3000'

export function resolveSiteUrl(rawUrl: string | undefined, isProduction: boolean): string {
  const url = rawUrl?.trim().replace(/\/+$/, '')

  if (!url) {
    if (isProduction) {
      throw new Error(
        'NEXT_PUBLIC_SITE_URL is required for a production build. It is baked into canonical, ' +
          'hreflang, Open Graph and the sitemap of both prerendered locales, so it cannot be ' +
          'set later. Example: NEXT_PUBLIC_SITE_URL=https://example.com',
      )
    }
    return DEV_FALLBACK
  }

  if (!isProduction) return url

  // Parsed before the protocol is checked, so a value without a scheme reports the
  // missing scheme instead of being mislabelled as the wrong one. The raw value is
  // quoted in both messages — the trailing-slash strip above would otherwise show a
  // mangled fragment.
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be an absolute URL, got "${rawUrl}".`)
  }

  if (parsed.protocol !== 'https:') {
    throw new Error(`NEXT_PUBLIC_SITE_URL must use https:// in production, got "${rawUrl}".`)
  }

  return url
}
