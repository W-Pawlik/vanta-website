import type { MetadataRoute } from 'next'

import { siteUrl } from '@/data/site'
import { locales } from '@/i18n/config'

/**
 * One entry per locale, each pointing at the others through `alternates.languages`
 * so search engines treat them as translations rather than duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(locales.map((entry) => [entry, `${siteUrl}/${entry}`])),
    },
  }))
}
