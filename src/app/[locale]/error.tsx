'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { siteConfig } from '@/data/site'
import { defaultLocale } from '@/i18n/config'
import { dictionaryForUnknown } from '@/i18n/dictionaries'

/**
 * Route-level error boundary. Never shows the raw error to the visitor — a detailing
 * studio's site that leaks a stack trace stops looking premium immediately.
 *
 * This is a Client Component, so it cannot use `next/root-params`. The locale is read
 * from the URL instead, falling back to the default.
 */
export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[route error]', error)
  }, [error])

  const segment = typeof window === 'undefined' ? '' : window.location.pathname.split('/')[1]
  const dict = dictionaryForUnknown(segment, defaultLocale)

  return (
    <Section className="flex min-h-svh items-center">
      <Container>
        <SectionLabel className="mb-6">{dict.errorPage.label}</SectionLabel>
        <h1 className="max-w-[22ch] font-display text-display-section uppercase">
          {dict.errorPage.headline}
        </h1>
        <p className="mt-6 max-w-measure text-body text-content-secondary">{dict.errorPage.body}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" onClick={reset}>
            {dict.errorPage.cta}
          </Button>
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex h-14 items-center px-2 text-body text-content-secondary transition-colors hover:text-content"
          >
            {siteConfig.contact.phone}
          </a>
        </div>
      </Container>
    </Section>
  )
}
