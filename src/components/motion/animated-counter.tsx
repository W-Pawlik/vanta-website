'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { DURATION, EASE, VIEWPORT } from '@/lib/motion/tokens'
import { formatDecimal } from '@/lib/utils/format'

type AnimatedCounterProps = {
  value: number
  /** `1` for ratings like 4,9; `0` for counts like 350. */
  decimals?: number
  /** Rendered after the number, e.g. `+` or `%`. */
  suffix?: string
  className?: string
}

const integerFormatter = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 })

function formatValue(value: number, decimals: number): string {
  return decimals > 0 ? formatDecimal(value, decimals) : integerFormatter.format(Math.round(value))
}

/**
 * Counts up once, the first time it enters the viewport. Never replays on
 * scroll-up: a number that re-animates every pass reads as a glitch.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: VIEWPORT.amount })
  const reduceMotion = useReducedMotion()
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    if (!isInView || reduceMotion) return

    const controls = animate(0, value, {
      duration: DURATION.hero,
      ease: EASE.outQuart,
      onUpdate: setAnimatedValue,
    })

    return () => controls.stop()
  }, [isInView, reduceMotion, value])

  // Derived, not stored: with reduced motion the final value is rendered straight
  // away, so state is only ever written from the animation callback.
  const displayed = reduceMotion ? value : isInView ? animatedValue : 0
  const finalText = `${formatValue(value, decimals)}${suffix}`

  return (
    <span ref={ref} className={className}>
      {/* The animating value is hidden from assistive tech; the final value is
          announced once, so a screen reader never hears a stream of numbers. */}
      <span aria-hidden="true">
        {formatValue(displayed, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  )
}
