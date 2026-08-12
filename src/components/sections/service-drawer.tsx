'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { Overlay } from '@/components/ui/overlay'
import { DURATION, EASE, STAGGER } from '@/lib/motion/tokens'
import { formatPriceFrom } from '@/lib/utils/format'

export type DrawerVariant = {
  key: string
  name: string
  description: string
  priceFrom: number
}

export type DrawerService = {
  slug: string
  name: string
  description: string
  image: string
  imageAlt: string
  includes: readonly string[]
  variants: readonly DrawerVariant[]
}

export type DrawerPriceGroup = {
  key: string
  name: string
  items: readonly (DrawerVariant & { perUnit: boolean })[]
}

export type DrawerPricelist = {
  title: string
  intro: string
  question: string
  cta: string
  groups: readonly DrawerPriceGroup[]
}

export type DrawerContent =
  { kind: 'service'; service: DrawerService } | { kind: 'pricelist'; pricelist: DrawerPricelist }

type Labels = {
  region: string
  variants: string
  includes: string
  cta: string
  close: string
  perUnit: string
}

/**
 * Side panel for service details and the full price list.
 *
 * Why a drawer and not routes or another section: a visitor clicking "Paint
 * correction" wants to know what it covers and why it starts at 900 zł — sending
 * them straight to the contact form is too aggressive, and twenty price rows on the
 * page would wreck the minimal flow. So: hover → interest, click → detail,
 * CTA → lead.
 *
 * The panel stays mounted while its content changes, so switching from one category
 * to another (or to the price list) cross-fades the content instead of sliding the
 * whole panel out and back in.
 */
export function ServiceDrawer({
  content,
  onClose,
  onCta,
  ctaHref,
  labels,
}: {
  content: DrawerContent | null
  onClose: () => void
  /** Seeds the lead form and closes the panel. The anchor does the scrolling. */
  onCta: () => void
  ctaHref: string
  labels: Labels
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = content !== null

  useEffect(() => {
    if (!isOpen) return
    // Land on the close button: the first thing a visitor needs is the way out.
    closeRef.current?.focus()
  }, [isOpen])

  // Identifies the current content so AnimatePresence knows when to cross-fade.
  const contentKey =
    content === null ? 'none' : content.kind === 'service' ? content.service.slug : 'pricelist'

  return (
    <Overlay open={isOpen} onClose={onClose} className="justify-end">
      {content && (
        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={labels.region}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: DURATION.slow, ease: EASE.outExpo }}
          onClick={(event) => event.stopPropagation()}
          className="flex h-full w-full flex-col overflow-y-auto border-l border-line bg-canvas sm:w-[86vw] lg:w-[46vw] lg:max-w-[42rem]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-canvas/92 px-7 py-4 backdrop-blur-xl sm:px-10">
            <p className="font-mono text-meta text-content-tertiary uppercase">
              {content.kind === 'service' ? content.service.name : content.pricelist.title}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-10 items-center gap-2 rounded-control border border-line px-4 font-mono text-meta text-content uppercase transition-colors duration-[var(--duration-fast)] hover:border-line-strong hover:bg-surface"
            >
              {labels.close}
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: STAGGER.tight } },
              }}
              className="flex-1 px-7 pt-8 pb-12 sm:px-10"
            >
              {content.kind === 'service' ? (
                <ServiceBody
                  service={content.service}
                  labels={labels}
                  onCta={onCta}
                  ctaHref={ctaHref}
                />
              ) : (
                <PricelistBody
                  pricelist={content.pricelist}
                  labels={labels}
                  onCta={onCta}
                  ctaHref={ctaHref}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      )}
    </Overlay>
  )
}

/** Children of the staggered container all share this entrance. */
const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outQuart } },
}

function ServiceBody({
  service,
  labels,
  onCta,
  ctaHref,
}: {
  service: DrawerService
  labels: Labels
  onCta: () => void
  ctaHref: string
}) {
  return (
    <>
      <motion.div variants={item} className="overflow-hidden rounded-image">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: DURATION.reveal, ease: EASE.outExpo }}
        >
          <Image
            src={service.image}
            alt={service.imageAlt}
            width={840}
            height={560}
            sizes="(max-width: 1024px) 90vw, 42rem"
            className="aspect-3/2 w-full object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.h2
        variants={item}
        className="mt-8 font-display text-display-project text-content uppercase"
      >
        {service.name}
      </motion.h2>

      <motion.p variants={item} className="mt-4 text-body text-content-secondary">
        {service.description}
      </motion.p>

      <motion.p
        variants={item}
        className="mt-10 font-mono text-meta text-content-tertiary uppercase"
      >
        {labels.variants}
      </motion.p>

      <motion.ul variants={item} className="mt-4 border-t border-line">
        {service.variants.map((variant) => (
          <li
            key={variant.key}
            className="flex items-baseline justify-between gap-6 border-b border-line py-5"
          >
            <span className="min-w-0">
              <span className="block font-display text-display-card text-content uppercase">
                {variant.name}
              </span>
              <span className="mt-1 block text-body-sm text-content-secondary">
                {variant.description}
              </span>
            </span>
            <span className="shrink-0 font-mono text-label text-accent">
              {formatPriceFrom(variant.priceFrom)}
            </span>
          </li>
        ))}
      </motion.ul>

      <motion.ul variants={item} className="mt-8 space-y-2">
        <li className="font-mono text-meta text-content-tertiary uppercase">{labels.includes}</li>
        {service.includes.map((entry) => (
          <li key={entry} className="flex gap-3 text-body-sm text-content-secondary">
            <span aria-hidden="true" className="text-accent">
              +
            </span>
            {entry}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="mt-10">
        <DrawerCta label={labels.cta} href={ctaHref} onClick={onCta} />
      </motion.div>
    </>
  )
}

function PricelistBody({
  pricelist,
  labels,
  onCta,
  ctaHref,
}: {
  pricelist: DrawerPricelist
  labels: Labels
  onCta: () => void
  ctaHref: string
}) {
  return (
    <>
      <motion.h2
        variants={item}
        className="font-display text-display-project text-content uppercase"
      >
        {pricelist.title}
      </motion.h2>
      <motion.p variants={item} className="mt-4 max-w-measure text-body-sm text-content-secondary">
        {pricelist.intro}
      </motion.p>

      {pricelist.groups.map((group, groupIndex) => (
        <motion.section variants={item} key={group.key} className="mt-12">
          <p className="font-mono text-meta text-content-tertiary uppercase">
            <span className="text-accent">{String(groupIndex + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / </span>
            {group.name}
          </p>

          {/* Typography and hairlines, not a spreadsheet. */}
          <ul className="mt-4 border-t border-line">
            {group.items.map((entry) => (
              <li
                key={entry.key}
                className="group flex items-baseline justify-between gap-6 border-b border-line py-4"
              >
                <span className="min-w-0">
                  <span className="block text-body text-content">{entry.name}</span>
                  <span className="mt-0.5 block text-body-sm text-content-tertiary">
                    {entry.description}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-label text-content-secondary transition-colors duration-[var(--duration-fast)] group-hover:text-accent">
                  {formatPriceFrom(entry.priceFrom)}
                  {entry.perUnit ? ` / ${labels.perUnit}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      ))}

      <motion.div variants={item} className="mt-14 border-t border-line pt-8">
        <p className="font-display text-display-card text-content uppercase">
          {pricelist.question}
        </p>
        <div className="mt-6">
          <DrawerCta label={pricelist.cta} href={ctaHref} onClick={onCta} />
        </div>
      </motion.div>
    </>
  )
}

/**
 * A real anchor, not a button: the browser handles the scroll to the form (and
 * honours prefers-reduced-motion via scroll-behavior), while onClick seeds the
 * selection and closes the panel.
 */
function DrawerCta({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group inline-flex h-14 items-center justify-center gap-2 rounded-control bg-accent px-7 text-body font-medium text-accent-contrast transition-colors duration-[var(--duration-fast)] hover:bg-canvas hover:text-accent hover:ring-1 hover:ring-accent"
    >
      {label}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  )
}
