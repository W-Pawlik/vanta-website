'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { LeadInterest } from '@/lib/validation/lead'

type LeadSelection = {
  /** Interests to seed step 2 with. Empty until the visitor picks a service or package. */
  interests: readonly LeadInterest[]
  select: (interests: readonly LeadInterest[]) => void
}

const LeadSelectionContext = createContext<LeadSelection | null>(null)

/**
 * The one piece of cross-section client state on the page.
 *
 * A visitor who opens "Paint correction", reads what it covers and clicks "Get this
 * service quoted" should not have to tell the form the same thing again — step 2
 * arrives already ticked. Same for picking a package.
 *
 * It is a provider rather than a store because that is all the scope needs: two
 * writers (Services, Packages), one reader (the lead form), no persistence.
 * Wrapping the tree does **not** make the sections client components — they are
 * already-rendered children passed through.
 */
export function LeadSelectionProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<readonly LeadInterest[]>([])

  const select = useCallback((next: readonly LeadInterest[]) => setInterests(next), [])

  const value = useMemo<LeadSelection>(() => ({ interests, select }), [interests, select])

  return <LeadSelectionContext.Provider value={value}>{children}</LeadSelectionContext.Provider>
}

/**
 * Returns a no-op selection when used outside the provider, so a component can be
 * rendered in isolation (or in a test) without needing the whole tree.
 */
export function useLeadSelection(): LeadSelection {
  return useContext(LeadSelectionContext) ?? { interests: [], select: () => {} }
}
