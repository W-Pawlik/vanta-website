'use client'

import { useLeadSelection } from '@/components/lead/lead-selection'
import { CtaArrow } from '@/components/ui/button'
import { PACKAGE_TO_INTERESTS } from '@/data/lead-mapping'
import type { PackageSlug } from '@/data/pricing'
import { cn } from '@/lib/utils/cn'

/**
 * The package CTA. A plain anchor, so the browser scrolls to the form; the click also
 * seeds step 2 with what that package actually covers.
 *
 * Tiny client island rather than making the whole pricing grid client — the grid is
 * static content and belongs on the server.
 */
export function PackageCta({
  slug,
  href,
  label,
  featured,
}: {
  slug: PackageSlug
  href: string
  label: string
  featured: boolean
}) {
  const { select } = useLeadSelection()

  return (
    <a
      href={href}
      onClick={() => select(PACKAGE_TO_INTERESTS[slug])}
      className={cn(
        'group mt-10 inline-flex h-14 w-full items-center justify-center gap-2 rounded-control px-7 text-body font-medium',
        'transition-colors duration-[var(--duration-fast)] ease-out-quart',
        featured
          ? 'bg-accent text-accent-contrast hover:bg-canvas hover:text-accent hover:ring-1 hover:ring-accent'
          : 'border border-line-strong text-content hover:border-content hover:bg-surface',
      )}
    >
      {label}
      <CtaArrow direction="right" />
    </a>
  )
}
