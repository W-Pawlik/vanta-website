import { ButtonLink, CtaArrow } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { primaryCtaHref } from '@/data/navigation'
import { getDictionary } from '@/i18n/server'

/**
 * A single conversion line, straight after the gallery.
 *
 * Between the hero and the lead form the visitor previously went several thousand
 * pixels without a call to action in the content — the navbar CTA does not count,
 * because it is chrome. One row, not another full section.
 */
export async function InlineCta() {
  const dict = await getDictionary()

  return (
    <Section spacing="tight">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-10 lg:flex-row lg:items-center">
          <p className="font-display text-display-card text-content uppercase">
            {dict.inlineCta.text}
          </p>
          <ButtonLink href={primaryCtaHref} size="lg">
            {dict.inlineCta.cta}
            <CtaArrow direction="right" />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
