'use client'

import Image from 'next/image'
import { useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils/cn'

type BeforeAfterSliderProps = {
  beforeImage: string
  afterImage: string
  labels: {
    imageAlt: string
    beforeAlt: string
    before: string
    after: string
    slider: string
    sliderValue: string
  }
}

const STEP = 2
const STEP_LARGE = 10

/** Wireframe §16: 50% → 60% → 50%, once, in ~1.2s. */
const HINT_TARGET = 60
const HINT_HOLD_MS = 620
const HINT_RETURN_MS = 1240

/**
 * Drag-to-compare slider over a **macro paint shot**.
 *
 * The macro is deliberate: on a whole-car photo a "before" reads as nothing more
 * than a darker exposure, while on a panel the eye immediately reads haze versus
 * clarity, and flat versus sharp reflections. That is what a detailing customer
 * is actually looking for.
 *
 * Two independent images. When  and  differ, both are shown as
 * they are and both get real alt text — a genuine comparison.
 *
 * When they are the **same file** there is no real pair, and only then does the left half
 * get degraded in CSS (haze, lost contrast, softened highlights) so the mechanic can be
 * demonstrated. The fallback is conditional by design: dropping in two real photographs
 * removes the simulation automatically, rather than leaving it to be noticed later.
 * See .agents/specs/00-implementation-plan.md.
 *
 * Accessibility: the handle is a real slider (role, value, arrow keys), so the
 * comparison is reachable without a pointer.
 */
export function BeforeAfterSlider({ beforeImage, afterImage, labels }: BeforeAfterSliderProps) {
  const isSimulated = beforeImage === afterImage
  const frameRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const reduceMotion = useReducedMotion()
  const isInView = useInView(frameRef, { once: true, amount: 0.5 })

  const setFromClientX = useCallback((clientX: number) => {
    const bounds = frameRef.current?.getBoundingClientRect()
    if (!bounds || bounds.width === 0) return

    const ratio = ((clientX - bounds.left) / bounds.width) * 100
    setPosition(Math.min(100, Math.max(0, ratio)))
  }, [])

  /**
   * One-time nudge on first view, so the element announces that it is draggable
   * without a tooltip. Cancelled the moment the user touches it themselves.
   */
  useEffect(() => {
    if (!isInView || reduceMotion || hasInteracted) return

    const toTarget = window.setTimeout(() => setPosition(HINT_TARGET), HINT_HOLD_MS)
    const backToCentre = window.setTimeout(() => setPosition(50), HINT_RETURN_MS)

    return () => {
      window.clearTimeout(toTarget)
      window.clearTimeout(backToCentre)
    }
  }, [isInView, reduceMotion, hasInteracted])

  // Listeners live on the window so a fast drag that leaves the frame still tracks.
  useEffect(() => {
    if (!isDragging) return

    const onMove = (event: PointerEvent) => {
      event.preventDefault()
      setFromClientX(event.clientX)
    }
    const onUp = () => setIsDragging(false)

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [isDragging, setFromClientX])

  const nudge = (delta: number) => {
    setHasInteracted(true)
    setPosition((current) => Math.min(100, Math.max(0, current + delta)))
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const delta =
      event.key === 'ArrowLeft'
        ? -STEP
        : event.key === 'ArrowRight'
          ? STEP
          : event.key === 'PageDown'
            ? -STEP_LARGE
            : event.key === 'PageUp'
              ? STEP_LARGE
              : 0

    if (delta !== 0) {
      event.preventDefault()
      nudge(delta)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setHasInteracted(true)
      setPosition(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setHasInteracted(true)
      setPosition(100)
    }
  }

  return (
    <div
      ref={frameRef}
      onPointerDown={(event) => {
        setHasInteracted(true)
        setIsDragging(true)
        setFromClientX(event.clientX)
      }}
      className={cn(
        'relative aspect-4/3 w-full touch-none overflow-hidden rounded-image select-none sm:aspect-16/9 lg:aspect-[16/8.5]',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
    >
      {/* AFTER — the untouched frame, revealed to the right of the separator. */}
      <Image
        src={afterImage}
        alt={labels.imageAlt}
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 1280px"
        className="object-cover"
      />

      {/* BEFORE — a real photograph when one exists. Otherwise the same frame, degraded
          the way neglected paint actually looks: hazy, low in contrast, highlights soft. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          // A real "before" photograph is content and gets described. The duplicate used
          // by the simulation is decorative — the same frame announced twice is noise.
          alt={isSimulated ? '' : labels.beforeAlt}
          aria-hidden={isSimulated ? 'true' : undefined}
          fill
          sizes="(max-width: 1024px) 100vw, 1280px"
          className={cn(
            'object-cover',
            isSimulated && 'blur-[1.1px] brightness-[0.86] contrast-[0.68] saturate-[0.4]',
          )}
        />
        {/* Micro-haze, the optical signature of swirl marks under a hard light. Part of
            the simulation only — a real "before" photo already looks like this. */}
        {isSimulated && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(80%_60%_at_45%_40%,rgba(255,255,255,0.11),transparent_70%)]"
          />
        )}
      </div>

      <Badge className="top-5 left-5 text-content">{labels.before}</Badge>
      <Badge className="top-5 right-5 text-accent">{labels.after}</Badge>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-content"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      <button
        type="button"
        role="slider"
        aria-label={labels.slider}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% ${labels.sliderValue}`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex size-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full border border-line-strong bg-canvas/82 text-content backdrop-blur-sm"
        style={{ left: `${position}%` }}
      >
        <span aria-hidden="true" className="text-body-sm leading-none">
          ←
        </span>
        <span aria-hidden="true" className="text-body-sm leading-none">
          →
        </span>
      </button>
    </div>
  )
}

/** One shared badge system for both sides — same size, same surface, one differs only in colour. */
function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'absolute flex h-[26px] items-center rounded-full bg-canvas-deep/82 px-[10px] font-mono text-meta uppercase backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}
