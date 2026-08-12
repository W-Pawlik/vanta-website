'use client'

/**
 * GSAP is loaded **on demand**, not imported at module scope.
 *
 * The reason is measured, not stylistic: GSAP + ScrollTrigger is 459 KB raw / 128 KB gzip,
 * which was 34 % of the page's initial JavaScript — for a single effect in one section
 * (`ScrollLitText` in Manifesto), below the fold, that cannot run until after hydration
 * anyway. A static import put all of it on the critical path of every visitor, including
 * those who never scroll that far and those with `prefers-reduced-motion`, for whom the
 * animation does not run at all. See [ADR-0007](../../../.agents/decisions/0007-lazy-gsap.md).
 *
 * The promise is cached, so concurrent callers and remounts share one download and the
 * plugin is registered exactly once.
 */

// Type-only import of the package's default export: erased at compile time, so naming
// GSAP's type here does not put GSAP back into the bundle.
import type GsapDefault from 'gsap'

type GsapCore = typeof GsapDefault

let loading: Promise<{ gsap: GsapCore }> | null = null

export function loadGsap(): Promise<{ gsap: GsapCore }> {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([core, scrollTrigger]) => {
      core.gsap.registerPlugin(scrollTrigger.ScrollTrigger)
      return { gsap: core.gsap }
    },
  )

  return loading
}
