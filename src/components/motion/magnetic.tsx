'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { useRef } from 'react'

import { useHasFinePointer } from '@/hooks/use-media-query'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

type MagneticProps = {
  children: ReactNode
  /** Maximum pull toward the cursor, in pixels. Keep it under ~12. */
  strength?: number
  className?: string
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.4 } as const

/**
 * Pulls its child a few pixels toward the cursor. Wraps a CTA — it does not
 * replace one, so the child keeps its own semantics and focus behaviour.
 *
 * Disabled entirely without a fine pointer or under reduced motion. On touch it
 * renders a plain wrapper, so no pointer handlers are attached at all.
 */
export function Magnetic({ children, strength = 8, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasFinePointer = useHasFinePointer()
  const reduceMotion = useReducedMotion()
  const enabled = hasFinePointer && !reduceMotion

  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const x = useSpring(offsetX, SPRING)
  const y = useSpring(offsetY, SPRING)

  if (!enabled) {
    return <span className={className}>{children}</span>
  }

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return

    // Normalised distance from centre, -1..1, scaled to the pull strength.
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5

    offsetX.set(relativeX * strength * 2)
    offsetY.set(relativeY * strength * 2)
  }

  const handlePointerLeave = () => {
    offsetX.set(0)
    offsetY.set(0)
  }

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.span>
  )
}
