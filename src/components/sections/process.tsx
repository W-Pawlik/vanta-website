import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { SECTION_IDS } from '@/data/navigation'
import { PROCESS_STEP_KEYS } from '@/data/process'
import { getDictionary } from '@/i18n/server'

import { ProcessTimeline } from './process-timeline'

/**
 * The page's only light section — a rhythm break, not a decoration. Like Selected
 * Work, it breaks the standard header composition: the label sits with the timeline
 * rather than above the headline.
 */
export async function Process() {
  const dict = await getDictionary()
  const steps = PROCESS_STEP_KEYS.map((key) => dict.process.steps[key])

  return (
    <Section id={SECTION_IDS.process} tone="invert" spacing="default">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Headline lines={dict.process.headline} className="text-content-invert" />
          </div>
          <p className="col-span-12 self-end text-body-lg text-content-invert-secondary lg:col-span-3 lg:col-start-10">
            {dict.process.aside}
          </p>
        </div>

        <div className="mt-24 flex items-center gap-6">
          <SectionLabel index={5} tone="invert">
            {dict.process.label}
          </SectionLabel>
          <span aria-hidden="true" className="h-px flex-1 bg-line-invert" />
        </div>

        <div className="mt-14">
          <ProcessTimeline steps={steps} />
        </div>
      </Container>
    </Section>
  )
}
