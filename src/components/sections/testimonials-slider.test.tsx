import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TestimonialsSlider, type Review } from './testimonials-slider'

const LABELS = {
  previous: 'Poprzednia opinia',
  next: 'Następna opinia',
  rating: 'Ocena {value} z 5',
}

const ITEMS: readonly Review[] = [
  { quote: 'Lakier wygląda lepiej niż w salonie.', author: 'Michał K.', car: 'BMW M4 / Ceramic' },
  {
    quote: 'Konkretna wycena, zero naciągania.',
    author: 'Adrian W.',
    car: 'Audi RS3 / Full Detail',
  },
  { quote: 'Pierwszy detailing z widoczną różnicą.', author: 'Mateusz P.', car: 'Porsche 911' },
]

const setup = () => render(<TestimonialsSlider items={ITEMS} labels={LABELS} />)

const slides = () => screen.getAllByRole('listitem', { hidden: true })

/**
 * The slide a reader is actually on — the others stay in the document but inert.
 * Asserted through the attribute rather than the `inert` property: jsdom renders the
 * attribute but does not implement the reflected property, which reads as `undefined`.
 */
const activeQuote = () => {
  const active = slides().find((slide) => !slide.hasAttribute('inert'))
  if (!active) return undefined

  return ITEMS.find((item) => within(active).queryByText(`„${item.quote}”`) !== null)
}

describe('TestimonialsSlider', () => {
  /**
   * Guards the property the section is built around: every quote is in the DOM on every
   * slide, so crawlers and screen readers see all three and the track keeps the height of
   * the tallest one. Rendering only the active quote made the arrows jump between slides.
   */
  it('renders every quote, not just the active one', () => {
    setup()

    for (const item of ITEMS) {
      expect(screen.getByText(`„${item.quote}”`)).toBeInTheDocument()
      expect(screen.getByText(item.author)).toBeInTheDocument()
    }
  })

  it('exposes only the active slide to assistive technology', () => {
    setup()

    expect(slides()).toHaveLength(ITEMS.length)
    expect(slides().filter((slide) => !slide.hasAttribute('inert'))).toHaveLength(1)
    expect(activeQuote()).toBe(ITEMS[0])
  })

  it('moves forward and back through the reviews', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: LABELS.next }))
    expect(activeQuote()).toBe(ITEMS[1])

    await userEvent.click(screen.getByRole('button', { name: LABELS.previous }))
    expect(activeQuote()).toBe(ITEMS[0])
  })

  it('wraps around in both directions rather than dead-ending', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: LABELS.previous }))
    expect(activeQuote()).toBe(ITEMS[2])

    await userEvent.click(screen.getByRole('button', { name: LABELS.next }))
    expect(activeQuote()).toBe(ITEMS[0])
  })

  it('counts the current review for readers who cannot see the position', async () => {
    setup()

    // `formatOrdinal` zero-pads, so the counter reads `01 / 03`.
    expect(screen.getByText('01')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: LABELS.next }))
    expect(screen.getByText('02')).toBeInTheDocument()
  })
})
