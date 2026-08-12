/**
 * Selected Work — three frames plus a closing editorial frame.
 *
 * All four are in one photographic language: dark studio or showroom, controlled
 * lighting, reflections on paint, deep blacks. Two earlier frames (a night car park
 * and a daylight lakeside shot) were dropped — four projects that look like four
 * different websites undo the whole section.
 *
 * `parallax` is per-project on purpose. Identical travel on every image reads as a
 * global effect; different ranges make the composition breathe.
 *
 * Copy (car names, scope, alt text) lives in the dictionaries, keyed by `slug`.
 */
export const PROJECT_SLUGS = ['porsche-911', 'mercedes-amg-gt', 'maserati'] as const

export type ProjectSlug = (typeof PROJECT_SLUGS)[number]

export type Project = {
  slug: ProjectSlug
  image: string
  /** Intrinsic aspect ratio of the source file, used to size the frame. */
  ratio: number
  /** Vertical parallax travel in pixels. Kept under 60 — almost subconscious. */
  parallax: number
}

export const projects: readonly Project[] = [
  { slug: 'porsche-911', image: '/images/work-porsche-911.jpg', ratio: 2, parallax: 30 },
  { slug: 'mercedes-amg-gt', image: '/images/work-amg-studio.jpg', ratio: 1.778, parallax: 45 },
  { slug: 'maserati', image: '/images/work-maserati.jpg', ratio: 1.497, parallax: 25 },
]

/**
 * Closing frame of the gallery, treated as an editorial interruption rather than as
 * a case study — the car is not meant to be identifiable here, the finish is.
 */
export const closingFrame = {
  image: '/images/work-alpine-a110.jpg',
  ratio: 0.667,
  parallax: 60,
} as const
