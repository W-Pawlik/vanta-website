import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { BeforeAfterSlider } from './before-after-slider'

const setup = () =>
  render(
    <BeforeAfterSlider
      image="/images/before-after-paint.jpg"
      labels={{
        imageAlt: 'Makro wypolerowanego czarnego lakieru',
        before: 'Przed',
        after: 'Po VANTA',
        slider: 'Porównanie przed i po',
        sliderValue: 'widoku „przed”',
      }}
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

  it('renders the dulled "before" copy as decorative, not as a second photo', () => {
    setup()

    // Exactly one announced photograph. The dulled duplicate exists only to be
    // filtered, so it carries an empty alt — which is why it surfaces as
    // `presentation` rather than as a second image.
    expect(screen.getByAltText('Makro wypolerowanego czarnego lakieru')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(1)
  })
})
