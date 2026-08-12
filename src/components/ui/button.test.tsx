import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button, ButtonLink } from './button'

describe('Button', () => {
  it('renders an accessible button with its label', () => {
    render(<Button>Wyceń swój samochód</Button>)

    expect(screen.getByRole('button', { name: 'Wyceń swój samochód' })).toBeInTheDocument()
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Dalej</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('allows an explicit submit type', () => {
    render(<Button type="submit">Poproś o wycenę</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('calls the click handler', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Dalej</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire while disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Dalej
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies the accent styling for the primary variant', () => {
    render(<Button>Wyceń auto</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-accent')
  })

  it('lets a caller override a conflicting utility', () => {
    render(<Button className="h-20">Wyceń auto</Button>)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('h-20')
    expect(button).not.toHaveClass('h-12')
  })
})

describe('ButtonLink', () => {
  it('renders a link to the given anchor', () => {
    render(<ButtonLink href="#wycena">Zobacz realizacje</ButtonLink>)

    expect(screen.getByRole('link', { name: 'Zobacz realizacje' })).toHaveAttribute(
      'href',
      '#wycena',
    )
  })

  it('shares the variant styling with Button', () => {
    render(
      <ButtonLink href="#wycena" variant="secondary">
        Zobacz realizacje
      </ButtonLink>,
    )

    expect(screen.getByRole('link')).toHaveClass('border-line-strong')
  })
})
