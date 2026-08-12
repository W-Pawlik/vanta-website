import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

import { Headline } from './headline'
import { SectionLabel } from './section-label'

type SectionHeaderProps = {
  index: number
  label: string
  headlineLines: readonly string[]
  /** Short supporting copy, placed in the right-hand columns on desktop. */
  aside?: ReactNode
  tone?: 'default' | 'invert'
  className?: string
  headlineClassName?: string
}

/**
 * The recurring section opener: mono eyebrow, headline in the left columns, short
 * paragraph in the right ones.
 *
 * Not every section uses it. Selected Work and Process deliberately break this
 * composition so the numbering system does not turn the page into a template —
 * they compose SectionLabel and Headline directly.
 */
export function SectionHeader({
  index,
  label,
  headlineLines,
  aside,
  tone = 'default',
  className,
  headlineClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('grid grid-cols-12 gap-6', className)}>
      <div className="col-span-12 lg:col-span-7">
        <SectionLabel index={index} tone={tone} className="mb-7">
          {label}
        </SectionLabel>
        <Headline lines={headlineLines} className={headlineClassName} />
      </div>

      {aside && (
        <div
          className={cn(
            'col-span-12 self-end text-body lg:col-span-4 lg:col-start-9',
            tone === 'invert' ? 'text-content-invert-secondary' : 'text-content-secondary',
          )}
        >
          {aside}
        </div>
      )}
    </div>
  )
}
