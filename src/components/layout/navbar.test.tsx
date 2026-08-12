import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { dictionaryFor } from '@/i18n/dictionaries'

import { Navbar } from './navbar'

const pathname = vi.hoisted(() => ({ current: '/pl' }))

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

const dict = dictionaryFor('pl')

const setup = () => render(<Navbar locale="pl" dict={dict} />)

describe('Navbar', () => {
  /**
   * Regression guard. The logo links to the page it is already on, so the router treats
   * the click as a no-op — without the explicit scroll nothing happens and the reader is
   * left where they were.
   */
  it('takes the reader back to the top when the logo is clicked on the home page', async () => {
    pathname.current = '/pl'
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    setup()

    await userEvent.click(screen.getByRole('link', { name: dict.common.home }))

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 })
  })

  /** On another route the click is a real navigation, and the router scrolls for us. */
  it('leaves scrolling to the router when the logo navigates away', async () => {
    pathname.current = '/pl/system'
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    setup()

    await userEvent.click(screen.getByRole('link', { name: dict.common.home }))

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('points the logo at the locale root', () => {
    pathname.current = '/pl'
    setup()

    expect(screen.getByRole('link', { name: dict.common.home })).toHaveAttribute('href', '/pl')
  })
})
