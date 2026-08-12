import type { Metadata } from 'next'

import { AnimatedCounter } from '@/components/motion/animated-counter'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Button, ButtonLink, CtaArrow, type ButtonVariant } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { SectionLabel } from '@/components/ui/section-label'
import { Wordmark } from '@/components/ui/wordmark'
import { DURATION, EASE, STAGGER } from '@/lib/motion/tokens'
import { formatPriceFrom } from '@/lib/utils/format'

/**
 * Living reference for the design system. Not part of the public site — it is
 * excluded from indexing and from the sitemap — but it is the fastest way to
 * review tokens, primitives and motion in a real browser.
 *
 * When a token or primitive is added, add it here too.
 */
export const metadata: Metadata = {
  title: 'Design system | VANTA',
  robots: { index: false, follow: false },
}

const SURFACES = [
  { token: 'canvas', value: '#0A0A0A', note: 'Tło strony' },
  { token: 'canvas-warm', value: '#0D0D0C', note: 'Cieplejszy wariant tła' },
  { token: 'canvas-deep', value: '#080808', note: 'Stopka — poziom niżej niż strona' },
  { token: 'surface', value: '#121212', note: 'Karty, sekcja Before/After' },
  { token: 'surface-raised', value: '#171717', note: 'Karta wyróżniona, panel formularza' },
  { token: 'canvas-invert', value: '#ECEAE4', note: 'Jasna przerwa (Proces)' },
] as const

/** Four steps, not two. Bez środkowych stopni każdy tekst czyta się albo jak nagłówek, albo jak disabled. */
const TEXT_STEPS = [
  { token: 'content', note: 'Nagłówki i treść krytyczna', className: 'text-content' },
  {
    token: 'content-secondary',
    note: 'Tekst akapitowy — domyślny',
    className: 'text-content-secondary',
  },
  {
    token: 'content-tertiary',
    note: 'Metadata, etykiety, podpisy',
    className: 'text-content-tertiary',
  },
  { token: 'content-ghost', note: 'Tylko dekoracja i separatory', className: 'text-content-ghost' },
  {
    token: 'content-dim',
    note: 'Stan spoczynkowy tekstu rozjaśnianego scrollem',
    className: 'text-content-dim',
  },
] as const

const DISPLAY_SCALE = [
  {
    token: 'text-display-hero',
    sample: 'Twój samochód',
    note: 'Hero — 104 px @1440, ograniczony też wysokością okna (11.5svh)',
  },
  { token: 'text-display-statement', sample: 'Nie maskujemy', note: 'Manifesto — 88 px' },
  {
    token: 'text-display-section',
    sample: 'Zadbamy o każdy detal',
    note: 'Nagłówek sekcji — 70 px',
  },
  { token: 'text-display-project', sample: 'Mercedes-AMG GT', note: 'Nazwa realizacji — 34 px' },
  { token: 'text-display-card', sample: 'Signature', note: 'Nazwa karty — 30 px' },
  { token: 'text-numeric', sample: '350+', note: 'Liczby w sekcji Stats' },
  { token: 'text-quote', sample: 'Zobaczyłem różnicę.', note: 'Cytat z opinii' },
] as const

const BODY_SCALE = [
  { token: 'text-body-lg', sample: 'Lead — 18 px. Wprowadzenie do sekcji.', note: 'Lead' },
  { token: 'text-body', sample: 'Tekst akapitowy — 16 px, line-height 1.6.', note: 'Body' },
  {
    token: 'text-body-sm',
    sample: 'Tekst pomocniczy — 15 px. Niżej nie schodzimy.',
    note: 'Small',
  },
  { token: 'text-label', sample: 'ETYKIETA SEKCJI — 13 PX', note: 'Mono eyebrow' },
  { token: 'text-meta', sample: 'METADATA — 12 PX', note: 'Jedyny stopień pod 15 px' },
] as const

const RADII = [
  { token: 'rounded-control', note: '10 px — przyciski, inputy' },
  { token: 'rounded-image', note: '14 px — kadry zdjęć' },
  { token: 'rounded-panel', note: '18 px — duże panele, sticky navbar' },
] as const

const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'quiet']

export default function SystemPage() {
  return (
    <>
      <Section spacing="tight" className="border-b border-line">
        <Container>
          <SectionLabel index={0} className="mb-6">
            DESIGN SYSTEM
          </SectionLabel>
          <h1 className="font-display text-display-section uppercase">
            <span className="block">Tokeny, komponenty</span>
            <span className="block">i animacje.</span>
          </h1>
          <p className="mt-8 max-w-measure text-body text-content-secondary">
            Strona referencyjna. Każdy token z <code>src/styles/theme.css</code> i każdy primitive z{' '}
            <code>src/components</code> powinien mieć tu swój przykład.
          </p>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={1} className="mb-10">
            POWIERZCHNIE
          </SectionLabel>
          <RevealGroup
            stagger={STAGGER.tight}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          >
            {SURFACES.map((surface) => (
              <RevealItem key={surface.token} className="rounded-panel border border-line p-4">
                <div
                  className="mb-4 h-20 w-full rounded-control border border-line"
                  style={{ backgroundColor: surface.value }}
                />
                <p className="font-mono text-meta text-content uppercase">{surface.token}</p>
                <p className="mt-1 font-mono text-meta text-content-tertiary">{surface.value}</p>
                <p className="mt-3 text-body-sm text-content-secondary">{surface.note}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={2} className="mb-10">
            HIERARCHIA TEKSTU
          </SectionLabel>
          <div className="divide-y divide-line">
            {TEXT_STEPS.map((step) => (
              <div
                key={step.token}
                className="flex flex-col gap-2 py-6 lg:flex-row lg:items-baseline lg:gap-10"
              >
                <p className="font-mono text-meta text-accent uppercase lg:w-64 lg:shrink-0">
                  {step.token}
                </p>
                <p className={`text-body-lg ${step.className}`}>
                  Lakier wygląda lepiej niż przy odbiorze z salonu.
                </p>
                <p className="text-body-sm text-content-tertiary lg:ml-auto lg:text-right">
                  {step.note}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={3} className="mb-10">
            SKALA DISPLAY
          </SectionLabel>
          <div className="divide-y divide-line">
            {DISPLAY_SCALE.map((entry) => (
              <div
                key={entry.token}
                className="flex flex-col gap-3 py-8 lg:flex-row lg:items-baseline lg:gap-10"
              >
                <div className="lg:w-64 lg:shrink-0">
                  <p className="font-mono text-meta text-accent uppercase">{entry.token}</p>
                  <p className="mt-1 text-body-sm text-content-tertiary">{entry.note}</p>
                </div>
                <p className={`${entry.token} font-display uppercase`}>{entry.sample}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={4} className="mb-10">
            SKALA TEKSTU
          </SectionLabel>
          <div className="divide-y divide-line">
            {BODY_SCALE.map((entry) => (
              <div
                key={entry.token}
                className="flex flex-col gap-2 py-6 lg:flex-row lg:items-baseline lg:gap-10"
              >
                <p className="font-mono text-meta text-accent uppercase lg:w-64 lg:shrink-0">
                  {entry.token}
                </p>
                <p
                  className={`${entry.token} ${entry.token.startsWith('text-label') || entry.token.startsWith('text-meta') ? 'font-mono' : ''} text-content-secondary`}
                >
                  {entry.sample}
                </p>
                <p className="text-body-sm text-content-tertiary lg:ml-auto">{entry.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={5} className="mb-10">
            PRZYCISKI I PROMIENIE
          </SectionLabel>
          <div className="flex flex-wrap items-center gap-4">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} size="lg">
                {variant}
                <CtaArrow direction="right" />
              </Button>
            ))}
            <ButtonLink href="/" size="lg" variant="secondary">
              Wróć na stronę
              <CtaArrow />
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {RADII.map((radius) => (
              <div key={radius.token} className={`border border-line p-6 ${radius.token}`}>
                <p className="font-mono text-meta text-content uppercase">{radius.token}</p>
                <p className="mt-2 text-body-sm text-content-tertiary">{radius.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="invert" spacing="tight">
        <Container>
          <SectionLabel index={6} tone="invert" className="mb-10">
            JASNA PRZERWA
          </SectionLabel>
          <p className="max-w-measure text-body-lg">
            Sekcja Proces odwraca kolorystykę. To jedyne miejsce, w którym tło jest jasne — zmiana
            rytmu ma być zauważalna.
          </p>
          <p className="mt-4 text-body text-content-invert-secondary">
            Tekst pomocniczy w wariancie odwróconym.
          </p>
          <p className="mt-2 text-body-sm text-content-invert-tertiary">
            Metadata w wariancie odwróconym.
          </p>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <SectionLabel index={7} className="mb-10">
            LICZBY I WORDMARK
          </SectionLabel>
          <dl className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {[
              { value: 350, suffix: '+', decimals: 0, label: 'zrealizowanych samochodów' },
              { value: 4.9, suffix: '', decimals: 1, label: 'średnia ocen klientów' },
              { value: 5, suffix: '', decimals: 0, label: 'lat doświadczenia' },
              { value: 100, suffix: '%', decimals: 0, label: 'indywidualnego podejścia' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    className="block font-display text-numeric text-accent"
                  />
                  <span className="mt-3 block font-mono text-meta text-content-tertiary uppercase">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 flex flex-wrap items-baseline gap-10">
            <Wordmark className="text-display-project" />
            <Wordmark className="text-display-card text-accent" />
            <p className="text-body-sm text-content-tertiary">
              Logotyp z dostarczonego SVG. Litery to <code>currentColor</code>, więc mark działa na
              ciemnym i jasnym tle bez drugiego pliku; dwa kliny biorą <code>--color-accent</code>.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="tight" className="border-t border-line">
        <Container>
          <SectionLabel index={8} className="mb-10">
            MOTION
          </SectionLabel>
          <Reveal className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-meta text-content-tertiary uppercase">
                Czas trwania (s)
              </p>
              <ul className="space-y-2 text-body-sm">
                {Object.entries(DURATION).map(([name, seconds]) => (
                  <li key={name} className="flex justify-between border-b border-line pb-2">
                    <span className="font-mono">{name}</span>
                    <span className="text-content-tertiary">{seconds}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-meta text-content-tertiary uppercase">Easing</p>
              <ul className="space-y-2 text-body-sm">
                {Object.entries(EASE).map(([name, bezier]) => (
                  <li key={name} className="flex justify-between gap-6 border-b border-line pb-2">
                    <span className="font-mono">{name}</span>
                    <span className="font-mono text-content-tertiary">
                      cubic-bezier({bezier.join(', ')})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <p className="mt-12 font-display text-display-project">{formatPriceFrom(1600)}</p>
          <p className="mt-3 text-body-sm text-content-tertiary">
            Ceny zawsze przez <code>formatPriceFrom()</code> — spacje nierozdzielające i brak
            groszy.
          </p>
        </Container>
      </Section>
    </>
  )
}
