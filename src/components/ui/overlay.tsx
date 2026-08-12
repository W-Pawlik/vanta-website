'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { DURATION, EASE } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils/cn'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type OverlayProps = {
  open: boolean
  onClose: () => void
  /** Extra classes for the backdrop — usually just how the panel is aligned. */
  className?: string
  children: ReactNode
}

/**
 * Backdrop + portal for anything modal (the service drawer, the gallery lightbox).
 *
 * **It renders into `document.body`, and that is the whole point.** Sections carry
 * `isolate`, which creates a stacking context so a parallax or pinned child cannot
 * paint over its neighbours. The side effect is that a `z-100` overlay nested inside a
 * section is only z-100 *within that section* — the entire section still sits below the
 * `z-50` navbar. So the navbar covered the drawer's close button, stayed clickable, and
 * a click on a nav anchor scrolled the page while the overlay kept the scroll locked.
 * Portalling to the body puts the overlay in the same stacking context as the navbar,
 * where its z-index actually wins.
 *
 * Also handles what every modal owes the user, in one place instead of two:
 * scroll lock, Escape, click-outside, and a focus trap so Tab cannot wander onto the
 * navigation behind the backdrop.
 */
export function Overlay({ open, onClose, className, children }: OverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useLockBodyScroll(open)

  /**
   * Remember where focus came from and hand it back on close.
   *
   * Captured in an effect, not during render — and this runs before the caller's own
   * autofocus effect, because React flushes child effects before parent ones and the
   * overlay is always the child.
   */
  useEffect(() => {
    if (!open) return

    restoreFocusRef.current = document.activeElement as HTMLElement | null

    return () => {
      restoreFocusRef.current?.focus()
      restoreFocusRef.current = null
    }
  }, [open])

  const focusables = useCallback(
    () => Array.from(backdropRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    [],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      // Focus trap. Without it Tab reaches the navbar links behind the backdrop, which
      // is how the page could be navigated while the overlay was still open.
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return

      const active = document.activeElement

      if (event.shiftKey && (active === first || !backdropRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, focusables])

  // Nothing to portal into during SSR. The overlay starts closed, so the server and the
  // first client render agree on rendering nothing.
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE.outQuart }}
          onClick={onClose}
          className={cn(
            // z-100 beats the navbar's z-50 — but only because this is portalled out of
            // the section's stacking context.
            'fixed inset-0 z-100 flex bg-canvas-deep/70 backdrop-blur-[3px]',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
