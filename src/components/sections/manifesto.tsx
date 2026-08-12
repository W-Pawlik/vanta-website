import { ScrollLitText } from '@/components/motion/scroll-lit-text'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { getDictionary } from '@/i18n/server'

/**
 * Deliberate change of pace after the hero: no image, a lot of air, one statement.
 *
 * The empty space is only earned because the headline lights up word by word as it
 * scrolls. This is the most spacious section on the page, and the only one that gets
 * away with it.
 */
export async function Manifesto() {
  const dict = await getDictionary()

  return (
    <Section spacing="xl">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index={1}>{dict.manifesto.label}</SectionLabel>
          </div>

          <div className="col-span-12 mt-10 lg:col-span-9 lg:col-start-2 lg:mt-0">
            <ScrollLitText lines={dict.manifesto.headline} />
          </div>

          {/* Pulled up from the bottom: the body used to sit so low it read as a
              detached footnote rather than as the counterpoint. */}
          <div className="col-span-12 mt-16 lg:col-span-5 lg:col-start-8 lg:mt-20">
            <p className="text-body-lg text-content-secondary">{dict.manifesto.body}</p>

            <p className="mt-8 flex gap-4 text-body-lg text-content">
              <span aria-hidden="true" className="mt-[0.6em] h-px w-6 shrink-0 bg-accent" />
              <span>
                {dict.manifesto.punchline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
