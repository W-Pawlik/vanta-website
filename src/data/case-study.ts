/**
 * The single case study behind the before/after slider.
 *
 * `beforeImage` and `afterImage` are separate on purpose. Point them at two real
 * photographs of the same panel — one neglected, one corrected — and the section becomes
 * a genuine comparison with no code change.
 *
 * While they point at the **same file**, the slider knows it has no real pair and falls
 * back to degrading the left half in CSS. That fallback is deliberately conditional, so
 * the simulation can never quietly survive a real pair being dropped in.
 *
 * Car name, scope and turnaround live in the dictionaries.
 */
export const caseStudy = {
  year: 2024,
  beforeImage: '/images/before-after-paint.jpg',
  afterImage: '/images/before-after-paint.jpg',
} as const

/** True while the two sides are the same photograph. */
export const hasRealBeforeAfterPair = caseStudy.beforeImage !== caseStudy.afterImage
