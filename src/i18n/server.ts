import { notFound } from 'next/navigation'
import { locale as localeParam } from 'next/root-params'

import { isLocale, type Locale } from './config'
import { dictionaryFor, interpolate, type Dictionary } from './dictionaries'

/**
 * Reads the locale from the route's root parameter, so any Server Component can get
 * its copy without prop drilling.
 *
 * Server Components only — `next/root-params` is unavailable in Client Components,
 * Server Actions and Route Handlers. Keeping it in its own module means importing the
 * dictionaries from a Client Component does not pull this in.
 */
export async function getLocale(): Promise<Locale> {
  const value = await localeParam()
  if (!isLocale(value)) notFound()
  return value
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaryFor(await getLocale())
}

/** Re-exported so Server Components need only one i18n import. */
export const interpolateDictionary = interpolate
