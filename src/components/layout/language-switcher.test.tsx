import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { LanguageSwitcher } from './language-switcher'

vi.mock('next/navigation', () => ({ usePathname: () => '/pl' }))

/**
 * Captures the props the router link is given. `scroll` has no DOM representation, so
 * the only way to assert it is at the component boundary. Everything else is forwarded
 * to a real anchor, so the accessibility assertions still see the markup they would in
 * the browser.
 */
const linkProps = vi.hoisted(() => [] as { href: string; scroll?: boolean }[])

vi.mock('next/link', () => ({
  default: ({ children, href, scroll, ...rest }: MockLinkProps) => {
    linkProps.push({ href, scroll })
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  },
}))

type MockLinkProps = ComponentProps<'a'> & { href: string; scroll?: boolean }

const setup = () => render(<LanguageSwitcher current="pl" label="Zmień język" />)

describe('LanguageSwitcher', () => {
  it('offers every locale and marks the active one', () => {
    setup()

    expect(screen.getByRole('link', { name: 'Polski' })).toHaveAttribute('href', '/pl')
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en')
    expect(screen.getByRole('link', { name: 'Polski' })).toHaveAttribute('aria-current', 'true')
  })

  /**
   * Regression guard. The router keeps scroll position only while the Page element is
   * still visible, and jumps to the top of it otherwise — so switching language halfway
   * down the page threw the reader back to the hero. Dropping `scroll={false}` brings
   * that back.
   */
  it('does not let the router move the reader when the language changes', () => {
    linkProps.length = 0
    setup()

    expect(linkProps).toHaveLength(2)
    for (const props of linkProps) {
      expect(props.scroll).toBe(false)
    }
  })
})
