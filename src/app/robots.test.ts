import { describe, expect, it } from 'vitest'

import { siteUrl } from '@/data/site'

import robots from './robots'

describe('robots', () => {
  it('points crawlers at the sitemap on the deployment origin', () => {
    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`)
  })

  /**
   * Guards a regression that is easy to reintroduce because it reads as extra safety:
   * `/system` already carries `robots: { index: false }` in its own metadata, and adding
   * a `Disallow` on top of it stops crawlers from ever reading that `noindex`. The two
   * mechanisms are alternatives, not layers.
   */
  it('does not disallow anything, so every noindex stays readable', () => {
    const rules = robots().rules

    expect(Array.isArray(rules)).toBe(false)
    expect(rules).toMatchObject({ userAgent: '*', allow: '/' })
    expect(rules).not.toHaveProperty('disallow')
  })
})
