/**
 * Four typographic stats. Labels live in the dictionaries, keyed by `key`.
 */
const PROJECT_COUNT = 350
const AVERAGE_RATING = 4.9

export const STAT_KEYS = ['projects', 'rating', 'years', 'individual'] as const

export type StatKey = (typeof STAT_KEYS)[number]

export type Stat = {
  key: StatKey
  value: number
  decimals: number
  suffix: string
}

export const stats: readonly Stat[] = [
  { key: 'projects', value: PROJECT_COUNT, decimals: 0, suffix: '+' },
  { key: 'rating', value: AVERAGE_RATING, decimals: 1, suffix: '' },
  { key: 'years', value: 5, decimals: 0, suffix: '' },
  { key: 'individual', value: 100, decimals: 0, suffix: '%' },
]

/**
 * The same two numbers, named, for the hero's social proof line. Reading them off
 * `stats` by index would break silently the moment that list is reordered.
 */
export const socialProof = {
  rating: AVERAGE_RATING,
  projectCount: PROJECT_COUNT,
} as const
