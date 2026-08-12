import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(cleanup)

/**
 * jsdom implements neither `matchMedia` nor the observer APIs that Motion and our
 * scroll-driven components rely on. Stubs live here so no individual test has to
 * remember them. Tests that assert on media queries override `window.matchMedia`
 * themselves — see `src/hooks/use-media-query.test.ts`.
 */
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

class ObserverStub {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: readonly number[] = []
}

window.IntersectionObserver ??= ObserverStub as unknown as typeof IntersectionObserver
window.ResizeObserver ??= ObserverStub as unknown as typeof ResizeObserver
