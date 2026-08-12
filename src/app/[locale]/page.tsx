import { BeforeAfter } from '@/components/sections/before-after'
import { FinalCTA } from '@/components/sections/final-cta'
import { Hero } from '@/components/sections/hero'
import { InlineCta } from '@/components/sections/inline-cta'
import { LeadConfigurator } from '@/components/sections/lead-configurator'
import { Manifesto } from '@/components/sections/manifesto'
import { Pricing } from '@/components/sections/pricing'
import { Process } from '@/components/sections/process'
import { SelectedWork } from '@/components/sections/selected-work'
import { Services } from '@/components/sections/services'
import { Stats } from '@/components/sections/stats'
import { Testimonials } from '@/components/sections/testimonials'

/**
 * The home page is a flat list of sections and nothing else — no layout glue.
 * Each section owns its own spacing, tone and container.
 *
 * Order follows the sales funnel: WOW → TRUST → PROOF → OFFER → TRUST → LEAD.
 * See .agents/00-project-brief.md.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <BeforeAfter />
      <SelectedWork />
      <InlineCta />
      <Process />
      <Stats />
      <Pricing />
      <Testimonials />
      <LeadConfigurator />
      <FinalCTA />
    </>
  )
}
