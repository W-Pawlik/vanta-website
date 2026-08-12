import type { ElementType } from 'react'

import { cn } from '@/lib/utils/cn'

type HeadlineProps = {
  /**
   * One entry per visual line. Where a headline breaks is a design decision, so
   * it is authored explicitly rather than left to the browser.
   *
   * Do not add a max-width alongside this: a character cap lets a line re-wrap
   * and silently become two.
   */
  lines: readonly string[]
  as?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'p'>
  className?: string
  lineClassName?: string
}

/**
 * Multi-line display heading. Each line is its own block element, which is also
 * the DOM shape `TextReveal` needs — swapping this for the animated version
 * changes the component, not the markup.
 *
 * Defaults to the section step of the display scale. Hero, statements and
 * project titles pass their own step; see .agents/02-design-system.md.
 */
export function Headline({ lines, as: Tag = 'h2', className, lineClassName }: HeadlineProps) {
  return (
    <Tag className={cn('font-display text-display-section uppercase', className)}>
      {lines.map((line) => (
        <span key={line} className={cn('block', lineClassName)}>
          {line}
        </span>
      ))}
    </Tag>
  )
}
