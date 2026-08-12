import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ContainerProps = {
  children: ReactNode
  /**
   * `shell` — the page's wide content column.
   * `measure` — a narrow column capped at a comfortable reading length.
   */
  width?: 'shell' | 'measure'
  className?: string
}

/**
 * The gutter is added **on top of** the content width, not taken out of it.
 *
 * `max-w-shell px-gutter` alone would make 1280px the box width including padding,
 * so at 1440 the content would be 1165px wide starting 138px from the edge — not
 * the 1280px content with 80px margins the wireframe specifies.
 */
const SHELL_CLASS =
  'max-w-[calc(var(--container-shell)+2*var(--spacing-gutter))] px-gutter ' +
  '3xl:max-w-[calc(var(--container-wide)+2*var(--spacing-gutter))]'

/**
 * The horizontal frame for content. Full-bleed media deliberately sits *outside*
 * a Container (or uses the `bleed` utility) — see .agents/02-design-system.md.
 */
export function Container({ children, width = 'shell', className }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full', width === 'shell' ? SHELL_CLASS : 'max-w-measure', className)}
    >
      {children}
    </div>
  )
}
