'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { formatOrdinal } from '@/lib/utils/format'

export type TimelineStep = { title: string; description: string }

/**
 * The process rail, driven by scroll position.
 *
 * A static timeline is pure decoration; the point of this section is that the process
 * moves forward, so the accent bar fills from the left and each step activates in
 * turn. Under reduced motion everything renders in its active state.
 */
export function ProcessTimeline({ steps }: { steps: readonly TimelineStep[] }) {
  const railRef = useRef<HTMLOListElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 80%', 'end 60%'],
  })

  const fillWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-x-0 top-[3.75rem] hidden h-px lg:block">
        <div className="h-px w-full bg-line-invert" />
        {reduceMotion ? (
          <div className="-mt-px h-px w-full bg-accent" />
        ) : (
          <motion.div style={{ width: fillWidth }} className="-mt-px h-px bg-accent" />
        )}
      </div>

      <ol ref={railRef} className="relative grid grid-cols-12 gap-y-14 lg:gap-x-6">
        {steps.map((step, index) => (
          <Step
            key={step.title}
            step={step}
            index={index}
            total={steps.length}
            progress={scrollYProgress}
            reduceMotion={reduceMotion}
          />
        ))}
      </ol>
    </div>
  )
}

function Step({
  step,
  index,
  total,
  progress,
  reduceMotion,
}: {
  step: TimelineStep
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduceMotion: boolean
}) {
  // Each dot lights when the fill reaches its position along the rail.
  const threshold = index / Math.max(total - 1, 1)
  const activeRange: [number, number] = [Math.max(threshold - 0.04, 0), threshold + 0.02]

  const dotScale = useTransform(progress, activeRange, [0.8, 1])
  const dotOpacity = useTransform(progress, activeRange, [0, 1])
  const titleOpacity = useTransform(progress, activeRange, [0.42, 1])

  return (
    <li className="col-span-12 sm:col-span-6 lg:col-span-3">
      <p className="font-mono text-label text-content-invert-tertiary">
        {formatOrdinal(index + 1)}
      </p>

      <div aria-hidden="true" className="relative mt-8 h-2.5">
        <span className="absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full bg-content-invert" />
        {!reduceMotion && (
          <motion.span
            style={{ scale: dotScale, opacity: dotOpacity }}
            className="absolute top-1/2 left-0 size-2.5 -translate-y-1/2 rounded-full bg-accent ring-3 ring-canvas-invert"
          />
        )}
      </div>

      <motion.h3
        style={reduceMotion ? undefined : { opacity: titleOpacity }}
        className="mt-8 font-display text-display-card text-content-invert uppercase"
      >
        {step.title}
      </motion.h3>
      <p className="mt-3 max-w-[30ch] text-body text-content-invert-secondary">
        {step.description}
      </p>
    </li>
  )
}
