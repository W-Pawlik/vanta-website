import type { MetadataRoute } from 'next'

import { siteUrl } from '@/data/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The design-system reference is internal, not marketing content.
      disallow: ['/pl/system', '/en/system'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
