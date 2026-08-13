import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useLockBodyScroll } from './use-lock-body-scroll'

/** jsdom reports 0 for both widths, so a scrollbar has to be simulated. */
function simulateScrollbar(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true })
  Object.defineProperty(document.documentElement, 'clientWidth', {
    value: 1000 - width,
    configurable: true,
  })
}

afterEach(() => {
  document.body.style.overflow = ''
  document.body.style.overflowX = ''
  document.body.style.overflowY = ''
  document.body.style.paddingRight = ''
})

describe('useLockBodyScroll', () => {
  it('does nothing while unlocked', () => {
    renderHook(() => useLockBodyScroll(false))

    expect(document.body.style.overflowY).toBe('')
  })

  it('freezes scrolling when locked', () => {
    renderHook(() => useLockBodyScroll(true))

    expect(document.body.style.overflowY).toBe('hidden')
  })

  /**
   * Guards the horizontal overflow net in base.css. An inline `overflow: hidden` here
   * would override the stylesheet's `overflow-x: clip`, so the page could be scrolled
   * sideways for as long as an overlay was open — a mobile-only bug, because that is
   * where the overlays are.
   */
  it('leaves the horizontal axis alone so the overflow-x clip survives', () => {
    renderHook(() => useLockBodyScroll(true))

    expect(document.body.style.overflowX).toBe('')
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('compensates for the scrollbar width so the layout does not shift', () => {
    simulateScrollbar(15)

    renderHook(() => useLockBodyScroll(true))

    expect(document.body.style.paddingRight).toBe('15px')
  })

  it('adds no padding when there is no scrollbar', () => {
    simulateScrollbar(0)

    renderHook(() => useLockBodyScroll(true))

    expect(document.body.style.paddingRight).toBe('')
  })

  it('restores the previous inline styles on unmount', () => {
    simulateScrollbar(15)
    document.body.style.overflowY = 'auto'

    const { unmount } = renderHook(() => useLockBodyScroll(true))
    unmount()

    expect(document.body.style.overflowY).toBe('auto')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('releases the lock when the flag flips back to false', () => {
    const { rerender } = renderHook(({ locked }) => useLockBodyScroll(locked), {
      initialProps: { locked: true },
    })

    rerender({ locked: false })

    expect(document.body.style.overflowY).toBe('')
  })
})
