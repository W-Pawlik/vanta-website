import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono, Inter_Tight } from 'next/font/google'

import { LeadSelectionProvider } from '@/components/lead/lead-selection'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { isLocale, locales, localeMeta } from '@/i18n/config'
import { getDictionary } from '@/i18n/server'
import { buildMetadata } from '@/lib/seo/metadata'

import '@/styles/globals.css'

/**
 * Fonts are self-hosted by next/font, so there is no render-blocking request to
 * Google. `latin-ext` is required — Polish diacritics live there.
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

/** Both locales are prerendered as static HTML at build time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return buildMetadata({ locale })
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

/**
 * Root layout. It lives under `[locale]` so `locale` becomes a root parameter,
 * which lets every Server Component read its copy via `getDictionary()` instead of
 * having the locale drilled through props.
 */
export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = await getDictionary()

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} antialiased`}
    >
      <body>
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-body-sm focus:text-accent-contrast"
        >
          {dict.common.skipToContent}
        </a>
        {/* The provider carries the service/package choice into the lead form. Wrapping
            here does not turn the sections into Client Components — they are
            already-rendered children passed straight through. */}
        <LeadSelectionProvider>
          <Navbar locale={locale} dict={dict} />
          <main id="tresc">{children}</main>
          <Footer dict={dict} />
        </LeadSelectionProvider>
      </body>
    </html>
  )
}
