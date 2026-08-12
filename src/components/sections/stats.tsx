import { AnimatedCounter } from '@/components/motion/animated-counter'
import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { stats } from '@/data/stats'
import { getDictionary } from '@/i18n/server'

/**
 * Purely typographic section — no photography, which is what makes the numbers land
 * after the light Process break. Counters run once, on first entry into the viewport.
 */
export async function Stats() {
  const dict = await getDictionary()

  return (
    <Section spacing="default">
      <Container>
        <SectionLabel index={6} className="mb-16">
          {dict.stats.label}
        </SectionLabel>

        <dl className="grid grid-cols-12 gap-y-14">
          {stats.map((stat) => (
            <div key={stat.key} className="col-span-6 lg:col-span-3">
              <dd>
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  className="block font-display text-numeric text-accent"
                />
              </dd>
              <dt className="mt-4 max-w-[16ch] font-mono text-meta text-content-tertiary uppercase">
                {dict.stats.items[stat.key]}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-28 grid grid-cols-12 gap-6 border-t border-line pt-16">
          <div className="col-span-12 lg:col-span-5">
            <Headline lines={dict.stats.manifesto.headline} />
          </div>

          <div className="col-span-12 space-y-5 self-end text-body-lg text-content-secondary lg:col-span-6 lg:col-start-7">
            {dict.stats.manifesto.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
