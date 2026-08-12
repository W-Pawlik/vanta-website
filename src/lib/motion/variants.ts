import type { Transition, Variants } from 'motion/react'

import { DURATION, EASE, REVEAL_DISTANCE, STAGGER } from './tokens'

/**
 * Reusable Motion variants. Sections compose these instead of writing inline
 * `initial`/`animate` objects, so timing stays consistent across the page.
 *
 * Every factory takes a `reduceMotion` flag: when true it returns an
 * opacity-only variant, never a transform. Components pass the value from
 * useReducedMotion() — see .agents/05-animation-system.md.
 */

type MotionOptions = {
  reduceMotion?: boolean
  delay?: number
}

const transition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE.outExpo,
})

/** Fade with a short upward travel. The default entrance for most content. */
export function fadeUp({ reduceMotion = false, delay = 0 }: MotionOptions = {}): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : REVEAL_DISTANCE },
    visible: {
      opacity: 1,
      y: 0,
      transition: transition(DURATION.reveal, delay),
    },
  }
}

/** Opacity only. Use where a transform would fight the layout (full-bleed media). */
export function fadeIn({ delay = 0 }: MotionOptions = {}): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transition(DURATION.slow, delay) },
  }
}

/**
 * A line of text sliding out from behind a mask. The parent element needs the
 * `mask-row` utility (overflow: hidden) for this to read correctly.
 */
export function maskRow({ reduceMotion = false, delay = 0 }: MotionOptions = {}): Variants {
  if (reduceMotion) {
    return fadeIn({ delay })
  }

  return {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: { duration: DURATION.reveal, delay, ease: EASE.outQuint },
    },
  }
}

/** Parent that releases its children one after another. */
export function staggerContainer({
  stagger = STAGGER.base,
  delayChildren = 0,
}: { stagger?: number; delayChildren?: number } = {}): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Card entrance used by the pricing grid: small lift, no scale, no 3D. */
export function cardIn({ reduceMotion = false, delay = 0 }: MotionOptions = {}): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.slow, delay, ease: EASE.outQuart },
    },
  }
}

/** Horizontal step transition for the multi-step lead form. */
export function stepSlide(direction: 1 | -1, { reduceMotion = false }: MotionOptions = {}) {
  const STEP_OFFSET = 30
  const enterFrom = reduceMotion ? 0 : STEP_OFFSET * direction
  const exitTo = reduceMotion ? 0 : STEP_OFFSET * -direction

  return {
    initial: { opacity: 0, x: enterFrom },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: DURATION.base, ease: EASE.outQuart },
    },
    exit: {
      opacity: 0,
      x: exitTo,
      transition: { duration: DURATION.fast, ease: EASE.outQuart },
    },
  }
}
