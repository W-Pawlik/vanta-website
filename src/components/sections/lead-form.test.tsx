import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// The real action pulls in `server-only`, which throws outside a server runtime.
// The step-gating logic under test lives entirely on the client.
vi.mock('@/server/lead/submit-lead', () => ({
  submitLead: vi.fn(async () => ({ status: 'idle' as const })),
}))

import { LeadSelectionProvider } from '@/components/lead/lead-selection'
import { dictionaryFor } from '@/i18n/dictionaries'

import { LeadForm } from './lead-form'

const pl = dictionaryFor('pl')

const setup = () =>
  render(
    <LeadSelectionProvider>
      <LeadForm locale="pl" copy={pl.lead.form} validation={pl.validation} />
    </LeadSelectionProvider>,
  )

const step = () => Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'))

const clickNext = () => userEvent.click(screen.getByRole('button', { name: pl.lead.form.next }))

const goToStep2 = async () => {
  await userEvent.click(screen.getByRole('radio', { name: pl.lead.form.carTypes.suv }))
  await clickNext()
}

describe('LeadForm progress', () => {
  it('opens on the first of three steps', () => {
    setup()

    expect(step()).toBe(1)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '3')
  })

  it('refuses to advance until a car type is chosen', async () => {
    setup()

    await clickNext()

    expect(step()).toBe(1)
    expect(screen.getByText(pl.validation.carType)).toBeInTheDocument()
  })

  it('advances once a car type is chosen', async () => {
    setup()

    await goToStep2()

    expect(step()).toBe(2)
  })

  it('clears the step error after a valid choice', async () => {
    setup()

    await clickNext()
    await goToStep2()

    expect(screen.queryByText(pl.validation.carType)).not.toBeInTheDocument()
  })

  it('requires at least one interest on step 2', async () => {
    setup()

    await goToStep2()
    await clickNext()

    expect(step()).toBe(2)
    expect(screen.getByText(pl.validation.interests)).toBeInTheDocument()
  })

  it('reaches the contact step and swaps in the submit button', async () => {
    setup()

    await goToStep2()
    await userEvent.click(screen.getByRole('checkbox', { name: pl.lead.form.interests.ceramic }))
    await clickNext()

    expect(step()).toBe(3)
    expect(screen.getByRole('button', { name: pl.lead.form.submit })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: pl.lead.form.next })).not.toBeInTheDocument()
  })

  it('goes back without losing the earlier answer', async () => {
    setup()

    await goToStep2()
    await userEvent.click(screen.getByRole('button', { name: new RegExp(pl.lead.form.back) }))

    expect(step()).toBe(1)
    expect(screen.getByRole('radio', { name: pl.lead.form.carTypes.suv })).toBeChecked()
  })

  it('lets several interests be selected at once', async () => {
    setup()

    await goToStep2()
    await userEvent.click(screen.getByRole('checkbox', { name: pl.lead.form.interests.paint }))
    await userEvent.click(screen.getByRole('checkbox', { name: pl.lead.form.interests.ceramic }))

    expect(screen.getByRole('checkbox', { name: pl.lead.form.interests.paint })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: pl.lead.form.interests.ceramic })).toBeChecked()
  })

  it('keeps every step in the DOM so the form still submits without JavaScript', () => {
    setup()

    // Progressive enhancement: fields from steps the visitor has not reached yet are
    // present (and inert), which is what makes the no-JS submit path work.
    expect(screen.getByLabelText(pl.lead.form.name)).toBeInTheDocument()
    expect(screen.getByLabelText(pl.lead.form.phone)).toBeInTheDocument()
  })

  it('submits the locale so the action can localise its own errors', () => {
    const { container } = setup()

    // A hidden input has neither a role nor a label, so there is no Testing Library
    // query for it. The contract is worth a test: without this field the Server Action
    // falls back to Polish and an English visitor gets Polish error messages.
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('input[name="locale"]')).toHaveValue('pl')
  })
})

describe('LeadForm preselection', () => {
  it('starts with nothing ticked when the visitor came straight to the form', async () => {
    setup()

    await goToStep2()

    for (const key of ['paint', 'ceramic', 'interior'] as const) {
      expect(screen.getByRole('checkbox', { name: pl.lead.form.interests[key] })).not.toBeChecked()
    }
  })

  it('renders in English when given the English dictionary', () => {
    const en = dictionaryFor('en')

    render(
      <LeadSelectionProvider>
        <LeadForm locale="en" copy={en.lead.form} validation={en.validation} />
      </LeadSelectionProvider>,
    )

    expect(screen.getByText(en.lead.form.step1)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.lead.form.next })).toBeInTheDocument()
  })
})
