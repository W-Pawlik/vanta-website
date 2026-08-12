import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Overlay } from './overlay'

/**
 * A harness that mirrors the real situation: the overlay is rendered *inside* a section
 * that owns a stacking context, and it is opened from a button in that section.
 */
function Harness() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <nav>
        <a href="#somewhere">Nav link</a>
      </nav>

      <section className="isolate">
        <button type="button" onClick={() => setOpen(true)}>
          Open
        </button>

        <Overlay open={open} onClose={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Panel">
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
            <a href="#inside">Inside link</a>
          </div>
        </Overlay>
      </section>
    </div>
  )
}

describe('Overlay', () => {
  it('renders nothing while closed', () => {
    render(<Harness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('escapes the section it is nested in and mounts on document.body', async () => {
    // The whole point. Sections carry `isolate`, so an overlay left inside one is
    // trapped in that stacking context and paints below the fixed navbar — which is how
    // the navbar ended up covering the drawer's close button.
    const { container } = render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    const dialog = screen.getByRole('dialog')

    expect(dialog).toBeInTheDocument()
    // Asserting on the DOM position IS the point of this test, and no Testing Library
    // query can express "is not inside this subtree".
    // eslint-disable-next-line testing-library/no-container
    expect(container.contains(dialog)).toBe(false)
    expect(document.body.contains(dialog)).toBe(true)
  })

  it('closes on Escape', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.keyboard('{Escape}')

    // AnimatePresence holds the node until the exit animation finishes.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes when the backdrop is clicked', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    // The dialog's parent is the backdrop.
    // eslint-disable-next-line testing-library/no-node-access
    const backdrop = screen.getByRole('dialog').parentElement!

    await userEvent.click(backdrop)

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('keeps Tab inside the panel, so the navigation behind it stays unreachable', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    const close = screen.getByRole('button', { name: 'Close' })
    const inside = screen.getByRole('link', { name: 'Inside link' })

    close.focus()
    await userEvent.tab()
    expect(inside).toHaveFocus()

    // From the last focusable, Tab wraps to the first instead of reaching the nav link.
    await userEvent.tab()
    expect(close).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Nav link' })).not.toHaveFocus()
  })

  it('wraps backwards from the first focusable too', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    screen.getByRole('button', { name: 'Close' }).focus()
    await userEvent.tab({ shift: true })

    expect(screen.getByRole('link', { name: 'Inside link' })).toHaveFocus()
  })

  it('locks page scrolling while open and releases it on close', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(document.body.style.overflow).toBe('hidden')

    await userEvent.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('returns focus to whatever opened it', async () => {
    render(<Harness />)

    const trigger = screen.getByRole('button', { name: 'Open' })
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
  })
})
