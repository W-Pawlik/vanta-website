'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { locales, localeMeta, withLocale, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils/cn'

type LanguageSwitcherProps = {
  current: Locale
  label: string
  className?: string
}

/**
 * Two-letter locale toggle. Deliberately understated: metadata-sized mono type, a
 * hairline divider, no flags and no dropdown. A flag would be wrong anyway — it
 * marks a country, not a language.
 *
 * Rendered as real links so the switch is a normal navigation: crawlable, works
 * without JavaScript, and keeps the current path across locales.
 *
 * `scroll={false}` is what keeps the reader where they were. The router's default is to
 * maintain scroll position only while the Page element is still visible in the viewport,
 * and to jump to the top of it otherwise — so switching language halfway down a
 * one-page site threw the reader back to the hero. Changing the language must change
 * the words and nothing else.
 */
export function LanguageSwitcher({ current, label, className }: LanguageSwitcherProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn('flex items-center gap-1 font-mono text-meta uppercase', className)}
      role="group"
      aria-label={label}
    >
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="text-content-ghost">
              /
            </span>
          )}
          <Link
            href={withLocale(pathname, locale)}
            hrefLang={locale}
            scroll={false}
            aria-current={locale === current ? 'true' : undefined}
            className={cn(
              'transition-colors duration-[var(--duration-fast)]',
              locale === current
                ? 'text-content'
                : 'text-content-tertiary hover:text-content-secondary',
            )}
          >
            <span className="sr-only">{localeMeta[locale].name}</span>
            <span aria-hidden="true">{localeMeta[locale].short}</span>
          </Link>
        </span>
      ))}
    </div>
  )
}
