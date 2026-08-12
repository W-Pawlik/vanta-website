import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { getDictionary } from '@/i18n/server'

import { TestimonialsSlider } from './testimonials-slider'

/** Short section by design — the quote carries it, so it gets `tight` spacing. */
export async function Testimonials() {
  const dict = await getDictionary()

  return (
    <Section spacing="tight">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index={8}>{dict.testimonials.label}</SectionLabel>
            <h2 className="mt-8 max-w-[14ch] font-display text-display-card text-content uppercase">
              {dict.testimonials.heading}
            </h2>
          </div>

          <div className="col-span-12 mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <TestimonialsSlider
              items={dict.testimonials.items}
              labels={{
                previous: dict.testimonials.previous,
                next: dict.testimonials.next,
                rating: dict.testimonials.ratingLabel,
              }}
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
