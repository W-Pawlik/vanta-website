/**
 * Single source of truth for brand-level facts: name, contact details, opening
 * hours, social links. Referenced by the footer, the final CTA, metadata and the
 * JSON-LD block, so a change here propagates everywhere.
 */

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
 * sitemap. Falls back to localhost so `next build` never fails on a missing var.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)
