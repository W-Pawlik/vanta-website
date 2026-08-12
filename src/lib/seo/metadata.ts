import type { Metadata } from 'next'

import { siteConfig, siteUrl } from '@/data/site'
import { locales, type Locale } from '@/i18n/config'
import { dictionaryFor } from '@/i18n/dictionaries'

type BuildMetadataOptions = {
  locale: Locale
  /** Page-specific title. Omit on the home page to use the branded default. */
  title?: string
  description?: string
  /** Route path **without** the locale prefix, always leading-slash. */
  path?: string
  /** Path to an OG image under /public, or an absolute URL. */
  image?: string
}

const DEFAULT_OG_IMAGE = '/images/og-default.jpg'

/**
 * Builds a complete Metadata object so no route has to remember the Open Graph and
 * Twitter boilerplate.
 *
 * Locale is passed explicitly rather than read from `next/root-params`: metadata is
 * generated outside the Server Component render, and an explicit argument keeps it
 * usable from `generateMetadata` in any route.
 *
 * `alternates.languages` is emitted for every locale, which is what tells search
 * engines the two pages are translations rather than duplicates.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
}: BuildMetadataOptions): Metadata {
  const dict = dictionaryFor(locale)
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : dict.meta.title
  const resolvedDescription = description ?? dict.meta.description

  const localePath = path === '/' ? `/${locale}` : `/${locale}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    metadataBase: new URL(siteUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: localePath,
      languages: Object.fromEntries(
        locales.map((entry) => [entry, path === '/' ? `/${entry}` : `/${entry}${path}`]),
      ),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'pl' ? 'pl_PL' : 'en_GB',
      siteName: siteConfig.legalName,
      url: localePath,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: dict.hero.headline.join(' ') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
  }
}
