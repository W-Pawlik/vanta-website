import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeader } from '@/components/ui/section-header'
import { SECTION_IDS } from '@/data/navigation'
import { PRICE_GROUPS, priceList } from '@/data/price-list'
import { lowestPrice, services } from '@/data/services'
import { getDictionary } from '@/i18n/server'

import { ServicesList } from './services-list'
import type { DrawerPricelist } from './service-drawer'

/**
 * Four broad categories, rendered as full-width rows rather than cards.
 *
 * This section answers "what do you do, and roughly what does it cost". The detailed
 * price list lives in a drawer, and ready-made bundles live in Packages — three
 * levels of the offer, each answering a different question, with no duplication.
 *
 * Server-rendered header and copy; the client island handles hover, the drawer and
 * seeding the lead form.
 */
export async function Services() {
  const dict = await getDictionary()

  const items = services.map((service) => {
    const copy = dict.services.items[service.slug]
    // The four categories have disjoint variant keys, so `keyof` over their union is
    // `never`. Widened here rather than indexed unsafely at every use.
    const variantCopy = copy.variants as Record<string, { name: string; description: string }>

    return {
      slug: service.slug,
      image: service.image,
      priceFrom: lowestPrice(service),
      name: copy.name,
      description: copy.description,
      imageAlt: copy.imageAlt,
      includes: copy.includes,
      variants: service.variants.map((variant) => ({
        key: variant.key,
        priceFrom: variant.priceFrom,
        ...variantCopy[variant.key]!,
      })),
    }
  })

  const priceCopy = dict.services.pricelist.items as Record<
    string,
    { name: string; description: string }
  >

  const pricelist: DrawerPricelist = {
    title: dict.services.pricelist.title,
    intro: dict.services.pricelist.intro,
    question: dict.services.pricelist.question,
    cta: dict.services.pricelist.cta,
    groups: PRICE_GROUPS.map((group) => ({
      key: group,
      name: dict.services.pricelist.groups[group],
      items: priceList[group].map((entry) => ({
        key: entry.key,
        priceFrom: entry.priceFrom,
        perUnit: entry.perUnit ?? false,
        ...priceCopy[entry.key]!,
      })),
    })),
  }

  return (
    <Section id={SECTION_IDS.services} spacing="large">
      <Container>
        <SectionHeader
          index={2}
          label={dict.services.label}
          headlineLines={dict.services.headline}
          aside={<p>{dict.services.aside}</p>}
        />

        <div className="mt-16">
          <ServicesList
            items={items}
            pricelist={pricelist}
            labels={{
              priceNote: dict.services.priceNote,
              pricelistCta: dict.services.pricelistCta,
              openDetails: dict.services.openDetails,
              drawer: {
                region: dict.services.drawer.region,
                variants: dict.services.drawer.variants,
                includes: dict.services.drawer.includes,
                cta: dict.services.drawer.cta,
                close: dict.common.close,
                perUnit: dict.services.pricelist.perUnit,
              },
            }}
          />
        </div>
      </Container>
    </Section>
  )
}
