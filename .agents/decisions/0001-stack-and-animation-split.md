# ADR-0001 — Stack technologiczny i podział odpowiedzialności animacji

- **Status:** Accepted — część dotycząca Lenis zastąpiona przez [ADR-0004](0004-drop-lenis.md)
- **Data:** 2026-08-11

## Kontekst

Projekt jest jednostronicową stroną wizerunkowo-sprzedażową z rozbudowanym motion designem
i jednym formularzem leadowym. Nie ma logowania, CMS-a ani bazy danych.

Ryzyko projektu nie leży w złożoności domeny, ale w tym, że łatwo tu zbudować „demo pięciu bibliotek animacyjnych”:
niespójne easingi, dublujące się mechanizmy scrollowe, animacje walczące ze sobą o te same właściwości CSS.

## Decyzja

Stack jest zamknięty:

| Warstwa                        | Wybór                                  |
| ------------------------------ | -------------------------------------- |
| Framework                      | Next.js 16, App Router                 |
| Język                          | TypeScript, `strict` + dodatkowe flagi |
| Styl                           | Tailwind CSS 4, tokeny w `@theme`      |
| Animacje UI                    | Motion for React (`motion/react`)      |
| Animacje scrollowe / sekwencje | GSAP + ScrollTrigger                   |
| Smooth scroll                  | Lenis (opcjonalny)                     |
| Walidacja                      | Zod (współdzielona klient ↔ serwer)    |
| Testy                          | Vitest + React Testing Library         |
| Package manager                | pnpm                                   |

Podział odpowiedzialności animacji jest **wiążący**:

- **Motion** — ~70–80% animacji. Wszystko, co jest przejściem między stanami: hover, reveal, stagger,
  kroki formularza, `AnimatePresence`, animacje layoutu, gesty.
- **GSAP + ScrollTrigger** — sekwencje i efekty sterowane pozycją scrolla: timeline hero,
  scroll-driven manifesto, sekcje pinned, nietypowy parallax.
- **Lenis** — wyłącznie globalny smooth scroll, z niską inercją. Nie prowadzi żadnej animacji.

GSAP nie obsługuje hovera. Motion nie obsługuje pinowania sekcji. Lenis nie animuje elementów.

Dodatkowo:

- GSAP i ScrollTrigger importujemy przez `@/lib/motion/gsap`, gdzie odbywa się jednorazowa rejestracja pluginów.
- Lenis działa z `autoRaf: false`; pętlę klatek prowadzi ticker GSAP, żeby oba systemy chodziły na jednym zegarze.
- Wszystkie czasy i easingi pochodzą z `src/lib/motion/tokens.ts` (JS) i `src/styles/theme.css` (CSS).

## Konsekwencje

Dobre:

- Jeden powód, dla którego coś jest animowane tym, a nie innym narzędziem. Przegląd kodu staje się rozstrzygalny.
- Spójny timing na całej stronie, bo tokeny są jedynym źródłem wartości.
- Lenis da się usunąć bez ruszania sekcji, jeżeli native scroll wystarczy.

Kosztowne:

- Skala czasu i easingów jest zdublowana (CSS ↔ JS). Tailwind potrzebuje custom properties, Motion i GSAP liczb.
  Przyjmujemy koszt ręcznej synchronizacji dwóch plików; jest udokumentowany w obu.
- Dwie biblioteki animacyjne w bundlu. Ograniczamy to przez `optimizePackageImports` i utrzymanie sekcji
  jako Server Components.

## Rozważone alternatywy

**Tylko Motion.** Odrzucone: scroll-driven text reveal i sekcje pinned wymagają timeline'ów i normalizacji
progresu scrolla, w czym ScrollTrigger jest wyraźnie mocniejszy.

**Tylko GSAP.** Odrzucone: animacje wejścia/wyjścia elementów odmontowywanych z drzewa Reacta
(`AnimatePresence`, kroki formularza) i animacje layoutu są w Reakcie naturalną domeną Motion.

**Rezygnacja z Lenis.** Nadal możliwa i zapisana jako dopuszczalna. Wrapper jest odizolowany właśnie po to.

**CSS Modules / styled-components.** Odrzucone: przy tokenach w `@theme` i sortowaniu klas przez Prettiera
Tailwind daje mniejszy narzut i lepszą spójność.
