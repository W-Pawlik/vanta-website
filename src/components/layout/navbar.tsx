'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { Wordmark } from '@/components/ui/wordmark'
import { NAV_ITEM_KEYS, SECTION_IDS, primaryCtaHref } from '@/data/navigation'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { cn } from '@/lib/utils/cn'
import { formatOrdinal } from '@/lib/utils/format'

/** The bar collapses into a floating panel after ~80px of scroll. */
const SCROLL_THRESHOLD = 80

/**
 * Sticky navbar.
 *
 * The panel **expands** on scroll: at rest it sits exactly on the content container,
 * scrolled it grows outward to 1480px / 16px from the viewport edges. The logo
 * therefore travels outward rather than the bar appearing to shrink, and `mx-auto`
 * keeps both edges equal at every width.
 *
 * Surface is glass, not a card: the hairline fades in from transparent instead of
 * popping, because a hard white border on a dark page reads far more aggressive than
 * its alpha suggests.
 */
export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const home = `/${locale}`

  useLockBodyScroll(isMenuOpen)

  /**
   * On the home page the logo links to the page it is already on, so the router treats
   * the click as a no-op and nothing moves. Scrolling has to be explicit.
   *
   * `scrollTo` without an explicit `behavior` inherits `scroll-behavior` from the
   * document, which `base.css` already switches to `auto` under `prefers-reduced-motion`
   * — so this stays smooth for everyone else without a second reduced-motion branch.
   */
  const backToTop = () => {
    if (pathname !== home) return
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 z-50 transition-[top] duration-[var(--duration-base)] ease-out-quart',
        isScrolled ? 'top-[var(--navbar-inset)]' : 'top-0',
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between border',
          'transition-all duration-[var(--duration-base)] ease-out-quart',
          isScrolled
            ? 'h-[var(--navbar-height-scrolled)] max-w-[min(calc(100vw-2*var(--navbar-inset)),var(--navbar-max-width))] rounded-panel border-white/[0.05] bg-canvas/76 px-6 backdrop-blur-[20px]'
            : 'h-[var(--navbar-height)] max-w-[calc(var(--container-shell)+2*var(--spacing-gutter))] border-transparent px-gutter 3xl:max-w-[calc(var(--container-wide)+2*var(--spacing-gutter))]',
        )}
      >
        <Link
          href={home}
          onClick={backToTop}
          aria-label={dict.common.home}
          className="shrink-0 text-content transition-colors duration-[var(--duration-fast)] hover:text-accent"
        >
          <Wordmark className="text-2xl" />
        </Link>

        <nav aria-label={dict.nav.main} className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_ITEM_KEYS.map((key) => (
              <li key={key}>
                <a
                  href={`#${SECTION_IDS[key]}`}
                  className="text-body-sm text-content-secondary transition-colors duration-[var(--duration-fast)] hover:text-content"
                >
                  {dict.nav.items[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <LanguageSwitcher
            current={locale}
            label={dict.language.label}
            className="hidden sm:flex"
          />

          <a
            href={primaryCtaHref}
            className={cn(
              'hidden items-center justify-center gap-2 rounded-control bg-accent px-6 text-body-sm font-medium text-accent-contrast sm:inline-flex',
              'transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover',
              isScrolled ? 'h-11' : 'h-12',
            )}
          >
            {dict.nav.cta}
            <span aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobilne"
            className="flex size-11 flex-col items-center justify-center gap-1.5 rounded-control border border-line text-content lg:hidden"
          >
            <span className="sr-only">{isMenuOpen ? dict.nav.closeMenu : dict.nav.openMenu}</span>
            <span
              aria-hidden="true"
              className={cn(
                'h-px w-5 bg-current transition-transform duration-[var(--duration-fast)]',
                isMenuOpen && 'translate-y-[3.5px] rotate-45',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'h-px w-5 bg-current transition-transform duration-[var(--duration-fast)]',
                isMenuOpen && '-translate-y-[3.5px] -rotate-45',
              )}
            />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="menu-mobilne"
          className="fixed inset-0 -z-10 flex flex-col justify-between bg-canvas px-gutter pt-[calc(var(--navbar-height)+2rem)] pb-10 lg:hidden"
        >
          <nav aria-label={dict.nav.mobile}>
            <ul className="flex flex-col gap-2">
              {NAV_ITEM_KEYS.map((key, index) => (
                <li key={key} className="border-b border-line py-4">
                  <a
                    href={`#${SECTION_IDS[key]}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-baseline gap-4 font-display text-display-card text-content uppercase"
                  >
                    <span className="font-mono text-meta text-accent">
                      {formatOrdinal(index + 1)}
                    </span>
                    {dict.nav.items[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6">
            <LanguageSwitcher current={locale} label={dict.language.label} />
            <a
              href={primaryCtaHref}
              onClick={() => setIsMenuOpen(false)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-control bg-accent text-body font-medium text-accent-contrast"
            >
              {dict.nav.mobileCta} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
