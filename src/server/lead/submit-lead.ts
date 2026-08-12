'use server'

import { defaultLocale, isLocale } from '@/i18n/config'
import { dictionaryFor } from '@/i18n/dictionaries'
import { createLeadSchemas, toFieldErrors } from '@/lib/validation/lead'

import { deliverLead } from './lead-delivery'
import type { LeadFormState } from './lead-form-state'

/**
 * A Server Action is a public POST endpoint: the client-side validation in the form is
 * for UX only, and everything is re-validated here.
 *
 * The locale arrives as a hidden field. `next/root-params` is unavailable in Server
 * Actions, so this is the explicit alternative — and it is validated like any other
 * untrusted input before it selects a dictionary.
 *
 * Signature matches `useActionState` — previous state first, FormData second.
 */
export async function submitLead(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const submitted = formData.get('locale')
  const candidate = typeof submitted === 'string' ? submitted : undefined
  const locale = isLocale(candidate) ? candidate : defaultLocale
  const dict = dictionaryFor(locale)

  const { full } = createLeadSchemas(dict.validation)

  const parsed = full.safeParse({
    carType: formData.get('carType') ?? undefined,
    carModel: formData.get('carModel') ?? undefined,
    interests: formData.getAll('interests'),
    name: formData.get('name') ?? undefined,
    phone: formData.get('phone') ?? undefined,
    email: formData.get('email') ?? undefined,
    message: formData.get('message') ?? undefined,
    // An unchecked checkbox is simply absent from FormData.
    consent: formData.has('consent'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: dict.validation.formInvalid,
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  try {
    await deliverLead(parsed.data)
  } catch (error) {
    // The user gets a retry path; the detail stays in the server logs.
    console.error('[lead] delivery failed', error)
    return { status: 'error', message: dict.validation.deliveryFailed }
  }

  return { status: 'success' }
}
