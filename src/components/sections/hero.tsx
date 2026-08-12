import Image from 'next/image'

import { ButtonLink, CtaArrow } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { SECTION_IDS, primaryCtaHref } from '@/data/navigation'
import { socialProof } from '@/data/stats'
import { getDictionary } from '@/i18n/server'
import { formatDecimal } from '@/lib/utils/format'

/**
 * Full-viewport opener. The photograph is the only `priority` image on the page —
 * it is the LCP element.
 *
 * Type sits high, the meta strip sits low, and the car is pushed right and down via
 * `object-position` so the two stop competing for the same area.
 */
export async function Hero() {
  const dict = await getDictionary()

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden pb-10">
      <Image
        src="/images/hero-mercedes-cls.jpg"
        alt={dict.hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[38%_64%]"
      />

      {/* Local lift over the car. Without it the photograph reads as a dark backdrop
          and the first impression is "white text on black" rather than "car".
          `screen` brightens the highlights without lifting the blacks. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(58%_42%_at_70%_74%,rgba(255,255,255,0.85),transparent_72%)] opacity-20 mix-blend-screen"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-canvas/92 via-canvas/55 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/15 to-transparent"
      />

      <Container className="pt-[calc(var(--navbar-height)+2rem)]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            {/* No eyebrow label here. The logotype is already in the navbar, so
                "VANTA / AUTO DETAILING STUDIO" only repeated it — and it pushed the
                headline down for nothing. */}
            <Headline as="h1" lines={dict.hero.headline} className="text-display-hero" />

            {/* 28px to the lead, 36px to the CTA row, so the three tiers read as three. */}
            <p className="mt-7 max-w-measure text-body-lg text-content-secondary">
              {dict.hero.lead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={primaryCtaHref} size="lg">
                {dict.hero.cta}
                <CtaArrow direction="right" />
              </ButtonLink>
              <a
                href={`#${SECTION_IDS.work}`}
                className="group text-body text-content-secondary transition-colors duration-[var(--duration-fast)] hover:text-content"
              >
                {dict.hero.secondaryCta}{' '}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="mt-10 flex items-end justify-between gap-6 border-t border-line pt-6">
          <p className="font-mono text-label uppercase">
            <span className="text-accent">{formatDecimal(socialProof.rating)} ★</span>
            <span aria-hidden="true" className="text-content-ghost">
              {' / '}
            </span>
            <span className="text-content-secondary">
              {`${socialProof.projectCount}+ ${dict.hero.projects}`}
            </span>
          </p>

          <div className="hidden items-center gap-4 lg:flex">
            <span className="font-mono text-meta text-content-tertiary uppercase">
              {dict.hero.scroll}
            </span>
            <span aria-hidden="true" className="relative block h-14 w-px bg-content-ghost">
              <span className="absolute inset-0 block animate-scroll-line bg-content" />
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
