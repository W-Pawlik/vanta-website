import type { MetadataRoute } from 'next'

import { siteUrl } from '@/data/site'
import { locales } from '@/i18n/config'

/**
 * One entry per locale, each pointing at the others through `alternates.languages`
 * so search engines treat them as translations rather than duplicates.
 *
 * The alternates mirror `buildMetadata()` on purpose — including `x-default` for the
 * unprefixed origin, which negotiates the locale in the proxy. hreflang stated in the
 * sitemap and in the page must agree; disagreeing sets make both sets untrustworthy.
 *
 * No `lastModified`: it would have to come from the build clock, which would claim the
 * content changed on every deploy. It belongs here once there is real per-page content
 * with a real modification date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((entry) => [entry, `${siteUrl}/${entry}`])),
    'x-default': siteUrl,
  }

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    alternates: { languages },
  }))
}
