/**
 * Motion tokens — the JS mirror of the easing scale in src/styles/theme.css and
 * the duration scale in src/styles/base.css. Two representations are unavoidable
 * (Tailwind needs CSS custom properties, Motion and GSAP need numbers), so when
 * one changes, change the other. Nothing else may invent its own curve.
 *
 * Reference: .agents/05-animation-system.md
 */

export type Bezier = [number, number, number, number]

/** Seconds — Motion and GSAP both take seconds, CSS takes the `ms` mirror. */
export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.48,
  reveal: 0.8,
  hero: 1.6,
} as const

export type DurationToken = keyof typeof DURATION

/** Decisive start, soft settle. Symmetric ease-in-out is deliberately absent. */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, Bezier>

export type EaseToken = keyof typeof EASE

/** Delay between siblings in a staggered group. */
export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  loose: 0.14,
} as const

/**
 * Default viewport contract for scroll reveals: play once, when a third of the
 * element is visible. Reveals must never replay on scroll-up.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.3,
} as const

/** Vertical travel of a reveal, in pixels. Subtle by design. */
export const REVEAL_DISTANCE = 28

/** Parallax range, in pixels. The brief caps this at "almost subconscious". */
export const PARALLAX_RANGE = 40
