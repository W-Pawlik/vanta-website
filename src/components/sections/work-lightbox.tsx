'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { Overlay } from '@/components/ui/overlay'
import { DURATION, EASE } from '@/lib/motion/tokens'

export type LightboxItem = {
  image: string
  imageAlt: string
  ratio: number
  title: string
  scope: string
}

type WorkLightboxProps = {
  item: LightboxItem | null
  onClose: () => void
  labels: { close: string; region: string }
}

/**
 * Full-screen view for a gallery frame.
 *
 * The `VIEW` cursor promised something; before this, clicking a frame did nothing, which
 * is worse than having no cursor at all. This is the cheapest honest payoff: the
 * photograph at full size, with its caption, and nothing else.
 *
 * Portal, backdrop, scroll lock, Escape and the focus trap all come from `Overlay` —
 * which is also what keeps this above the navbar. See the note there.
 */
export function WorkLightbox({ item, onClose, labels }: WorkLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = item !== null

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
  }, [isOpen])

  return (
    <Overlay open={isOpen} onClose={onClose} className="items-center justify-center p-4 sm:p-10">
      {item && (
        <motion.figure
          role="dialog"
          aria-modal="true"
          aria-label={labels.region}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: DURATION.slow, ease: EASE.outExpo }}
          className="flex max-h-full w-full max-w-6xl flex-col gap-5"
          // The figure is the content, not the dismiss surface.
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="relative w-full overflow-hidden rounded-image bg-surface"
            style={{ aspectRatio: item.ratio }}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
            />
          </div>

          <figcaption className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-display text-display-project text-content uppercase">
                {item.title}
              </p>
              <p className="mt-2 font-mono text-meta text-content-tertiary uppercase">
                {item.scope}
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-11 items-center gap-2 rounded-control border border-line px-5 font-mono text-meta text-content uppercase transition-colors duration-[var(--duration-fast)] hover:border-line-strong hover:bg-surface"
            >
              {labels.close}
              <span aria-hidden="true">✕</span>
            </button>
          </figcaption>
        </motion.figure>
      )}
    </Overlay>
  )
}
