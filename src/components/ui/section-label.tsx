import { cn } from '@/lib/utils/cn'
import { formatOrdinal } from '@/lib/utils/format'

type SectionLabelProps = {
  /** Section number. Rendered zero-padded: `01`. */
  index?: number
  children: string
  tone?: 'default' | 'invert'
  /**
   * `vertical` rotates the label to run up the left margin. Used to break the
   * label → headline rhythm so the numbering system does not read as a template.
   */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * The mono eyebrow above a section headline — `01 / THE STANDARD`.
 * Always uppercase, always the smallest type on the page.
 */
export function SectionLabel({
  index,
  children,
  tone = 'default',
  orientation = 'horizontal',
  className,
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        'font-mono text-label uppercase',
        tone === 'invert' ? 'text-content-invert-tertiary' : 'text-content-tertiary',
        orientation === 'vertical' && 'rotate-180 [writing-mode:vertical-rl]',
        className,
      )}
    >
      {index !== undefined && (
        <>
          <span className={tone === 'invert' ? 'text-content-invert' : 'text-accent'}>
            {formatOrdinal(index)}
          </span>
          <span aria-hidden="true"> / </span>
        </>
      )}
      {children}
    </p>
  )
}
