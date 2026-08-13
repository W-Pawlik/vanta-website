'use client'

import { motion, type PanInfo } from 'motion/react'
import { useState } from 'react'

import { StarRating } from '@/components/ui/star-rating'
import { REVIEW_RATING } from '@/data/reviews'
import { interpolate } from '@/i18n/dictionaries'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { DURATION, EASE } from '@/lib/motion/tokens'
import { formatOrdinal } from '@/lib/utils/format'

export type Review = { quote: string; author: string; car: string }

type Labels = { previous: string; next: string; rating: string }

/** Past this distance — or this flick speed — the gesture counts as a slide change. */
const DRAG_DISTANCE = 60
const DRAG_VELOCITY = 400

/**
 * Three reviews, one at a time. No autoplay — at this size it would only take control
 * away from the reader.
 *
 * **All three quotes are rendered side by side in a flex track, and the track is what
 * moves.** Two things follow, both of them the point:
 *
 * 1. The track is as tall as the tallest quote, on every slide. Showing one quote at a
 *    time and hiding the rest made the section's height depend on the active quote, so
 *    the arrows jumped up and down as the reader clicked through them.
 * 2. Every quote stays in the DOM, so crawlers and screen readers see all three.
 *
 * Drag comes from Motion's pointer gestures, so mouse and touch are the same code path.
 * Constraints are pinned to zero with `dragElastic={1}`: the track follows the pointer
 * one-to-one, then springs back while the index change slides it to the next quote.
 */
export function TestimonialsSlider({
  items,
  labels,
}: {
  items: readonly Review[]
  labels: Labels
}) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const total = items.length

  const go = (delta: number) => setIndex((current) => (current + delta + total) % total)

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    const draggedFarEnough = Math.abs(info.offset.x) > DRAG_DISTANCE
    const flicked = Math.abs(info.velocity.x) > DRAG_VELOCITY
    if (!draggedFarEnough && !flicked) return

    // Dragging left reveals what is to the right, so a negative offset advances.
    go(info.offset.x < 0 ? 1 : -1)
  }

  return (
    <div>
      {/* `overflow-clip`, not `overflow-hidden`. Both clip identically, but `hidden` also
          makes this a scroll container — a 1005px-wide track inside a 335px box, holding
          670px of horizontal slack that the browser is entitled to scroll to. Anything that
          brings an off-screen quote into view (a focus call, an anchor jump) would scroll it
          sideways and leave it there, with no scrollbar to show what happened. `clip` gives
          the same picture and no scrollable area at all. */}
      <div className="overflow-clip" aria-live="polite">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.ul
            className="flex"
            animate={{ x: `${-index * 100}%` }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: DURATION.slow, ease: EASE.outQuart }
            }
          >
            {items.map((item, itemIndex) => {
              const isActive = itemIndex === index

              return (
                <li
                  key={item.author}
                  className="w-full shrink-0"
                  aria-hidden={!isActive}
                  // Keeps the off-screen quotes out of the tab order without removing
                  // them from the document.
                  inert={!isActive}
                >
                  <figure>
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
                  </figure>
                </li>
              )
            })}
          </motion.ul>
        </motion.div>
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
