# 03 — Architektura kodu

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion for React · GSAP + ScrollTrigger · Zod · Vitest

Scroll jest natywny — bez biblioteki smooth-scroll ([ADR-0004](decisions/0004-drop-lenis.md)).

Stack jest **zamknięty** — patrz [ADR-0001](decisions/0001-stack-and-animation-split.md).
Nowa zależność wymaga nowego ADR i zgody właściciela repo.

## Struktura katalogów

```
src/
  app/                    routing, metadane, pliki konwencji Next
  app/[locale]/           każdy route żyje pod segmentem locale
    layout.tsx            root layout: fonty, CSS, Navbar, skip link, <main>, Footer
    page.tsx              strona główna — płaska lista sekcji
    system/page.tsx       wewnętrzna referencja design systemu
    error.tsx             route error boundary
    not-found.tsx
    robots.ts  sitemap.ts  manifest.ts

  components/
    layout/               Navbar, Footer, MobileMenu, MobileStickyCta
    sections/             jedna sekcja strony = jeden plik
    ui/                   primitives bez wiedzy o domenie
    motion/               primitives animacyjne (klienckie)

  hooks/                  hooki wielokrotnego użytku
  lib/
    motion/               tokeny, warianty, rejestracja GSAP
    seo/                  budowa metadanych
    utils/                cn, formatowanie
    validation/           schematy Zod (współdzielone klient ↔ serwer)
  data/                   liczby, slugi, ścieżki do zdjęć — BEZ tekstów
  i18n/                   config, słowniki (pl/en), dostęp serwerowy
  server/
    lead/                 Server Action formularza + warstwa dostarczania
  styles/                 globals, theme, base, utilities
```

## Reguły struktury

- **Brak plików barrel** (`index.ts` re-eksportujących). Importujemy bezpośrednio z pliku.
  Powód: czytelny graf zależności, brak cykli, brak przypadkowego wciągania klienckiego kodu do serwerowego.
- **Jeden komponent na plik**, nazwa pliku `kebab-case`, nazwa komponentu `PascalCase`.
- Komponent używany **tylko** w jednej sekcji zostaje w pliku tej sekcji albo w katalogu tej sekcji.
  Do `ui/` awansuje dopiero, gdy ma drugie użycie.
- Import przez alias `@/*`. Ścieżki `../../` są zablokowane lintem (`../` w obrębie folderu jest OK).

## Granica serwer / klient

**Domyślnie wszystko jest Server Component.** `'use client'` to decyzja, którą trzeba uzasadnić.

Nie oznaczamy całej strony jako klienckiej tylko dlatego, że są animacje.

| Warstwa                                            | Typ    | Dlaczego                                          |
| -------------------------------------------------- | ------ | ------------------------------------------------- |
| `app/page.tsx`, sekcje                             | serwer | Statyczny HTML, treść w źródle strony, dobre SEO. |
| `components/ui/*`                                  | serwer | Styl to CSS. Hover działa bez JS.                 |
| `components/motion/*`                              | klient | Hooki Motion, `useRef`, zdarzenia wskaźnika.      |
| `BeforeAfter`, `LeadForm`, `MobileMenu`, `Gallery` | klient | Prawdziwa interaktywność.                         |
| `server/lead/*`                                    | serwer | Server Action + `server-only`.                    |

Wzorzec: **sekcja serwerowa opakowuje mały klientski wyspa-komponent.**
Nagłówek, treść i obrazy renderuje serwer; klient dostaje tylko to, co musi reagować.

Przykład — nie tak:

```tsx
'use client' // cała sekcja kliencka, bo jest jeden slider
export function BeforeAfterSection() { ... }
```

Tak:

```tsx
// server
export function BeforeAfterSection() {
  return (
    <Section id={SECTION_IDS.work}>
      <Container>
        <SectionLabel index={4}>PROOF</SectionLabel>
        <h2 className="font-display text-display-lg">Różnicę najlepiej zobaczyć.</h2>
        <BeforeAfterSlider before={...} after={...} />   {/* jedyny 'use client' */}
      </Container>
    </Section>
  )
}
```

## Dwujęzyczność

Pełna decyzja: [ADR-0005](decisions/0005-i18n-routing-and-dictionaries.md). Minimum, które musisz wiedzieć:

- Każdy route żyje pod `src/app/[locale]/`. Locale to `pl` albo `en`, oba prerenderowane statycznie.
- **Server Component bierze treść przez `getDictionary()` z `@/i18n/server`** — bez przekazywania
  `locale` przez propsy.
- **Komponent kliencki dostaje teksty jako propsy.** `next/root-params` w nim nie działa.
- `@/i18n/dictionaries` jest wolny od importów z Next i może być użyty na kliencie.
  `@/i18n/server` importuje `next/root-params` — import tego modułu z komponentu klienckiego
  **wysadza build**, nawet jeśli funkcja nie zostanie wywołana.
- `pl.ts` definiuje kształt (`type Dictionary = typeof pl`), `en.ts` jest nim typowany.
  Brakujący klucz to błąd kompilacji.

## Dane

`src/data/` trzyma **tylko to, co jest niezależne od języka**: ceny, ścieżki do zdjęć, slugi,
proporcje kadrów, zakresy parallaxu, kolejność. Wszystkie słowa są w słownikach.

- `site.ts` — fakty o marce, kontakt, godziny, social.
- `navigation.ts` — kotwice sekcji (`SECTION_IDS`) i kolejność menu.
- `services.ts` + `price-list.ts` — kategorie z wariantami cenowymi i szczegółowy cennik.
- `pricing.ts` — pakiety. `projects.ts`, `process.ts`, `stats.ts`, `case-study.ts`, `reviews.ts`.
- `lead-mapping.ts` — co dana usługa/pakiet znaczy w języku formularza.

Zasady:

- `as const` + typ wyprowadzony z danych (`(typeof X)[number]`), nie ręcznie pisany interfejs obok.
- Ceny jako liczby (`1600`), nigdy jako sformatowane stringi. Formatowanie robi `formatPriceFrom()`.
- Kotwice sekcji wyłącznie z `SECTION_IDS`. Sekcja renderuje dokładnie ten `id`.
- Zero HTML i zero tekstów widocznych dla użytkownika w danych.
- Klucze, których TypeScript nie sprawdzi (warianty usług, pozycje cennika), pilnuje
  `src/i18n/services-copy.test.ts` — w obie strony.

## Trzy poziomy oferty

Ważne, żeby nie dublować treści między sekcjami. Każdy poziom odpowiada na inne pytanie:

| Poziom             | Gdzie                           | Pytanie klienta                       |
| ------------------ | ------------------------------- | ------------------------------------- |
| Kategorie usług    | sekcja `Services`, 4 wiersze    | „Czym się zajmujecie i od ile?”       |
| Szczegółowy cennik | drawer za „Zobacz pełny cennik” | „Ile kosztuje samo czyszczenie felg?” |
| Pakiety            | sekcja `Pricing`                | „Co zrobić z całym samochodem?”       |

`Full Detail` jest **pakietem**, nie kategorią usługi — trzymanie go w obu miejscach było
źródłem dublowania. Kliknięcie w usługę otwiera jej szczegóły, **nie** przenosi od razu do
formularza; do formularza prowadzi dopiero CTA w drawerze, przekazując wybór przez
`LeadSelectionProvider`.

## Formularz — przepływ

```
LeadForm (client)
  → walidacja kroku schematem Zod (UX)
  → submitLead (Server Action, 'use server')
      → leadSchema.safeParse(FormData)         ← pełna, ponowna walidacja
      → deliverLead(lead)                      ← jedyny efekt uboczny
      → LeadFormState: success | error
  → success state (transformacja karty formularza)
```

Zasady bezpieczeństwa:

- Server Action to **publiczny endpoint POST**. Walidacja po stronie klienta służy wyłącznie UX.
- Serwer nigdy nie ufa danym z klienta i waliduje cały payload jeszcze raz.
- Komunikat błędu dla użytkownika jest ogólny i daje ścieżkę wyjścia (ponów / zadzwoń).
  Szczegóły trafiają do logów serwera, nigdy do przeglądarki.
- Plik `'use server'` może eksportować **wyłącznie funkcje async**. Stałe i typy → `lead-form-state.ts`.
- `deliverLead()` jest jedyną granicą do świata zewnętrznego. Wymiana loga na dostawcę e-mail to zmiana jednego pliku.

## Nazwy plików i symboli

| Element         | Konwencja                 | Przykład                         |
| --------------- | ------------------------- | -------------------------------- |
| Plik komponentu | `kebab-case.tsx`          | `before-after-slider.tsx`        |
| Komponent       | `PascalCase`              | `BeforeAfterSlider`              |
| Hook            | `use-*.ts` / `useX`       | `use-media-query.ts`             |
| Stała modułowa  | `SCREAMING_SNAKE`         | `SECTION_IDS`, `DURATION`        |
| Typ / union     | `PascalCase`              | `LeadFormState`, `ButtonVariant` |
| Test            | `*.test.ts(x)` obok pliku | `button.test.tsx`                |

Kod, identyfikatory i komentarze — **po angielsku**.
Treść widoczna dla użytkownika — w słownikach `pl` i `en`, nigdy w komponencie
(patrz [09-content-and-copy.md](09-content-and-copy.md) i [ADR-0005](decisions/0005-i18n-routing-and-dictionaries.md)).
