import { Container } from '@/components/ui/container'
import { Headline } from '@/components/ui/headline'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { SECTION_IDS } from '@/data/navigation'
import { closingFrame, projects } from '@/data/projects'
import { getDictionary } from '@/i18n/server'

import { WorkGallery } from './work-gallery'

/**
 * Editorial gallery.
 *
 * The header deliberately breaks the label → headline pattern used by the other
 * sections: `04` runs vertically down the left margin. Same system, different
 * composition, so the page stops feeling templated halfway through.
 */
export async function SelectedWork() {
  const dict = await getDictionary()

  const frames = projects.map((project) => {
    const copy = dict.work.items[project.slug]

    return {
      image: project.image,
      ratio: project.ratio,
      parallax: project.parallax,
      imageAlt: copy.imageAlt,
      title: copy.car,
      scope: copy.scope,
    }
  })

  return (
    <Section id={SECTION_IDS.work} spacing="large">
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden lg:col-span-1 lg:block">
            <SectionLabel index={4} orientation="vertical" className="sticky top-32">
              {dict.work.label}
            </SectionLabel>
          </div>

          <div className="col-span-12 lg:col-span-11">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <SectionLabel index={4} className="mb-7 lg:hidden">
                  {dict.work.label}
                </SectionLabel>
                <Headline lines={dict.work.headline} />
              </div>
              <p className="col-span-12 self-end text-body text-content-secondary lg:col-span-4 lg:col-start-9">
                {dict.work.aside}
              </p>
            </div>

            <div className="mt-20">
              <WorkGallery
                frames={frames}
                closing={{
                  image: closingFrame.image,
                  ratio: closingFrame.ratio,
                  parallax: closingFrame.parallax,
                  imageAlt: dict.work.closing.imageAlt,
                  title: dict.work.closing.title,
                  scope: dict.work.closing.scope,
                }}
                labels={{
                  view: dict.work.view,
                  statement: dict.work.statement,
                  lightboxRegion: dict.work.lightboxRegion,
                  close: dict.common.close,
                  openFrame: dict.work.openFrame,
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
