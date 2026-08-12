'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Single place where GSAP plugins are registered. Registering twice is harmless
 * but noisy, and registering during SSR throws, so both are guarded here.
 *
 * Components must import `gsap` and `ScrollTrigger` from this module rather than
 * from the package, so the registration can never be skipped by accident.
 */
let registered = false

export function registerGsapPlugins(): void {
  if (registered || typeof window === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export { gsap, ScrollTrigger }
