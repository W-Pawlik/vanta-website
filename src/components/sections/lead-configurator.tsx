import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { SECTION_IDS } from '@/data/navigation'
import { getDictionary, getLocale } from '@/i18n/server'

import { LeadForm } from './lead-form'

/**
 * Split screen: the pitch on the left, the configurator on the right. Only the form is
 * a Client Component.
 */
export async function LeadConfigurator() {
  const dict = await getDictionary()
  const locale = await getLocale()

  return (
    <Section id={SECTION_IDS.lead} spacing="large">
      <Container>
        <div className="grid grid-cols-12 gap-6 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <SectionLabel index={9} className="mb-8">
              {dict.lead.label}
            </SectionLabel>

            <Headline lines={dict.lead.headline} className="text-display-section" />

            <p className="mt-8 max-w-measure text-body-lg text-content-secondary">
              {dict.lead.lead}
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {dict.lead.reassurance.map((item) => (
                <li key={item} className="font-mono text-meta text-content-tertiary uppercase">
                  <span aria-hidden="true" className="mr-2 text-accent">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <LeadForm locale={locale} copy={dict.lead.form} validation={dict.validation} />
          </div>
        </div>
      </Container>
    </Section>
  )
}
