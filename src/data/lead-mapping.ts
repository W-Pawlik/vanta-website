import type { PackageSlug } from './pricing'
import type { ServiceSlug } from './services'

import type { LeadInterest } from '@/lib/validation/lead'

/**
 * What a service or package means in the language of the lead form.
 *
 * This is the bridge that makes the page feel like one system instead of a stack of
 * independent sections: choosing a service in the drawer or a package in the pricing
 * grid pre-ticks step 2 of the form.
 *
 * Kept as data, not inlined in components, so the mapping is reviewable in one place
 * and both writers stay in sync.
 */
export const SERVICE_TO_INTERESTS: Record<ServiceSlug, readonly LeadInterest[]> = {
  'paint-correction': ['paint', 'scratches'],
  'paint-protection': ['ceramic'],
  interior: ['interior'],
  // A catch-all category can't imply a specific need — ask instead of guessing.
  additional: ['advice'],
}

export const PACKAGE_TO_INTERESTS: Record<PackageSlug, readonly LeadInterest[]> = {
  refresh: ['paint'],
  signature: ['paint', 'ceramic', 'interior'],
  'black-label': ['paint', 'scratches', 'ceramic', 'interior'],
}
