import type { LeadFieldErrors } from '@/lib/validation/lead'

/**
 * State shared between the Server Action and `useActionState` in the form.
 *
 * It lives outside submit-lead.ts because every export of a `'use server'` module must
 * be an async function — constants would be a build error there.
 *
 * Messages are carried in the state rather than imported as constants: they are
 * localised, and the action is the only place that knows the submitted locale.
 */
export type LeadFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: LeadFieldErrors }

export const INITIAL_LEAD_FORM_STATE: LeadFormState = { status: 'idle' }
