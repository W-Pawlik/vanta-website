'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Media queries expressed once, in the same units as the Tailwind breakpoints.
 * Components ask for intent (`DESKTOP`, `FINE_POINTER`), not for pixel numbers.
 */
export const MEDIA_QUERY = {
  /** Tailwind `lg`. The threshold where desktop-only motion is allowed. */
  DESKTOP: '(min-width: 64rem)',
  /** True for mouse/trackpad. Gates hover-dependent effects and custom cursors. */
  FINE_POINTER: '(hover: hover) and (pointer: fine)',
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
} as const

/**
 * SSR-safe media query subscription. Server render and first client render both
 * report `false`, so a query must never be the only thing that makes content
 * appear — treat it as progressive enhancement.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onStoreChange)
      return () => list.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Desktop viewport — the only place heavier scroll choreography is enabled. */
export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA_QUERY.DESKTOP)
}

/** Real pointer available — required before wiring any hover-only interaction. */
export function useHasFinePointer(): boolean {
  return useMediaQuery(MEDIA_QUERY.FINE_POINTER)
}
