import Image from 'next/image'

import { ButtonLink, CtaArrow } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { primaryCtaHref } from '@/data/navigation'
import { siteConfig } from '@/data/site'
import { getDictionary } from '@/i18n/server'

/**
 * Cinematic finish. Mirrors the hero deliberately — the page opens and closes on the
 * same note, with the offer in between.
 */
export async function FinalCTA() {
  const dict = await getDictionary()

  return (
    <section className="relative isolate flex min-h-[75svh] items-end overflow-hidden py-section">
      <Image
        src="/images/final-cta-bmw-m3-fog.jpg"
        alt={dict.finalCta.imageAlt}
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/70 to-canvas/30"
      />

      <Container>
        <Headline lines={dict.finalCta.headline} className="text-display-hero" />

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href={primaryCtaHref} size="lg">
            {dict.finalCta.cta}
            <CtaArrow />
          </ButtonLink>
          <a
            href={siteConfig.contact.phoneHref}
            className="text-body text-content-secondary transition-colors duration-[var(--duration-fast)] hover:text-content"
          >
            {siteConfig.contact.phone}
          </a>
        </div>
      </Container>
    </section>
  )
}
