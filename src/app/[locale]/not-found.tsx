import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { getDictionary, getLocale } from '@/i18n/server'

export default async function NotFound() {
  const dict = await getDictionary()
  const locale = await getLocale()

  return (
    <Section className="flex min-h-svh items-center">
      <Container>
        <SectionLabel className="mb-6">{dict.notFound.label}</SectionLabel>
        <h1 className="max-w-[22ch] font-display text-display-section uppercase">
          {dict.notFound.headline}
        </h1>
        <p className="mt-6 max-w-measure text-body text-content-secondary">{dict.notFound.body}</p>
        <ButtonLink href={`/${locale}`} size="lg" className="mt-10">
          {dict.notFound.cta}
        </ButtonLink>
      </Container>
    </Section>
  )
}
