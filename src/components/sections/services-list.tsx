'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState, type PointerEvent } from 'react'

import { useLeadSelection } from '@/components/lead/lead-selection'
import { useHasFinePointer } from '@/hooks/use-media-query'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { SERVICE_TO_INTERESTS } from '@/data/lead-mapping'
import { primaryCtaHref } from '@/data/navigation'
import type { ServiceSlug } from '@/data/services'
import { DURATION, EASE } from '@/lib/motion/tokens'
import { blurProps } from '@/lib/images/blur'
import { formatOrdinal, formatPriceFrom } from '@/lib/utils/format'

import {
  ServiceDrawer,
  type DrawerContent,
  type DrawerPricelist,
  type DrawerService,
} from './service-drawer'

export type ServiceListItem = DrawerService & {
  slug: ServiceSlug
  /** Cheapest variant — the only number shown in the list. */
  priceFrom: number
}

type Labels = {
  priceNote: string
  pricelistCta: string
  openDetails: string
  drawer: {
    region: string
    variants: string
    includes: string
    cta: string
    close: string
    perUnit: string
  }
}

/** Wireframe: the hover preview is ~320×220. */
const PREVIEW_WIDTH = 320
const PREVIEW_HEIGHT = 220

/**
 * Distance between the pointer and the preview's leading edge. Large enough that the
 * cursor never sits on top of the photograph it is revealing.
 */
const CURSOR_GAP = 28

/** Inset used when the preview is anchored to a row by keyboard focus instead of a pointer. */
const FOCUS_INSET = 24

/**
 * The preview follows the pointer through a spring rather than tracking it exactly.
 * Gluing the image to the cursor looks cheap; a damped trail looks considered
 * (.agents/05-animation-system.md).
 */
const SPRING = { stiffness: 140, damping: 20, mass: 0.5 } as const

/**
 * The service rows plus the drawer they open.
 *
 * The interaction ladder is deliberate: **hover** shows the photograph (interest),
 * **click** opens the category detail with its price variants (information), and only
 * the drawer's CTA goes to the form (intent). Clicking a row used to jump straight to
 * contact, which is too aggressive for someone who just wants to know what a service
 * covers.
 *
 * Rows are real buttons, so the whole thing works from the keyboard, and every price
 * is in the markup — hover is never the only route to information.
 */
export function ServicesList({
  items,
  pricelist,
  labels,
}: {
  items: readonly ServiceListItem[]
  pricelist: DrawerPricelist
  labels: Labels
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [content, setContent] = useState<DrawerContent | null>(null)

  const { select } = useLeadSelection()
  const hasFinePointer = useHasFinePointer()
  const reduceMotion = useReducedMotion()
  const previewEnabled = hasFinePointer && !reduceMotion

  const listRef = useRef<HTMLUListElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, SPRING)
  const y = useSpring(pointerY, SPRING)

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (!previewEnabled) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const position = clampToList(
      event.clientX - bounds.left + CURSOR_GAP,
      event.clientY - bounds.top - PREVIEW_HEIGHT / 2,
      bounds,
    )

    pointerX.set(position.x)
    pointerY.set(position.y)
  }

  /**
   * Re-entering the list would otherwise animate the preview across the section from
   * wherever the pointer left it. `jump` places it under the cursor without a transition;
   * every move after that is sprung.
   */
  const onPointerEnter = (event: PointerEvent<HTMLUListElement>) => {
    if (!previewEnabled) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const position = clampToList(
      event.clientX - bounds.left + CURSOR_GAP,
      event.clientY - bounds.top - PREVIEW_HEIGHT / 2,
      bounds,
    )

    x.jump(position.x)
    y.jump(position.y)
  }

  /**
   * Keyboard focus has no pointer to follow, so the preview is anchored to the focused
   * row instead — otherwise it would appear at whatever position the mouse last visited.
   */
  const anchorToRow = (row: HTMLElement) => {
    const bounds = listRef.current?.getBoundingClientRect()
    if (!previewEnabled || !bounds) return

    const rowBounds = row.getBoundingClientRect()
    const position = clampToList(
      bounds.width - PREVIEW_WIDTH - FOCUS_INSET,
      rowBounds.top - bounds.top + rowBounds.height / 2 - PREVIEW_HEIGHT / 2,
      bounds,
    )

    x.jump(position.x)
    y.jump(position.y)
  }

  // Focus returns to the trigger on close — handled by Overlay, which captures the
  // active element when it opens.
  const open = (next: DrawerContent) => setContent(next)
  const close = () => setContent(null)

  /** Seed step 2 of the form, then let the anchor do the scrolling. */
  const handleCta = () => {
    if (content?.kind === 'service') {
      select(SERVICE_TO_INTERESTS[content.service.slug as ServiceSlug])
    }
    setContent(null)
  }

  const active = activeIndex === null ? null : items[activeIndex]

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-meta text-content-tertiary uppercase">{labels.priceNote}</p>

        <button
          type="button"
          onClick={() => open({ kind: 'pricelist', pricelist })}
          className="group inline-flex shrink-0 items-center gap-2 font-mono text-meta text-content uppercase transition-colors duration-[var(--duration-fast)] hover:text-accent"
        >
          {labels.pricelistCta}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>

      <ul
        ref={listRef}
        className="mt-8 border-t border-line"
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActiveIndex(null)}
      >
        {items.map((item, index) => (
          <li key={item.slug} className="border-b border-line">
            <button
              type="button"
              onClick={() => open({ kind: 'service', service: item })}
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={(event) => {
                setActiveIndex(index)
                anchorToRow(event.currentTarget)
              }}
              onBlur={() => setActiveIndex(null)}
              aria-label={`${item.name} — ${labels.openDetails}`}
              className="group grid w-full cursor-pointer grid-cols-12 items-center gap-x-6 gap-y-5 py-8 text-left transition-colors duration-[var(--duration-base)] ease-out-quart hover:bg-content/[0.015] lg:min-h-[8.75rem] lg:py-6"
            >
              <span className="col-span-2 font-mono text-meta text-content-tertiary transition-colors duration-[var(--duration-base)] group-hover:text-content-secondary lg:col-span-1">
                {formatOrdinal(index + 1)}
              </span>

              <span className="col-span-10 block lg:col-span-6">
                <span className="block font-display text-display-project text-content uppercase transition-transform duration-[var(--duration-base)] ease-out-quart group-hover:translate-x-1.5">
                  {item.name}
                </span>
                <span className="mt-2 block max-w-measure text-body-sm text-content-secondary">
                  {item.description}
                </span>
              </span>

              {/* Mobile-only: on desktop the same photograph becomes the preview. */}
              <span className="col-span-12 block lg:hidden">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  width={640}
                  height={427}
                  sizes="100vw"
                  {...blurProps(item.image)}
                  className="aspect-3/2 w-full rounded-image object-cover"
                />
              </span>

              {/* Neutral at rest, accent on hover. The lime has to mean something, so it
                  cannot be the resting colour of every price on the page. */}
              <span className="col-span-10 font-mono text-label text-content-secondary transition-colors duration-[var(--duration-base)] group-hover:text-accent lg:col-span-4 lg:text-right">
                {formatPriceFrom(item.priceFrom)}
              </span>

              <span
                aria-hidden="true"
                className="col-span-2 text-right text-body text-content-tertiary transition-all duration-[var(--duration-base)] ease-out-quart group-hover:translate-x-1 group-hover:text-content lg:col-span-1"
              >
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>

      {previewEnabled && (
        <AnimatePresence>
          {active && !content && (
            <motion.div
              key={active.slug}
              aria-hidden="true"
              style={{ x, y, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: DURATION.base, ease: EASE.outQuart }}
              className="pointer-events-none absolute top-0 left-0 overflow-hidden rounded-image"
            >
              <Image src={active.image} alt="" fill sizes="320px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <ServiceDrawer
        content={content}
        onClose={close}
        onCta={handleCta}
        ctaHref={primaryCtaHref}
        labels={labels.drawer}
      />
    </div>
  )
}

/**
 * Keeps the preview inside the list box. Without the clamp it would hang over the section
 * edges near the first row, the last row and the right gutter — the photograph has to read
 * as part of the composition, not as an element escaping it.
 */
function clampToList(x: number, y: number, bounds: DOMRect) {
  return {
    x: clamp(x, 0, Math.max(bounds.width - PREVIEW_WIDTH, 0)),
    y: clamp(y, 0, Math.max(bounds.height - PREVIEW_HEIGHT, 0)),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
