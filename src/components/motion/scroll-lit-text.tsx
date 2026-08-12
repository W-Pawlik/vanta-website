'use client'

import { useEffect, useRef } from 'react'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { loadGsap } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils/cn'

type ScrollLitTextProps = {
  /** One entry per visual line. Words inside a line are lit one after another. */
  lines: readonly string[]
  as?: 'h2' | 'p'
  className?: string
}

/**
 * Text that lights up word by word as it passes the viewport: `content-dim` at
 * rest, `content` when lit. This is the effect that justifies the amount of empty
 * space around the manifesto — statically that section reads as unfinished.
 *
 * Word-level, not letter-level: letters would be gimmicky and would wreck the
 * text for screen readers. Every word stays real text in the DOM.
 *
 * Under reduced motion the text simply renders fully lit.
 */
export function ScrollLitText({ lines, as: Tag = 'h2', className }: ScrollLitTextProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  /**
   * GSAP arrives asynchronously (see `loadGsap`), so this cannot use `useGSAP()` — that
   * hook imports GSAP at module scope, which is exactly what keeps it on the critical
   * path. `gsap.context()` gives the same scoping and the same one-call cleanup, and the
   * `cancelled` flag covers an unmount that happens while the download is still in flight.
   *
   * Under reduced motion GSAP is never requested at all: the words render fully lit, so
   * there is nothing to animate and nothing to download.
   */
  useEffect(() => {
    const root = rootRef.current
    if (reduceMotion || !root) return

    const words = root.querySelectorAll('[data-word]')
    if (words.length === 0) return

    let cancelled = false
    let revert: (() => void) | undefined

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return

      const context = gsap.context(() => {
        gsap.fromTo(
          words,
          { color: 'var(--color-content-dim)' },
          {
            color: 'var(--color-content)',
            ease: 'none',
            stagger: 1,
            scrollTrigger: {
              trigger: root,
              // Starts once the block is comfortably in view and finishes before it
              // leaves, so the reader never scrolls past unlit words.
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        )
      }, root)

      revert = () => context.revert()
    })

    return () => {
      cancelled = true
      revert?.()
    }
  }, [reduceMotion])

  return (
    <div ref={rootRef}>
      <Tag className={cn('font-display text-display-statement uppercase', className)}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line.split(' ').map((word, index) => (
              <span
                // Words repeat within a line, so the index has to be part of the key.
                key={`${word}-${index}`}
                data-word
                className={cn('inline-block', reduceMotion ? 'text-content' : 'text-content-dim')}
              >
                {word}
                {/* A real space, so the text still reads correctly when copied. */}
                {index < line.split(' ').length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ))}
      </Tag>
    </div>
  )
}
