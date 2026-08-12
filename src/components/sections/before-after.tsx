import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeader } from '@/components/ui/section-header'
import { caseStudy } from '@/data/case-study'
import { getDictionary } from '@/i18n/server'

import { BeforeAfterSlider } from './before-after-slider'

/**
 * Server-rendered frame around a single client island: only the drag behaviour ships
 * as JavaScript.
 *
 * Spacing is `small` on purpose — this section follows Services, and the gap between
 * the two was the longest dead stretch on the page.
 */
export async function BeforeAfter() {
  const dict = await getDictionary()
  const copy = dict.beforeAfter

  return (
    <Section spacing="small" className="bg-surface">
      <Container>
        <SectionHeader
          index={3}
          label={copy.label}
          headlineLines={copy.headline}
          aside={<p>{copy.aside}</p>}
        />

        <div className="mt-20">
          <BeforeAfterSlider
            image={caseStudy.image}
            labels={{
              imageAlt: copy.imageAlt,
              before: copy.before,
              after: copy.after,
              slider: copy.sliderLabel,
              sliderValue: copy.sliderValue,
            }}
          />
        </div>

        {/* Three typographic columns divided by hairlines — no cards. */}
        <dl className="mt-12 grid grid-cols-12 gap-y-10 border-t border-line pt-10">
          <div className="col-span-12 lg:col-span-4">
            <dt className="font-mono text-meta text-content-tertiary uppercase">
              {copy.caseLabel}
            </dt>
            <dd className="mt-3 font-display text-display-project text-content uppercase">
              {copy.car}
            </dd>
            <dd className="mt-2 font-mono text-meta text-content-tertiary">{caseStudy.year}</dd>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-line lg:pl-8">
            <dt className="font-mono text-meta text-content-tertiary uppercase">
              {copy.scopeLabel}
            </dt>
            <dd className="mt-3 space-y-1.5 text-body text-content-secondary">
              {copy.scope.map((item) => (
                <span key={item} className="block">
                  {item}
                </span>
              ))}
            </dd>
          </div>

          <div className="col-span-12 lg:col-span-3 lg:border-l lg:border-line lg:pl-8">
            <dt className="font-mono text-meta text-content-tertiary uppercase">
              {copy.durationLabel}
            </dt>
            <dd className="mt-3 font-display text-display-project text-accent uppercase">
              {copy.duration}
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  )
}
