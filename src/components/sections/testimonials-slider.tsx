'use client'

import { motion } from 'motion/react'
import { useState } from 'react'

import { StarRating } from '@/components/ui/star-rating'
import { REVIEW_RATING } from '@/data/reviews'
import { interpolate } from '@/i18n/dictionaries'
import { DURATION, EASE } from '@/lib/motion/tokens'
import { formatOrdinal } from '@/lib/utils/format'

export type Review = { quote: string; author: string; car: string }

type Labels = { previous: string; next: string; rating: string }

/**
 * Three reviews, one at a time. No autoplay — at this size it would only take control
 * away from the reader. Every quote stays in the DOM so crawlers and screen readers
 * see all three; only the inactive ones are hidden.
 */
export function TestimonialsSlider({
  items,
  labels,
}: {
  items: readonly Review[]
  labels: Labels
}) {
  const [index, setIndex] = useState(0)
  const total = items.length

  const go = (delta: number) => setIndex((current) => (current + delta + total) % total)

  return (
    <div>
      <div aria-live="polite">
        {items.map((item, itemIndex) => (
          <figure key={item.author} hidden={itemIndex !== index}>
            <motion.div
              key={`${item.author}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE.outQuart }}
            >
              <StarRating
                value={REVIEW_RATING}
                label={interpolate(labels.rating, { value: REVIEW_RATING })}
                className="text-body"
              />

              <blockquote className="mt-8">
                <p className="max-w-[42ch] font-display text-quote text-content">
                  {`„${item.quote}”`}
                </p>
              </blockquote>

              <figcaption className="mt-10">
                <p className="text-body text-content">{item.author}</p>
                <p className="mt-1 font-mono text-meta text-content-tertiary uppercase">
                  {item.car}
                </p>
              </figcaption>
            </motion.div>
          </figure>
        ))}
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-line pt-6">
        <p className="font-mono text-meta text-content-tertiary">
          <span className="text-content-secondary">{formatOrdinal(index + 1)}</span>
          <span aria-hidden="true"> / </span>
          {formatOrdinal(total)}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="flex size-12 items-center justify-center rounded-full border border-line text-content transition-colors duration-[var(--duration-fast)] hover:border-line-strong hover:bg-surface"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="flex size-12 items-center justify-center rounded-full border border-line text-content transition-colors duration-[var(--duration-fast)] hover:border-line-strong hover:bg-surface"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
