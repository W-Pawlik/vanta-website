'use client'

import Image, { type ImageProps } from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { PARALLAX_RANGE } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils/cn'

type ParallaxImageProps = Omit<ImageProps, 'className' | 'fill'> & {
  /** Total vertical travel in pixels, split evenly around the resting position. */
  range?: number
  /** Classes for the clipping frame — set the aspect ratio and radius here. */
  className?: string
  imageClassName?: string
}

/**
 * Image that drifts slightly against the scroll direction. The frame clips, the
 * inner layer is oversized by the travel distance so no gap can appear.
 *
 * Keep `range` small. The brief caps this effect at "almost subconscious".
 */
export function ParallaxImage({
  range = PARALLAX_RANGE,
  className,
  imageClassName,
  // Destructured rather than spread so the a11y lint rule can see it. Every
  // photograph on this site needs a real alt; decorative ones pass "".
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [range, -range])

  return (
    <div ref={frameRef} className={cn('relative overflow-hidden', className)}>
      <motion.div
        style={{ y, top: -range, height: `calc(100% + ${range * 2}px)` }}
        className="absolute inset-x-0"
      >
        <Image {...imageProps} alt={alt} fill className={cn('object-cover', imageClassName)} />
      </motion.div>
    </div>
  )
}
