import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MEDIA_QUERY, useHasFinePointer, useIsDesktop, useMediaQuery } from './use-media-query'
import { useReducedMotion } from './use-reduced-motion'

type Listener = () => void

/** Minimal, controllable MediaQueryList so tests can flip a query at will. */
function stubMatchMedia(initialMatches: Record<string, boolean>) {
  const listeners = new Map<string, Set<Listener>>()
  const matches = { ...initialMatches }

  window.matchMedia = vi.fn((query: string) => ({
    get matches() {
      return matches[query] ?? false
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: Listener) => {
      const set = listeners.get(query) ?? new Set()
      set.add(listener)
      listeners.set(query, set)
    },
    removeEventListener: (_type: string, listener: Listener) => {
      listeners.get(query)?.delete(listener)
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia

  return {
    set(query: string, value: boolean) {
      matches[query] = value
      listeners.get(query)?.forEach((listener) => listener())
    },
    listenerCount(query: string) {
      return listeners.get(query)?.size ?? 0
    },
  }
}

describe('useMediaQuery', () => {
  let media: ReturnType<typeof stubMatchMedia>

  beforeEach(() => {
    media = stubMatchMedia({ '(min-width: 64rem)': true })
  })

  it('reports the current match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 64rem)'))

    expect(result.current).toBe(true)
  })

  it('reports false for a query that does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 200rem)'))

    expect(result.current).toBe(false)
  })

  it('re-renders when the query starts matching', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 200rem)'))

    act(() => media.set('(min-width: 200rem)', true))

    expect(result.current).toBe(true)
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 64rem)'))

    expect(media.listenerCount('(min-width: 64rem)')).toBe(1)

    unmount()

    expect(media.listenerCount('(min-width: 64rem)')).toBe(0)
  })
})

describe('intent hooks', () => {
  it('useIsDesktop tracks the lg breakpoint', () => {
    stubMatchMedia({ [MEDIA_QUERY.DESKTOP]: true })

    expect(renderHook(() => useIsDesktop()).result.current).toBe(true)
  })

  it('useHasFinePointer is false on a touch device', () => {
    stubMatchMedia({ [MEDIA_QUERY.FINE_POINTER]: false })

    expect(renderHook(() => useHasFinePointer()).result.current).toBe(false)
  })

  it('useReducedMotion follows the OS preference', () => {
    stubMatchMedia({ [MEDIA_QUERY.REDUCED_MOTION]: true })

    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
  })
})
