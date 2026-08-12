/**
 * Single source of truth for brand-level facts: name, contact details, opening
 * hours, social links. Referenced by the footer, the final CTA and metadata, so a
 * change here propagates everywhere.
 *
 * The address, phone number and social links are still placeholders. They have to be
 * real before launch — and before any `LocalBusiness` JSON-LD is added on top of them
 * (.agents/08-accessibility-and-performance.md), because structured data repeating a
 * fictional address is misleading markup, not a missing feature.
 */

import { resolveSiteUrl } from '@/lib/seo/site-url'

export const siteConfig = {
  name: 'VANTA',
  legalName: 'VANTA Auto Detailing',
  tagline: 'Auto Detailing Studio',
  claim: 'Twój samochód. W najlepszej formie.',
  description:
    'Profesjonalny detailing, korekta lakieru i zabezpieczenia ceramiczne dla samochodów, które zasługują na więcej.',
  locale: 'pl-PL',
  city: 'Warszawa',
  /** Static, not derived from the clock — a build in January must not roll it back. */
  copyrightYear: 2026,
  address: {
    street: 'ul. Przykładowa 24',
    postalCode: '00-001',
    city: 'Warszawa',
    country: 'PL',
  },
  contact: {
    phone: '+48 500 100 200',
    phoneHref: 'tel:+48500100200',
    email: 'kontakt@vanta-detailing.pl',
  },
  openingHours: [
    { days: 'Poniedziałek – Piątek', hours: '8:00 – 18:00' },
    { days: 'Sobota', hours: '9:00 – 14:00' },
    { days: 'Niedziela', hours: 'Zamknięte' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
} as const

/**
 * Absolute origin of the deployment. Needed for metadataBase, Open Graph and the
 * sitemap. Localhost is a development convenience only — a production build without
 * `NEXT_PUBLIC_SITE_URL` fails instead of shipping a canonical nobody can resolve.
 * See `@/lib/seo/site-url`.
 */
export const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NODE_ENV === 'production',
)
