import { describe, expect, it } from 'vitest'

import { DURATION, EASE, REVEAL_DISTANCE, STAGGER } from './tokens'
import { cardIn, fadeIn, fadeUp, maskRow, staggerContainer, stepSlide } from './variants'

describe('fadeUp', () => {
  it('travels upward by the reveal distance', () => {
    expect(fadeUp().hidden).toEqual({ opacity: 0, y: REVEAL_DISTANCE })
  })

  it('drops the transform under reduced motion but keeps the fade', () => {
    const variants = fadeUp({ reduceMotion: true })

    expect(variants.hidden).toEqual({ opacity: 0, y: 0 })
    expect(variants.visible).toMatchObject({ opacity: 1 })
  })

  it('uses the shared duration and easing tokens', () => {
    expect(variants(fadeUp().visible)).toMatchObject({
      transition: { duration: DURATION.reveal, ease: EASE.outExpo },
    })
  })

  it('forwards the delay', () => {
    expect(variants(fadeUp({ delay: 0.25 }).visible).transition).toMatchObject({ delay: 0.25 })
  })
})

describe('fadeIn', () => {
  it('never animates a transform', () => {
    expect(fadeIn().hidden).toEqual({ opacity: 0 })
  })
})

describe('maskRow', () => {
  it('slides a full line height from behind the mask', () => {
    expect(maskRow().hidden).toEqual({ y: '110%' })
  })

  it('degrades to a plain fade under reduced motion', () => {
    expect(maskRow({ reduceMotion: true })).toEqual(fadeIn())
  })
})

describe('staggerContainer', () => {
  it('defaults to the base stagger token', () => {
    expect(variants(staggerContainer().visible).transition).toMatchObject({
      staggerChildren: STAGGER.base,
    })
  })

  it('accepts an explicit stagger and child delay', () => {
    const transition = variants(
      staggerContainer({ stagger: STAGGER.loose, delayChildren: 0.4 }).visible,
    ).transition

    expect(transition).toMatchObject({ staggerChildren: STAGGER.loose, delayChildren: 0.4 })
  })
})

describe('cardIn', () => {
  it('lifts the card without scaling it', () => {
    const hidden = cardIn().hidden as unknown as Record<string, unknown>

    expect(hidden.y).toBe(40)
    expect(hidden).not.toHaveProperty('scale')
  })
})

describe('stepSlide', () => {
  it('enters from the direction of travel and exits the opposite way', () => {
    const forward = stepSlide(1)

    expect(forward.initial.x).toBe(30)
    expect(forward.exit.x).toBe(-30)
  })

  it('mirrors for backwards navigation', () => {
    const backward = stepSlide(-1)

    expect(backward.initial.x).toBe(-30)
    expect(backward.exit.x).toBe(30)
  })

  it('collapses to a cross-fade under reduced motion', () => {
    const reduced = stepSlide(1, { reduceMotion: true })

    expect(reduced.initial.x).toBe(0)
    expect(reduced.exit.x).toBe(0)
  })
})

/** Motion's Variant type is a union; tests only ever inspect the object form. */
function variants(variant: unknown) {
  return variant as { transition: Record<string, unknown> }
}
