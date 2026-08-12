import type { MetadataRoute } from 'next'

import { siteConfig } from '@/data/site'

/**
 * The single SVG mark doubles as the favicon (`app/icon.svg`) and the manifest icon.
 * Raster sizes are still missing — an installed PWA will fall back to the SVG, which is
 * fine for a portfolio site and better than pointing at files that do not exist.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.legalName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: 'pl',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
  }
}
