# VANTA Auto Detailing

Strona wizerunkowo-sprzedażowa studia detailingu premium. Jedna strona, kilkanaście sekcji,
formularz wyceny krokowy, interaktywny slider before/after, motion design.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion for React · GSAP + ScrollTrigger · Zod · Vitest

## Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

- `http://localhost:3000` — strona
- `http://localhost:3000/system` — referencja design systemu (tokeny, primitives, motion)

## Polecenia

| Polecenie                           | Opis                                          |
| ----------------------------------- | --------------------------------------------- |
| `pnpm dev`                          | serwer developerski (Turbopack)               |
| `pnpm build`                        | build produkcyjny                             |
| `pnpm start`                        | serwer produkcyjny                            |
| `pnpm check`                        | format + lint + typy + testy — bramka jakości |
| `pnpm test` / `pnpm test:watch`     | testy jednostkowe                             |
| `pnpm test:coverage`                | pokrycie z progami                            |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                                        |
| `pnpm format` / `pnpm format:check` | Prettier                                      |
| `pnpm typecheck`                    | `tsc --noEmit`                                |

## Struktura

```
.agents/            kontrakt projektu: brief, design system, architektura, zasady, ADR-y
src/
  app/              routing, metadane, pliki konwencji Next
  components/
    layout/         Navbar, Footer, MobileMenu, MobileStickyCta
    sections/       sekcje strony
    ui/             primitives bez wiedzy o domenie
    motion/         primitives animacyjne (klienckie)
  hooks/            hooki wielokrotnego użytku
  lib/              motion (tokeny, warianty, GSAP), seo, utils, validation
  data/             treść jako typowane obiekty TypeScript
  server/lead/      Server Action formularza + warstwa dostarczania
  styles/           globals, theme (tokeny), base, utilities
public/images/      zdjęcia
```

## Dokumentacja

Cała wiedza projektowa jest w [`.agents/`](.agents/README.md) — brief, identyfikacja wizualna,
system stylów, architektura, praktyki kodowania, system animacji, podejście do testów,
dostępność i wydajność, zasady copy, checklisty i decyzje architektoniczne.

Zaczynając pracę (człowiek albo AI), przeczytaj [`.agents/README.md`](.agents/README.md).

## Stan projektu

Gotowe: tooling i bramka jakości, design system (tokeny + primitives), primitives animacyjne,
walidacja i backend formularza, SEO (metadane, robots, sitemap, manifest), strona `/system`.

Do zrobienia: sekcje strony (`src/components/sections/`), assety fotograficzne,
podłączenie dostawcy e-mail dla formularza ([ADR-0002](.agents/decisions/0002-lead-delivery.md)).
