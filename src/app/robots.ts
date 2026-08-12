import type { MetadataRoute } from 'next'

import { siteUrl } from '@/data/site'

/**
 * Crawling is fully open. `/system` is kept out of the index by the `noindex` in its own
 * metadata, **not** by a `Disallow` here — the two cancel each other out. A crawler that
 * is refused the page never reads the `noindex`, so a URL discovered from outside could
 * still be indexed as an address without content, which is the opposite of the intent.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
