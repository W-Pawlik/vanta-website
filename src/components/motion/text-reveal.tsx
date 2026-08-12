'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { STAGGER, VIEWPORT } from '@/lib/motion/tokens'
import { maskRow, staggerContainer } from '@/lib/motion/variants'
import { cn } from '@/lib/utils/cn'

const MOTION_TAG = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const

type TextRevealProps = {
  /**
   * One entry per visual line. Lines are authored explicitly rather than split
   * automatically, because where a headline breaks is a design decision.
   */
  lines: readonly string[]
  as?: keyof typeof MOTION_TAG
  /** Play as soon as the element mounts (hero) instead of on scroll. */
  immediate?: boolean
  delay?: number
  stagger?: number
  className?: string
  lineClassName?: string
}

/**
 * Headline that slides out line by line from behind a mask.
 *
 * Accessibility: the visible text is the real text — the mask is a wrapper, not a
 * replacement — so screen readers and search engines see the full headline even
 * before the animation runs.
 */
export function TextReveal({
  lines,
  as = 'h2',
  immediate = false,
  delay = 0,
  stagger = STAGGER.tight,
  className,
  lineClassName,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion()
  const Tag = MOTION_TAG[as]

  const animation = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: VIEWPORT }

  return (
    <Tag
      className={className}
      variants={staggerContainer({ stagger, delayChildren: delay })}
      initial="hidden"
      {...animation}
    >
      {lines.map((line) => (
        <span key={line} className="mask-row">
          <motion.span className={cn('block', lineClassName)} variants={maskRow({ reduceMotion })}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
