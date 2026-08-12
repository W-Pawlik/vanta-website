import { isLocale, type Locale } from './config'
import { en } from './dictionaries/en'
import { pl } from './dictionaries/pl'

/**
 * The dictionary shape is derived from the Polish copy, which makes `pl.ts` the single
 * source of truth: adding a key there without adding it to `en.ts` breaks the build
 * rather than shipping an untranslated string.
 *
 * This module is deliberately free of Next.js imports so Client Components can use it.
 * The locale-aware helpers live in `./server`, which is server-only — a module-level
 * `next/root-params` import here would poison every client bundle that touches copy.
 */
export type Dictionary = typeof pl

const dictionaries: Record<Locale, Dictionary> = { pl, en }

/** Synchronous lookup, for anything that already knows its locale. */
export function dictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** For Client Components that can only guess the locale from the URL. */
export function dictionaryForUnknown(value: string | undefined, fallback: Locale): Dictionary {
  return dictionaries[isLocale(value) ? value : fallback]
}

/** Fills `{name}` placeholders. The only templating the copy needs. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
