'use client'

import Image from 'next/image'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'

import { useHasFinePointer } from '@/hooks/use-media-query'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'
import { formatOrdinal } from '@/lib/utils/format'

import { WorkLightbox, type LightboxItem } from './work-lightbox'

export type GalleryFrame = {
  image: string
  ratio: number
  parallax: number
  imageAlt: string
  title: string
  scope: string
}

type Labels = {
  view: string
  statement: readonly string[]
  lightboxRegion: string
  close: string
  openFrame: string
}

const CURSOR_SIZE = 72
const CURSOR_SPRING = { stiffness: 350, damping: 30, mass: 0.4 } as const

/**
 * The gallery grid.
 *
 * Client-side because every frame has its own parallax range, the grid shares one
 * `VIEW` cursor, and clicking a frame opens it full size. The cursor exists **only**
 * here — a custom cursor across the whole page is a cliché and gets in the way.
 *
 * Captions are always in the markup, never hover-only.
 */
export function WorkGallery({
  frames,
  closing,
  labels,
}: {
  frames: readonly GalleryFrame[]
  closing: GalleryFrame
  labels: Labels
}) {
  const [porsche, amg, maserati] = frames
  const [opened, setOpened] = useState<LightboxItem | null>(null)

  const hasFinePointer = useHasFinePointer()
  const reduceMotion = useReducedMotion()
  const cursorEnabled = hasFinePointer && !reduceMotion

  const [isOverFrame, setIsOverFrame] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const cursorX = useSpring(rawX, CURSOR_SPRING)
  const cursorY = useSpring(rawY, CURSOR_SPRING)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!cursorEnabled) return
    const bounds = event.currentTarget.getBoundingClientRect()
    rawX.set(event.clientX - bounds.left)
    rawY.set(event.clientY - bounds.top)
  }

  const frameProps = (frame: GalleryFrame) => ({
    frame,
    label: labels.openFrame,
    onOpen: () => setOpened(frame),
    onPointerEnter: cursorEnabled ? () => setIsOverFrame(true) : undefined,
    onPointerLeave: cursorEnabled ? () => setIsOverFrame(false) : undefined,
  })

  return (
    <div className="relative" onPointerMove={onPointerMove}>
      <div className="space-y-6">
        {porsche && (
          <div className="grid grid-cols-12 gap-6">
            <Frame
              {...frameProps(porsche)}
              className="col-span-12 lg:col-span-9"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            {/* Caption dropped down the column rather than hugging the image edge. */}
            <Caption
              index={1}
              total={frames.length}
              frame={porsche}
              className="col-span-12 lg:col-span-3 lg:mt-8 lg:self-end"
            />
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {amg && (
            <div className="col-span-12 lg:col-span-7">
              <Frame {...frameProps(amg)} sizes="(max-width: 1024px) 100vw, 740px" />
              <Caption index={2} total={frames.length} frame={amg} className="mt-6" />
            </div>
          )}
          {maserati && (
            <div className="col-span-12 lg:col-span-5">
              <Frame {...frameProps(maserati)} sizes="(max-width: 1024px) 100vw, 520px" />
              <Caption index={3} total={frames.length} frame={maserati} className="mt-6" />
            </div>
          )}
        </div>

        {/* Closing row. The left column has to hold its own against the tall frame,
            otherwise the black space reads as an empty grid column. */}
        <div className="grid grid-cols-12 items-center gap-6 pt-16">
          <p className="col-span-12 font-display text-display-section text-content uppercase opacity-55 lg:col-span-5">
            {labels.statement.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Frame
              {...frameProps(closing)}
              className="mx-auto max-w-lg"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <Caption frame={closing} className="mx-auto mt-6 max-w-lg" />
          </div>
        </div>
      </div>

      {cursorEnabled && (
        <AnimatePresence>
          {isOverFrame && !opened && (
            <motion.div
              aria-hidden="true"
              style={{ x: cursorX, y: cursorY, width: CURSOR_SIZE, height: CURSOR_SIZE }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            >
              <span className="flex size-full items-center justify-center font-mono text-meta text-accent-contrast uppercase">
                {labels.view}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <WorkLightbox
        item={opened}
        onClose={() => setOpened(null)}
        labels={{ close: labels.close, region: labels.lightboxRegion }}
      />
    </div>
  )
}

/**
 * One clipped frame. The container never moves: the image inside drifts against the
 * scroll and lifts a hair on hover. Zoom is capped at 1.03 — more looks like a
 * template effect.
 *
 * It is a real `<button>`, so the frame is reachable by keyboard and the `VIEW`
 * cursor actually promises something.
 */
function Frame({
  frame,
  label,
  onOpen,
  className,
  sizes,
  onPointerEnter,
  onPointerLeave,
}: {
  frame: GalleryFrame
  label: string
  onOpen: () => void
  className?: string
  sizes: string
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}) {
  const frameRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })

  const range = reduceMotion ? 0 : frame.parallax
  const y = useTransform(scrollYProgress, [0, 1], [range, -range])

  return (
    <button
      ref={frameRef}
      type="button"
      onClick={onOpen}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      aria-label={`${label}: ${frame.title}`}
      className={cn(
        'group relative block w-full cursor-pointer overflow-hidden rounded-image bg-surface',
        className,
      )}
      // Ratio comes from the source file, so the frame reserves space and the gallery
      // cannot shift the layout while images load.
      style={{ aspectRatio: frame.ratio }}
    >
      <motion.span
        style={{ y, top: -range, height: `calc(100% + ${range * 2}px)` }}
        className="absolute inset-x-0 block"
      >
        <Image
          src={frame.image}
          alt={frame.imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[var(--duration-slow)] ease-out-quart group-hover:scale-[1.03]"
        />
      </motion.span>
    </button>
  )
}

function Caption({
  index,
  total,
  frame,
  className,
}: {
  index?: number
  total?: number
  frame: GalleryFrame
  className?: string
}) {
  return (
    <div className={className}>
      {index !== undefined && total !== undefined && (
        <p className="mb-3 font-mono text-meta text-content-tertiary">
          <span className="text-content-secondary">{formatOrdinal(index)}</span>
          <span aria-hidden="true"> / </span>
          {formatOrdinal(total)}
        </p>
      )}
      <h3 className="font-display text-display-project text-content uppercase">{frame.title}</h3>
      <p className="mt-2 font-mono text-meta text-content-tertiary uppercase">{frame.scope}</p>
    </div>
  )
}
