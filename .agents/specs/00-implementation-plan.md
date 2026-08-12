# 00 — Plan implementacji

Źródło prawdy dla layoutu: wireframe desktop 1440 × 900 przekazany 2026-08-12.
Kolejność etapów zgodna z §21 wireframe'u — **nie zaczynamy od GSAP, dopóki nie stoi cały layout.**

## Etapy

| Etap | Zakres                                                                  | Status       |
| ---- | ----------------------------------------------------------------------- | ------------ |
| 1    | Cały statyczny layout, 13 sekcji, bez motion                            | **zrobione** |
| 2    | Responsive images + typografia                                          | **zrobione** |
| 3    | Lead configurator (3 kroki, walidacja, success state)                   | **zrobione** |
| 4    | Before / After — drag slider                                            | **zrobione** |
| 5    | Motion reveals (Motion for React)                                       | częściowo    |
| 6    | GSAP: manifesto scroll-lit, process timeline progress                   | **zrobione** |
| 7    | Hover interactions: floating images w usługach, cursor `VIEW` w galerii | **zrobione** |
| 8    | Final polish: sticky mobile CTA, hero timeline, text reveal liniami     | do zrobienia |

## Runda poprawek po design review (2026-08-12)

Review wskazał, że projekt był „pomiędzy dobrym dark landing page'em a stroną premium automotive",
i że najwięcej traci na spójności fotografii, rytmie sekcji, sticky navbarze i hierarchii typografii.

**Layout i precyzja**

- Sticky navbar wyśrodkowany na **viewporcie** (`left-1/2` + `-translate-x-1/2`, max 1480 px), nie na
  kontenerze treści. To był najbardziej widoczny błąd layoutu — logo przeskakiwało o setki pikseli.
- Navbar jako szkło, nie karta UI: `bg-canvas/76`, hairline `.08`, `blur(20px)`, 88 → 66 px.

**System stylów**

- Pięć stopni typografii display zamiast jednego rozmiaru dla wszystkiego. Nagłówki sekcji są teraz
  mniejsze od manifesta, a manifesto mniejsze od hero.
- Cztery stopnie szarości zamiast biały → szary → neon.
- Tekst pomocniczy nie schodzi poniżej 15 px; 12 px tylko dla metadanych.
- Akcent przygaszony `#C7FF38` → `#C3F53B`. Ceny neutralne w spoczynku, zielone na hover.
- Jeden system promieni 10 / 14 / 18 px. Pięciostopniowy, przeplatany rytm sekcji.

**Nowe interakcje**

- Manifesto: rozjaśnianie słów scrollem (GSAP ScrollTrigger).
- Services: floating preview 320 × 220 dryfujący ±24 px ze sprężyną, cały row klikalny.
- Selected Work: parallax 30/45/25/60 px per zdjęcie, zoom 1 → 1.03, cursor `VIEW` 72 px.
- Process: linia wypełniana scrollem, punkty aktywowane po kolei.
- Before/After: handle 52 px z `← →`, jednorazowa podpowiedź 50 → 60 → 50 %.
- Inline CTA po galerii — wcześniej między hero a formularzem nie było CTA w treści.

**Detale**

- Wordmark z pochylonym wiodącym `V`.
- `devIndicators: false` — badge Next.js nie trafia już na zrzuty.
- Process w cieplejszym `#ECEAE4`, nagłówek skrócony do trzech linii, copy skrócone.

## Mapa sekcji

Kolejność na stronie i rytm wizualny (§16 wireframe'u — nigdy pięć ciemnych sekcji z rzędu):

| #   | Sekcja             | Tonacja                      | Rytm             | Wysokość docelowa |
| --- | ------------------ | ---------------------------- | ---------------- | ----------------- |
| —   | `Navbar`           | transparent → floating glass | —                | 88 → 66 px        |
| —   | `Hero`             | dark, full-bleed foto        | cinematic        | 100svh            |
| 01  | `Manifesto`        | dark, typografia             | minimalistyczny  | ~900 px           |
| 02  | `Services`         | dark, lista rows             | informacyjny     | ~1000 px          |
| 03  | `BeforeAfter`      | `surface` (#121212)          | interaktywny     | ~1100 px          |
| 04  | `SelectedWork`     | dark, editorial grid         | fotograficzny    | ~2400 px          |
| —   | `InlineCta`        | dark, jedna linia            | konwersja        | ~200 px           |
| 05  | `Process`          | **jasna** (`canvas-invert`)  | jasny break      | ~900 px           |
| 06  | `Stats`            | dark, typografia             | liczby           | ~900 px           |
| 07  | `Pricing`          | dark, 3 karty                | sprzedaż         | ~1000 px          |
| 08  | `Testimonials`     | dark, slider                 | opinie           | ~750 px           |
| 09  | `LeadConfigurator` | dark, split screen           | lead             | ~950 px           |
| —   | `FinalCTA`         | dark, full-bleed foto        | cinematic finish | ~800 px           |
| —   | `Footer`           | `canvas-deep` (#080808)      | domknięcie       | ~450 px           |

Numeracja etykiet (`01 / …`) liczy tylko sekcje treściowe — Navbar, Hero, FinalCTA i Footer jej nie mają.
Nie zgadza się z numeracją z briefu (tam Hero był bez numeru, a Services miało `02`) — wireframe jest nadrzędny.

## Layout — wartości z wireframe'u

- Container: **1280 px**, powyżej 1600 px → **1440 px** (`max-w-shell`, `3xl:max-w-wide`).
- Grid: **12 kolumn, gap 24 px** (`grid-cols-12 gap-6`). Proporcje 4/8, 5/7, 6/6, 3/3/3/3.
- Padding sekcji: **pięciostopniowy i przeplatany** — 200 / 180 / 140 / 120 / 100 px.
  Wartości i przypisanie do sekcji: `.agents/02-design-system.md`.
- Navbar: **88 px**, po ~80 px scrolla floating panel **66 px**, wyśrodkowany na viewporcie,
  max **1480 px** — czyli szerszy niż kontener treści, dlatego oś logo prawie się nie rusza.

## Zdjęcia

12 plików w `public/images/`, wszystkie Unsplash na wolnej licencji.
Atrybucje: `public/images/CREDITS.json`. Pobrane skryptem, płatne Unsplash+ odrzucane twardo.

| Slot           | Zdjęcie                                                                   | Uwaga                                                                                  |
| -------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Hero           | `hero-mercedes-cls.jpg`                                                   | Mercedes CLS, światło krawędziowe, ogromna czerń na typografię                         |
| Services 01–04 | `service-*.jpg`                                                           | polerowanie, hydrofobowość, skóra, całe auto w garażu                                  |
| Before/After   | `before-after-paint.jpg`                                                  | **makro lakieru** — na całym aucie „przed" czyta się tylko jako ciemniejsza ekspozycja |
| Selected Work  | `work-porsche-911` (2:1), `work-amg-studio` (16:9), `work-maserati` (3:2) | trzy realizacje w jednym języku fotograficznym                                         |
| Zamknięcie     | `work-alpine-a110` (2:3)                                                  | editorial przerywnik „THE FINISH", nie case study                                      |
| Final CTA      | `final-cta-bmw-m3-fog.jpg`                                                | BMW M3 we mgle, reflektory — cinematic finish                                          |
| OG             | `og-default.jpg`                                                          | kadr 1200 × 630 z hero                                                                 |

### Wymienione po review

Review słusznie wskazał, że cztery realizacje wyglądały „jakby pochodziły z czterech różnych stron":

- **BMW M3** — nocny parking, pachołek, brak detalu lakieru. Usunięte.
- **Audi RS3** — jasne niebo i jezioro zajmujące pół kadru na czarnej stronie. Usunięte.
- **AMG GT Black Series** — tło targowe (drzwi, wykładzina). Usunięte, zastąpione studyjnym AMG.

Nowe kadry są w jednym języku: ciemne studio albo salon, kontrolowane światło, refleksy na lakierze,
głęboka czerń. Nazwy realizacji nadal zgodne z tym, co faktycznie jest na zdjęciu.

### Before / After — ważne ograniczenie

**Nie mamy prawdziwej pary przed/po.** Wolne banki zdjęć jej nie oferują.
Slider pokazuje **to samo zdjęcie** po obu stronach; strona „przed" jest przetworzona filtrem CSS
(desaturacja, obniżony kontrast, delikatne rozmycie), żeby zademonstrować **mechanikę** interakcji.

To jest symulacja, nie efekt pracy studia. Zanim strona pójdzie gdziekolwiek publicznie,
trzeba podmienić na realną parę zdjęć. Oznaczone komentarzem w `before-after-slider.tsx`.

## Dane

Treść wyłącznie z briefu i wireframe'u, w `src/data/`:
`services.ts`, `case-study.ts`, `projects.ts`, `process.ts`, `stats.ts`, `pricing.ts`, `testimonials.ts`.

Nazwy samochodów w galerii dopasowane do **faktycznej treści zdjęć** (Audi RS3, Alpine A110),
a nie do listy z briefu (RS5, Cupra, Tesla) — portfolio nie może kłamać o tym, co jest na zdjęciu.

## Co zostało do zrobienia w etapach 5–8

- `Manifesto`: rozjaśnianie słów scrollem (GSAP ScrollTrigger, `content-dim` → `content`).
- `Process`: wypełniająca się linia + kolejne aktywacje punktów.
- `Services`: floating image przy kursorze (desktop + fine pointer).
- `SelectedWork`: parallax 30–50 px, zoom `1 → 1.04`, cursor `VIEW`.
- `Hero`: `scale 1.08 → 1`, nagłówek liniami z maski, stagger CTA, navbar na końcu.
- `Stats`: count-up (primitive `AnimatedCounter` już istnieje, nie jest jeszcze podłączony).
- `Testimonials`: przejścia slajdów.
- `MobileStickyCta`: pasek po minięciu hero, znikający przy formularzu.
- Wielkie `VANTA` w stopce, przycięte dolną krawędzią, opacity 0.05–0.08.
