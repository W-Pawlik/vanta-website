'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { STAGGER, VIEWPORT } from '@/lib/motion/tokens'
import { fadeUp, staggerContainer } from '@/lib/motion/variants'

type RevealProps = {
  children: ReactNode
  /** Seconds. Use sparingly — prefer RevealGroup for sequencing siblings. */
  delay?: number
  className?: string
}

/**
 * The default scroll entrance: fade with a short lift, once, when the element is
 * a third visible. Wrap content in this instead of hand-writing `whileInView`.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={fadeUp({ reduceMotion, delay })}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupProps = {
  children: ReactNode
  stagger?: number
  delayChildren?: number
  className?: string
}

/**
 * Parent for a staggered sequence. Children must be `RevealItem` (or any
 * `motion` element with `hidden`/`visible` variants) and must **not** declare
 * their own `whileInView` — the group drives them.
 */
export function RevealGroup({
  children,
  stagger = STAGGER.base,
  delayChildren = 0,
  className,
}: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer({ stagger, delayChildren })}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}

/** One element in a RevealGroup. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div className={className} variants={fadeUp({ reduceMotion })}>
      {children}
    </motion.div>
  )
}
