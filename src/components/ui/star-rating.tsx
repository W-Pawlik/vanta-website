import { cn } from '@/lib/utils/cn'

type StarRatingProps = {
  /** Whole stars out of five. */
  value: number
  /** Already-localised text equivalent, e.g. "Rated 5 out of 5". */
  label: string
  className?: string
}

/**
 * Five stars with a text equivalent for assistive technology — a row of glyphs alone
 * tells a screen reader nothing.
 */
export function StarRating({ value, label, className }: StarRatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-accent', className)}>
      <span aria-hidden="true">{'★'.repeat(value)}</span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
