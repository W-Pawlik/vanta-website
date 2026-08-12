import { Container } from '@/components/ui/container'
import { Wordmark } from '@/components/ui/wordmark'
import { siteConfig } from '@/data/site'
import type { Dictionary } from '@/i18n/dictionaries'

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="relative isolate overflow-hidden bg-canvas-deep pt-section-tight">
      <Container>
        <div className="grid grid-cols-12 gap-6 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <Wordmark className="text-display-card text-content" />
            <p className="mt-2 font-mono text-label text-content-tertiary uppercase">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 lg:col-start-7">
            <h2 className="font-mono text-label text-content-tertiary uppercase">
              {dict.footer.studio}
            </h2>
            <address className="mt-5 space-y-1 text-body-sm text-content not-italic">
              <p>{siteConfig.address.street}</p>
              <p>{`${siteConfig.address.postalCode} ${siteConfig.address.city}`}</p>
            </address>
            <dl className="mt-5 space-y-1 text-body-sm text-content-secondary">
              {siteConfig.openingHours.map((entry) => (
                <div key={entry.days}>
                  <dt className="sr-only">{entry.days}</dt>
                  <dd>{`${entry.days}: ${entry.hours}`}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <h2 className="font-mono text-label text-content-tertiary uppercase">
              {dict.footer.contact}
            </h2>
            <ul className="mt-5 space-y-1 text-body-sm">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="text-content transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-content transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-2">
            <h2 className="font-mono text-label text-content-tertiary uppercase">
              {dict.footer.social}
            </h2>
            <ul className="mt-5 space-y-1 text-body-sm">
              {siteConfig.social.map((entry) => (
                <li key={entry.label}>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-content transition-colors duration-[var(--duration-fast)] hover:text-accent"
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-body-sm text-content-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${siteConfig.copyrightYear} ${siteConfig.legalName}`}</p>
          <p>{dict.footer.legal}</p>
        </div>
      </Container>

      {/* Oversized logotype, clipped by the bottom edge — the page's full stop.
          Decorative here: the footer already names the studio in the block above. */}
      <div aria-hidden="true" className="mt-14 overflow-hidden px-gutter select-none">
        {/* Slightly wider than the viewport and pulled below the fold, so the mark is
            cropped rather than sitting neatly inside the page. */}
        <Wordmark fit="block" className="-mb-[3%] scale-[1.04] text-content opacity-[0.06]" />
      </div>
    </footer>
  )
}
