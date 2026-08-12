# VANTA Auto Detailing

Dwujęzyczna strona wizerunkowo-sprzedażowa fikcyjnego studia detailingu premium.
Jedna strona, trzynaście sekcji, krokowy formularz wyceny, drawer z cennikiem, przeciągany
slider before/after, galeria z lightboxem i motion design.

Projekt portfolio. Studio nie istnieje, dane kontaktowe i opinie są fikcyjne.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion for React · GSAP + ScrollTrigger · Zod · Vitest

## Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

- `http://localhost:3000/pl` — wersja polska (`/` przekierowuje wg `Accept-Language`)
- `http://localhost:3000/en` — wersja angielska
- `http://localhost:3000/pl/system` — referencja design systemu (tokeny, primitives, motion)

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
.agents/              kontrakt projektu: brief, design system, architektura, zasady, ADR-y
src/
  app/[locale]/       routing per język, root layout, metadane
  components/
    layout/           Navbar, Footer, przełącznik języka
    sections/         sekcje strony + ich wyspy interaktywności
    ui/               primitives bez wiedzy o domenie (w tym Overlay dla modali)
    motion/           primitives animacyjne (klienckie)
    lead/             kontekst przenoszący wybór usługi do formularza
  hooks/              hooki wielokrotnego użytku
  i18n/               konfiguracja locale, słowniki pl/en, dostęp serwerowy
  lib/                motion (tokeny, warianty, GSAP), seo, utils, validation
  data/               liczby, slugi, ścieżki do zdjęć — bez tekstów
  server/lead/        Server Action formularza + warstwa dostarczania
  styles/             globals, theme (tokeny), base, utilities
  proxy.ts            przekierowanie na prefiks języka
public/images/        zdjęcia + CREDITS.json z atrybucjami
```

## Dokumentacja

Cała wiedza projektowa jest w [`.agents/`](.agents/README.md) — brief, identyfikacja wizualna,
system stylów, architektura, praktyki kodowania, system animacji, podejście do testów,
dostępność i wydajność, zasady copy, checklisty i decyzje architektoniczne (ADR).

Zaczynając pracę — człowiek albo AI — przeczytaj [`.agents/README.md`](.agents/README.md).

## Zdjęcia

13 plików w `public/images/`, razem ~930 kB. Jedenaście z Unsplash na wolnej licencji, dwa
(para przed/po) dostarczone przez właściciela repo. Atrybucje i licencje w
[`public/images/CREDITS.json`](public/images/CREDITS.json).

```bash
pnpm images:prepare
```

Jednorazowe narzędzie (nie wchodzi do CI): przekodowuje zdjęcia do największego rozmiaru, jaki
layout potrafi wyświetlić, i regeneruje `src/lib/images/blur.ts` — podglądy 16 px jako
`placeholder="blur"`. Pierwszy przebieg dał **2431 kB → 881 kB (−64 %)**. Szczegóły i progi:
[ADR-0006](.agents/decisions/0006-sharp-for-asset-preparation.md).

### Sekcja Transformation

Slider porównuje **dwa niezależne zdjęcia** — obecnie prawdziwą parę tego samego boku Porsche
przed i po korekcie. Symulacja (przygaszenie lewej połowy filtrem CSS) włącza się wyłącznie
wtedy, gdy `beforeImage` i `afterImage` wskazują ten sam plik. Podmiana na inną parę:

1. dwa pliki do `public/images/`,
2. `beforeImage` i `afterImage` w `src/data/case-study.ts`,
3. `beforeAfter.car`, `scope`, `imageAlt`, `beforeAlt` w `src/i18n/dictionaries/{pl,en}.ts`,
4. `pnpm images:prepare`.

## Deployment

Vercel, plan Hobby. Push do `main` → deploy produkcyjny, pull request → deploy preview.

| Zmienna                   | Wymagana | Po co                                |
| ------------------------- | -------- | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`    | tak      | `metadataBase`, sitemap, Open Graph  |
| `LEAD_NOTIFICATION_EMAIL` | nie      | adres odbiorcy zgłoszeń z formularza |
| `RESEND_API_KEY`          | nie      | dostawca e-mail                      |

Bez `NEXT_PUBLIC_SITE_URL` metadane wskazują na `localhost:3000`, więc podlinkowanie strony
daje zły preview. Bez dwóch pozostałych formularz działa i loguje zgłoszenia po stronie
serwera — patrz [ADR-0002](.agents/decisions/0002-lead-delivery.md).

## Stan projektu

Gotowe: tooling i bramka jakości (122 testy), design system, wszystkie sekcje, dwujęzyczność
(oba języki prerenderowane statycznie), drawer usług z cennikiem, przenoszenie wyboru do
formularza, SEO (metadane per locale, `hreflang`, robots, sitemap, manifest, favicon).

Do zrobienia: cinematic entrance hero i text reveal liniami, sticky CTA na mobile,
editorial motion w opiniach, podłączenie dostawcy e-mail. Szczegóły:
[`.agents/specs/00-implementation-plan.md`](.agents/specs/00-implementation-plan.md).
