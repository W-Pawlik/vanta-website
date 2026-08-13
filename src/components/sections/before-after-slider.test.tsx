import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { BeforeAfterSlider } from './before-after-slider'

const LABELS = {
  imageAlt: 'Makro wypolerowanego czarnego lakieru',
  beforeAlt: 'Lakier przed korektą',
  before: 'Przed',
  after: 'Po VANTA',
  slider: 'Porównanie przed i po',
  sliderValue: 'widoku „przed”',
}

/** Default: no real pair yet, so both sides point at the same file. */
const setup = () =>
  render(
    <BeforeAfterSlider
      beforeImage="/images/before-after-paint.jpg"
      afterImage="/images/before-after-paint.jpg"
      labels={LABELS}
    />,
  )

/** With two genuinely different photographs. */
const setupWithPair = () =>
  render(
    <BeforeAfterSlider
      beforeImage="/images/before.jpg"
      afterImage="/images/after.jpg"
      labels={LABELS}
    />,
  )

describe('BeforeAfterSlider', () => {
  it('starts centred', () => {
    setup()

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50')
  })

  it('exposes both labels so the comparison is readable without interaction', () => {
    setup()

    expect(screen.getByText('Przed')).toBeInTheDocument()
    expect(screen.getByText('Po VANTA')).toBeInTheDocument()
  })

  it('moves left and right with the arrow keys', async () => {
    setup()
    const slider = screen.getByRole('slider')

    slider.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(slider).toHaveAttribute('aria-valuenow', '52')

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(slider).toHaveAttribute('aria-valuenow', '48')
  })

  it('takes larger steps with PageUp and PageDown', async () => {
    setup()
    const slider = screen.getByRole('slider')

    slider.focus()
    await userEvent.keyboard('{PageUp}')

    expect(slider).toHaveAttribute('aria-valuenow', '60')
  })

  it('jumps to the ends with Home and End', async () => {
    setup()
    const slider = screen.getByRole('slider')

    slider.focus()
    await userEvent.keyboard('{End}')
    expect(slider).toHaveAttribute('aria-valuenow', '100')

    await userEvent.keyboard('{Home}')
    expect(slider).toHaveAttribute('aria-valuenow', '0')
  })

  it('never leaves the 0–100 range', async () => {
    setup()
    const slider = screen.getByRole('slider')

    slider.focus()
    await userEvent.keyboard('{Home}{ArrowLeft}{ArrowLeft}')
    expect(slider).toHaveAttribute('aria-valuenow', '0')

    await userEvent.keyboard('{End}{ArrowRight}{ArrowRight}')
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('treats the duplicated "before" as decorative while there is no real pair', () => {
    setup()

    // Exactly one announced photograph. The duplicate exists only to be filtered, so it
    // carries an empty alt — the same frame announced twice is noise.
    expect(screen.getByAltText(LABELS.imageAlt)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(1)
  })

  it('announces both photographs once a real pair is supplied', () => {
    setupWithPair()

    expect(screen.getByAltText(LABELS.imageAlt)).toBeInTheDocument()
    expect(screen.getByAltText(LABELS.beforeAlt)).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('drops the simulated degradation as soon as the images differ', () => {
    // The guard that matters: the CSS fake must not survive a real pair being dropped in.
    setupWithPair()

    const before = screen.getByAltText(LABELS.beforeAlt)

    expect(before.className).not.toMatch(/saturate-|brightness-|blur-/)
  })

  it('degrades the left half only in the fallback case', () => {
    setup()

    const [decorative] = screen.getAllByRole('presentation', { hidden: true })

    expect(decorative?.className).toMatch(/saturate-/)
  })

  /**
   * Regression guard for the touch path. The frame is a full-width band in the middle of
   * the page; it used to declare `touch-action: none` and preventDefault() every move, so
   * any finger that landed on the photograph was swallowed and the page could not be
   * scrolled past this section on a phone.
   */
  describe('pointer handling', () => {
    /**
     * jsdom has no layout, so the frame needs a width before a press maps to a position.
     * Stubbed on the prototype because the frame carries no role of its own — the press is
     * dispatched on the handle and reaches the frame by bubbling, which is also how a real
     * touch on the photograph arrives.
     */
    const giveTheFrameAWidth = () =>
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect)

    it('positions the separator where a mouse presses', async () => {
      setup()
      giveTheFrameAWidth()
      const slider = screen.getByRole('slider')

      await userEvent.pointer({
        target: slider,
        keys: '[MouseLeft>]',
        coords: { clientX: 300, clientY: 10 },
      })

      expect(slider).toHaveAttribute('aria-valuenow', '75')
    })

    it('ignores a touch until it moves, so a scroll gesture is not read as a drag', async () => {
      setup()
      giveTheFrameAWidth()
      const slider = screen.getByRole('slider')

      await userEvent.pointer({
        target: slider,
        keys: '[TouchA>]',
        coords: { clientX: 300, clientY: 10 },
      })

      expect(slider).toHaveAttribute('aria-valuenow', '50')
    })
  })
})
