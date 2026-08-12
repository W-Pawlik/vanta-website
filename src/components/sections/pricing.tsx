import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionHeader } from '@/components/ui/section-header'
import { SECTION_IDS, primaryCtaHref } from '@/data/navigation'
import { packages } from '@/data/pricing'
import { getDictionary, interpolateDictionary } from '@/i18n/server'
import { cn } from '@/lib/utils/cn'
import { formatPrice, formatPriceFrom } from '@/lib/utils/format'

import { PackageCta } from './package-cta'

/**
 * Ready-made bundles, for the visitor who does not want to assemble a scope service
 * by service. Services answers "what does this one thing cost"; this answers "what
 * should I do with the whole car".
 *
 * Signature is distinguished by a small accent label and a raised surface — never by
 * a neon border, which would cheapen the section.
 */
export async function Pricing() {
  const dict = await getDictionary()

  return (
    <Section id={SECTION_IDS.packages} spacing="large">
      <Container>
        <SectionHeader
          index={7}
          label={dict.packages.label}
          headlineLines={dict.packages.headline}
          aside={<p>{dict.packages.aside}</p>}
        />

        <div className="mt-20 grid grid-cols-12 gap-6">
          {packages.map((pack) => {
            const copy = dict.packages.items[pack.slug]

            return (
              <article
                key={pack.slug}
                className={cn(
                  'col-span-12 flex flex-col rounded-panel border p-8 transition-colors duration-[var(--duration-base)] md:col-span-6 lg:col-span-4',
                  pack.featured
                    ? 'border-line-strong bg-surface-raised lg:-mt-5 lg:pb-13'
                    : 'border-line bg-surface hover:border-line-strong',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-display-card text-content uppercase">
                    {copy.name}
                  </h3>
                  {pack.featured && (
                    <span className="rounded-full bg-accent px-3 py-1 font-mono text-meta text-accent-contrast uppercase">
                      {dict.packages.mostPopular}
                    </span>
                  )}
                </div>

                <p className="mt-6 font-display text-display-project text-content">
                  {formatPriceFrom(pack.priceFrom)}
                </p>

                {/* The value of the same work bought separately. Stated once, quietly —
                    a struck-through "was" price would read like a shop promotion. */}
                {pack.separateValue !== undefined && (
                  <p className="mt-2 font-mono text-meta text-content-tertiary uppercase">
                    {interpolateDictionary(dict.packages.separateValue, {
                      price: formatPrice(pack.separateValue),
                    })}
                  </p>
                )}

                <p className="mt-3 text-body-sm text-content-secondary">{copy.tagline}</p>

                <ul className="mt-10 flex-1 space-y-3 border-t border-line pt-8 text-body-sm text-content-secondary">
                  {copy.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden="true" className="text-accent">
                        —
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <PackageCta
                  slug={pack.slug}
                  href={primaryCtaHref}
                  label={copy.cta}
                  featured={pack.featured}
                />
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
