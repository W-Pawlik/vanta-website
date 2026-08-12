/**
 * The single case study behind the before/after slider.
 *
 * These are a **real pair**: the same Porsche flank, same garage, same framing and the same
 * 1376×768 frame, photographed before and after paint correction. The swirl marks and
 * micro-scratches on the "before" side are the actual defects, not a CSS filter.
 *
 * The slider only falls back to simulating a "before" when both fields point at the same
 * file — see before-after-slider.tsx. They no longer do.
 *
 * Car name, scope and turnaround live in the dictionaries.
 */
export const caseStudy = {
  year: 2024,
  beforeImage: '/images/before-after-porsche-before.jpg',
  afterImage: '/images/before-after-porsche-after.jpg',
} as const
