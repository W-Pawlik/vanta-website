import 'server-only'

import type { Lead } from '@/lib/validation/lead'

/**
 * The one side effect the backend has: getting a validated lead to the studio.
 *
 * Kept behind this seam so the Server Action never knows how delivery happens.
 * Swapping the log sink for an e-mail provider is a change to this file only.
 *
 * Until `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` are configured, leads are
 * logged server-side. That keeps the form's full success path exercisable without
 * credentials, and makes the missing configuration visible in the logs rather
 * than silently dropping a lead.
 */
export async function deliverLead(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.LEAD_NOTIFICATION_EMAIL

  if (!apiKey || !recipient) {
    console.warn('[lead] delivery not configured — logging instead', describeLead(lead))
    return
  }

  // TODO: send the notification e-mail. Tracked in .agents/decisions/0002-lead-delivery.md.
  console.warn('[lead] provider not implemented yet — logging instead', describeLead(lead))
  await Promise.resolve()
}

/** Log-safe summary: no free-text message, phone truncated. */
function describeLead(lead: Lead) {
  return {
    carType: lead.carType,
    carModel: lead.carModel,
    interests: lead.interests,
    name: lead.name,
    phone: `${lead.phone.slice(0, 3)}…`,
    hasEmail: Boolean(lead.email),
  }
}
