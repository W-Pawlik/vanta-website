'use client'

import { motion } from 'motion/react'
import { useActionState, useState, type ReactNode } from 'react'

import { useLeadSelection } from '@/components/lead/lead-selection'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { DURATION, EASE } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils/cn'
import {
  CAR_TYPES,
  LEAD_INTERESTS,
  LEAD_STEP_COUNT,
  createLeadSchemas,
  toFieldErrors,
  type CarType,
  type LeadFieldErrors,
  type LeadInterest,
} from '@/lib/validation/lead'
import { INITIAL_LEAD_FORM_STATE } from '@/server/lead/lead-form-state'
import { submitLead } from '@/server/lead/submit-lead'
import { formatOrdinal } from '@/lib/utils/format'

type FormCopy = Dictionary['lead']['form']
type ValidationCopy = Dictionary['validation']

/**
 * Three-step configurator, not a wall of inputs.
 *
 * All three steps stay mounted in one grid cell, stacked. That gives three things at
 * once: the card height is the tallest step's height so it never jumps, every field is
 * present in the FormData the Server Action receives, and the form still submits
 * without JavaScript. Inactive steps get `inert`, so they are unreachable by keyboard
 * while still being submitted.
 *
 * Step 2 arrives pre-ticked when the visitor got here from a service drawer or a
 * package CTA — see LeadSelectionProvider. It does **not** skip step 1: the car type is
 * still required, and guessing it would be worse than asking.
 */
export function LeadForm({
  locale,
  copy,
  validation,
}: {
  locale: Locale
  copy: FormCopy
  validation: ValidationCopy
}) {
  const [state, formAction, isPending] = useActionState(submitLead, INITIAL_LEAD_FORM_STATE)
  const schemas = createLeadSchemas(validation)

  const { interests: preselected } = useLeadSelection()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [stepErrors, setStepErrors] = useState<LeadFieldErrors>({})

  const [carType, setCarType] = useState<CarType | ''>('')
  const [carModel, setCarModel] = useState('')
  const [interests, setInterests] = useState<LeadInterest[]>([...preselected])

  /**
   * Adjusting state during render — React's documented pattern for "reset when a prop
   * changes". `select()` hands back a new array each time, so identity comparison is
   * enough, and this avoids a setState-in-effect cascade.
   */
  const [seenSelection, setSeenSelection] = useState(preselected)
  if (seenSelection !== preselected) {
    setSeenSelection(preselected)
    setInterests([...preselected])
  }

  // Server-side field errors win: they are the authoritative validation result.
  const fieldErrors: LeadFieldErrors =
    state.status === 'error' && state.fieldErrors ? state.fieldErrors : stepErrors

  const goNext = () => {
    const result =
      step === 0
        ? schemas.step1.safeParse({ carType, carModel })
        : schemas.step2.safeParse({ interests })

    if (!result.success) {
      setStepErrors(toFieldErrors(result.error))
      return
    }

    setStepErrors({})
    setDirection(1)
    setStep((current) => Math.min(current + 1, LEAD_STEP_COUNT - 1))
  }

  const goBack = () => {
    setStepErrors({})
    setDirection(-1)
    setStep((current) => Math.max(current - 1, 0))
  }

  const toggleInterest = (value: LeadInterest) =>
    setInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )

  if (state.status === 'success') {
    return <SuccessPanel copy={copy} />
  }

  return (
    <div className="rounded-panel border border-line bg-surface-raised p-7 sm:p-10">
      <div className="flex items-center gap-4">
        <p className="font-mono text-label text-content-tertiary">
          <span className="text-accent">{formatOrdinal(step + 1)}</span>
          <span aria-hidden="true"> / </span>
          {formatOrdinal(LEAD_STEP_COUNT)}
        </p>
        <div
          className="h-px flex-1 bg-line-strong"
          role="progressbar"
          aria-label={copy.progressLabel}
          aria-valuemin={1}
          aria-valuemax={LEAD_STEP_COUNT}
          aria-valuenow={step + 1}
        >
          <motion.span
            className="block h-px bg-accent"
            initial={false}
            animate={{ width: `${((step + 1) / LEAD_STEP_COUNT) * 100}%` }}
            transition={{ duration: DURATION.base, ease: EASE.outQuart }}
          />
        </div>
      </div>

      <form action={formAction} className="mt-10">
        {/* The action cannot read root params, so the locale travels with the payload
            and is validated server-side before it selects a dictionary. */}
        <input type="hidden" name="locale" value={locale} />

        <div className="grid">
          <StepPanel active={step === 0} direction={direction}>
            <fieldset>
              <legend className="font-display text-display-card text-content uppercase">
                {copy.step1}
              </legend>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {CAR_TYPES.map((value) => (
                  <OptionTile
                    key={value}
                    type="radio"
                    name="carType"
                    value={value}
                    label={copy.carTypes[value]}
                    checked={carType === value}
                    onChange={() => setCarType(value)}
                  />
                ))}
              </div>
              <FieldError id="blad-carType" messages={fieldErrors.carType} />
            </fieldset>

            <label className="mt-8 block">
              <span className="font-mono text-label text-content-tertiary uppercase">
                {copy.carModel}
              </span>
              <input
                name="carModel"
                value={carModel}
                onChange={(event) => setCarModel(event.target.value)}
                placeholder={copy.carModelPlaceholder}
                className="mt-3 h-13 w-full rounded-control border border-line bg-canvas px-4 text-body text-content placeholder:text-content-tertiary"
              />
            </label>
          </StepPanel>

          <StepPanel active={step === 1} direction={direction}>
            <fieldset>
              <legend className="font-display text-display-card text-content uppercase">
                {copy.step2}
              </legend>
              <p className="mt-3 text-body-sm text-content-secondary">{copy.step2Hint}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {LEAD_INTERESTS.map((value) => (
                  <OptionTile
                    key={value}
                    type="checkbox"
                    name="interests"
                    value={value}
                    label={copy.interests[value]}
                    checked={interests.includes(value)}
                    onChange={() => toggleInterest(value)}
                  />
                ))}
              </div>
              <FieldError id="blad-interests" messages={fieldErrors.interests} />
            </fieldset>
          </StepPanel>

          <StepPanel active={step === 2} direction={direction}>
            <fieldset>
              <legend className="font-display text-display-card text-content uppercase">
                {copy.step3}
              </legend>

              <div className="mt-8 space-y-5">
                <TextField
                  name="name"
                  label={copy.name}
                  autoComplete="given-name"
                  required
                  errors={fieldErrors.name}
                />
                <TextField
                  name="phone"
                  label={copy.phone}
                  type="tel"
                  autoComplete="tel"
                  required
                  errors={fieldErrors.phone}
                />
                <TextField
                  name="email"
                  label={copy.email}
                  type="email"
                  autoComplete="email"
                  errors={fieldErrors.email}
                />

                <label className="flex items-start gap-3 text-body-sm text-content-secondary">
                  <input
                    type="checkbox"
                    name="consent"
                    className="mt-1 size-4 shrink-0 accent-accent"
                    aria-describedby={fieldErrors.consent ? 'blad-consent' : undefined}
                  />
                  <span>{copy.consent}</span>
                </label>
                <FieldError id="blad-consent" messages={fieldErrors.consent} />
              </div>
            </fieldset>
          </StepPanel>
        </div>

        {state.status === 'error' && (
          <p role="alert" className="mt-8 text-body-sm text-danger">
            {state.message}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          {step > 0 ? (
            <Button variant="quiet" onClick={goBack}>
              <span aria-hidden="true">←</span> {copy.back}
            </Button>
          ) : (
            <span />
          )}

          {step < LEAD_STEP_COUNT - 1 ? (
            <Button size="lg" onClick={goNext}>
              {copy.next} <span aria-hidden="true">→</span>
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? copy.submitting : copy.submit} <span aria-hidden="true">→</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

/**
 * One step of the form. Every panel occupies the same grid cell, so the card is always
 * as tall as the tallest step and cannot jump between steps.
 */
function StepPanel({
  active,
  direction,
  children,
}: {
  active: boolean
  direction: 1 | -1
  children: ReactNode
}) {
  return (
    <motion.div
      className="col-start-1 row-start-1"
      initial={false}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 30 * direction * -1 }}
      transition={{ duration: DURATION.base, ease: EASE.outQuart }}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </motion.div>
  )
}

function OptionTile({
  type,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  type: 'radio' | 'checkbox'
  name: string
  value: string
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={cn(
        'flex min-h-18 cursor-pointer items-center rounded-control border px-5 text-body transition-colors duration-[var(--duration-fast)]',
        checked
          ? 'border-accent bg-accent/10 text-content'
          : 'border-line bg-canvas text-content-secondary hover:border-line-strong hover:text-content',
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  )
}

function TextField({
  name,
  label,
  type = 'text',
  autoComplete,
  required,
  errors,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
  required?: boolean
  errors?: string[]
}) {
  const errorId = `blad-${name}`

  return (
    <div>
      <label htmlFor={name} className="font-mono text-label text-content-tertiary uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errors ? errorId : undefined}
        className={cn(
          'mt-3 h-13 w-full rounded-control border bg-canvas px-4 text-body text-content placeholder:text-content-tertiary',
          errors ? 'border-danger' : 'border-line',
        )}
      />
      <FieldError id={errorId} messages={errors} />
    </div>
  )
}

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null

  return (
    <p id={id} className="mt-3 text-body-sm text-danger" aria-live="polite">
      {messages[0]}
    </p>
  )
}

/** The card becomes the confirmation — not a generic "form submitted" line. */
function SuccessPanel({ copy }: { copy: FormCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE.outExpo }}
      className="flex min-h-100 flex-col items-start justify-center rounded-panel border border-line bg-surface-raised p-7 sm:p-10"
      role="status"
    >
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full bg-accent text-display-card text-accent-contrast"
      >
        ✓
      </span>
      <h3 className="mt-8 max-w-[24ch] font-display text-display-card text-content uppercase">
        {copy.successTitle}
      </h3>
      <p className="mt-4 max-w-measure text-body text-content-secondary">{copy.successBody}</p>
    </motion.div>
  )
}
