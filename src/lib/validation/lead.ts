import { z } from 'zod'

/**
 * The lead form is the site's conversion goal, so its schema is shared: the client
 * uses it for per-step gating, the Server Action re-validates the whole payload.
 * Never trust the client half — see .agents/03-architecture.md.
 *
 * The schema is a **factory** rather than a module constant because the messages are
 * localised. The client builds it from its dictionary; the action rebuilds it from the
 * locale submitted with the form. That keeps a single definition of what is valid
 * while letting the wording follow the page language.
 */
export const CAR_TYPES = ['sedan', 'suv', 'coupe', 'other'] as const
export type CarType = (typeof CAR_TYPES)[number]

export const LEAD_INTERESTS = [
  'paint',
  'interior',
  'ceramic',
  'scratches',
  'full',
  'advice',
] as const
export type LeadInterest = (typeof LEAD_INTERESTS)[number]

/** Exactly the `validation` slice of a dictionary, minus the form-level messages. */
export type LeadMessages = {
  carType: string
  interests: string
  name: string
  phone: string
  email: string
  consent: string
  /** Contains a `{max}` placeholder. */
  maxLength: string
}

/**
 * Polish mobile or landline, optionally with the +48 prefix and any mix of spaces,
 * dashes or parentheses. Nine significant digits.
 */
const PHONE_PATTERN = /^(?:\+?48)?[\s-]?(?:\d[\s\-()]?){9}$/

const NAME_MAX = 60
const CAR_MODEL_MAX = 80
const MESSAGE_MAX = 600

export function createLeadSchemas(messages: LeadMessages) {
  const tooLong = (max: number) => messages.maxLength.replace('{max}', String(max))

  /** Optional free text: an empty string means "not provided", not invalid. */
  const optionalText = (max: number) =>
    z
      .string()
      .trim()
      .max(max, { error: tooLong(max) })
      .optional()
      .transform((value) => (value ? value : undefined))

  const step1 = z.object({
    carType: z.enum(CAR_TYPES, { error: messages.carType }),
    carModel: optionalText(CAR_MODEL_MAX),
  })

  const step2 = z.object({
    interests: z.array(z.enum(LEAD_INTERESTS)).min(1, { error: messages.interests }),
  })

  const step3 = z.object({
    name: z
      .string()
      .trim()
      .min(2, { error: messages.name })
      .max(NAME_MAX, { error: tooLong(NAME_MAX) }),
    phone: z.string().trim().regex(PHONE_PATTERN, { error: messages.phone }),
    email: z
      .union([z.literal(''), z.email({ error: messages.email })])
      .optional()
      .transform((value) => (value ? value : undefined)),
    message: optionalText(MESSAGE_MAX),
    consent: z.literal(true, { error: messages.consent }),
  })

  return {
    step1,
    step2,
    step3,
    full: step1.extend(step2.shape).extend(step3.shape),
  }
}

export type LeadSchemas = ReturnType<typeof createLeadSchemas>

/** Validated, normalised lead — what the delivery layer receives. */
export type Lead = z.infer<LeadSchemas['full']>

export const LEAD_STEP_COUNT = 3

export type LeadFieldErrors = Partial<Record<keyof Lead, string[]>>

/**
 * Turn a Zod failure into the flat `field -> messages` map the form renders. Zod's own
 * flatten output is wider than our field union, hence the narrowing.
 */
export function toFieldErrors(error: z.ZodError<unknown>): LeadFieldErrors {
  return z.flattenError(error).fieldErrors as LeadFieldErrors
}
