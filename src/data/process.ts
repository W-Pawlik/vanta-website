/**
 * Four steps on a horizontal timeline. Order matters; copy lives in the dictionaries,
 * keyed by these values.
 */
export const PROCESS_STEP_KEYS = ['contact', 'quote', 'work', 'pickup'] as const

export type ProcessStepKey = (typeof PROCESS_STEP_KEYS)[number]
