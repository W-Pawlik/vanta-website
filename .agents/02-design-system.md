# 02 — System stylów

## Jak stylujemy

**Tailwind CSS v4, utility-first, bez wyjątków.**

Kolejność wyboru narzędzia — pierwsze, które wystarczy:

1. Utility Tailwinda oparte na tokenie (`bg-surface`, `text-display-lg`, `py-section`).
2. Istniejący primitive z `src/components/ui/`.
3. Nowy token w `src/styles/theme.css`, potem punkt 1.
4. Custom utility w `src/styles/utilities.css` — tylko jeżeli Tailwind fizycznie nie potrafi tego wyrazić.
5. Styl inline (`style={{ ... }}`) — **tylko** dla wartości wyliczanych w runtime (pozycja parallaxu, wartość progressu, kolor z danych).

Czego nie robimy:
CSS Modules, styled-components / emotion, plików `.css` per komponent, `!important`,
arbitrary values z surową liczbą tam, gdzie istnieje token (`text-[132px]` zamiast `text-display-xl`).

## Gdzie co leży

| Plik                       | Zawartość                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `src/styles/globals.css`   | Punkt wejścia. Import Tailwinda, `@source`, import pozostałych plików. Importowany wyłącznie w `src/app/layout.tsx`. |
| `src/styles/theme.css`     | **Wszystkie tokeny.** Kolor, typografia, layout, promienie, easing.                                                  |
| `src/styles/base.css`      | Wyłącznie domyślne dla dokumentu: `html`, `body`, nagłówki, focus, selection, reduced motion. Skala `--duration-*`.  |
| `src/styles/utilities.css` | Custom utilities (`bleed`, `no-scrollbar`, `mask-row`).                                                              |

## Tokeny

Tokeny są **jedynym źródłem prawdy** dla wartości wizualnych. Komponent nie zawiera hexów, pikselowych rozmiarów typografii ani krzywych bezier.

### Powierzchnie

```
canvas  canvas-warm  canvas-deep  surface  surface-raised  canvas-invert
line  line-strong  line-invert  line-invert-strong
```

`line` = `rgba(255,255,255,.08)`, na hover `line-strong` = `.15`. Na jasnym tle `line-invert` = `rgba(0,0,0,.10)`.

### Hierarchia tekstu — cztery stopnie, nie dwa

```
content            #F2F2EE           nagłówki, treść krytyczna
content-secondary  rgba(…,.68)       tekst akapitowy — DOMYŚLNY dla prozy
content-tertiary   rgba(…,.42)       metadata, etykiety, podpisy
content-ghost      rgba(…,.16)       wyłącznie dekoracja i separatory
content-dim        #292929           stan spoczynkowy tekstu rozjaśnianego scrollem
```

Bez środkowych stopni każdy tekst czyta się albo jak nagłówek, albo jak `disabled`.
`content-dim` **nie jest kolorem tekstu do czytania** ani koloru placeholdera — to stan animacji.

Odpowiedniki na jasnym tle: `content-invert`, `content-invert-secondary`, `content-invert-tertiary`.

### Akcent

`accent` = `#C3F53B`. Świadomie przygaszony względem czystego neonu — ma być kontrolką w samochodzie
sportowym, nie markerem fluorescencyjnym.

Reguła: **maksymalnie jeden element w akcencie na widok** (poza CTA w navbarze).
Akcent nie jest domyślnym kolorem informacji — ceny w Usługach są neutralne w spoczynku i dopiero
na hover stają się zielone. Inaczej akcent traci wartość.

### Typografia display — pięć stopni

```
text-display-hero        104 px @1440   hero
text-display-statement    88 px         manifesto, duże stwierdzenia
text-display-section      70 px         nagłówek sekcji
text-display-project      34 px         nazwa realizacji, case study
text-display-card         30 px         nazwa karty, legenda formularza
text-numeric             110 px         liczby w Stats
text-quote                56 px         cytat z opinii
```

Kluczowa zasada: **nagłówek sekcji jest mniejszy od stwierdzenia, a stwierdzenie od hero.**
Kiedy każdy duży napis ma ten sam rozmiar, żaden nie ma siły.

Tracking zacieśnia się wraz z rozmiarem (`-0.055em` w hero → `-0.025em` w karcie), a `line-height`
schodzi do `0.88`, żeby wielka typografia czytała się jak jeden blok graficzny.

### Typografia tekstu

```
text-body-lg   18 px   lead
text-body      16 px   tekst akapitowy, line-height 1.6
text-body-sm   15 px   tekst pomocniczy — NIŻEJ NIE SCHODZIMY
text-label     13 px   mono eyebrow, etykieta pola
text-meta      12 px   jedyny stopień pod 15 px, wyłącznie metadata
```

Każdy token `text-*` niesie ze sobą `line-height`, `letter-spacing` i `font-weight`.
Nadpisujemy je tylko wtedy, gdy jest ku temu konkretny powód projektowy.

### Layout i rytm

```
max-w-shell     1280px (1440px powyżej 1600px), główna kolumna treści
max-w-measure   ~610px, maksymalna długość linii tekstu
px-gutter       boczny margines (płynny)
```

Pionowy rytm ma **pięć** stopni i jest celowo przeplatany — rytm jest ważniejszy niż konsekwencja
jednej wartości. Pięć sekcji z rzędu po 180 px robi stronę zbyt długą i monotonną.

```
py-section-xl      200px   manifesto (jedyna sekcja, która to uzasadnia)
py-section-lg      180px   Services, Selected Work, Pricing
py-section         140px   Process, Stats, Lead
py-section-sm      120px   Before/After (skraca martwy odstęp po Services)
py-section-tight   100px   Testimonials, inline CTA
```

### Promienie — jeden system, ostrzejszy niż domyślny

```
rounded-control   10px   przyciski, inputy
rounded-image     14px   kadry zdjęć
rounded-panel     18px   duże panele, sticky navbar
rounded-full             wyłącznie metadata badges i okrągłe kontrolki
```

Nie każdy element musi mieć 20+ px. Automotive performance czyta się z ostrzejszą geometrią.

### Motion

```
ease-out-expo  ease-out-quint  ease-out-quart  ease-in-out-quart
--duration-instant … --duration-hero   (CSS: duration-[var(--duration-base)])
```

Skala czasu i easingów jest **zdublowana**: CSS w `theme.css` / `base.css`, JS w `src/lib/motion/tokens.ts`.
Zmiana w jednym miejscu wymaga zmiany w drugim. To świadomy koszt — Tailwind potrzebuje custom properties, Motion i GSAP potrzebują liczb.

## Primitives UI

W `src/components/ui/`. Nie duplikuj ich lokalnie w sekcji.

| Komponent              | Odpowiedzialność                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `Container`            | Pozioma rama treści. `width="shell"` albo `"measure"`.                                           |
| `Section`              | Pionowy rytm i tonacja sekcji. `tone`, `spacing`, `id`. Ustawia `isolate`.                       |
| `SectionLabel`         | Etykieta mono `01 / THE STANDARD`. `orientation="vertical"` łamie rytm label → nagłówek.         |
| `Headline`             | Wieloliniowy nagłówek display. Linie podajemy jawnie, **bez** `max-w`.                           |
| `SectionHeader`        | Standardowy otwieracz sekcji. Nie każda sekcja go używa — patrz niżej.                           |
| `Button`, `ButtonLink` | CTA. `Button` = akcja, `ButtonLink` = nawigacja. Warianty `primary` / `secondary` / `quiet`.     |
| `CtaArrow`             | Strzałka przy CTA. Przesuwa się o 4 px na hover rodzica; przycisk się nie skaluje.               |
| `Wordmark`             | Logotyp VANTA z SVG. `fit="type"` skaluje wysokością fontu, `fit="block"` szerokością kontenera. |
| `StarRating`           | Gwiazdki z tekstowym odpowiednikiem dla czytników.                                               |

### Nie każda sekcja ma tę samą kompozycję

`SectionHeader` (label → wielki nagłówek → tekst po prawej) jest domyślny, ale **Selected Work**
i **Process** świadomie go łamią: w galerii `04` biegnie pionowo przy marginesie, w Procesie
`05 / PROCESS` stoi przy timeline. System numeracji zostaje, przewidywalność znika.

Dodając kolejną sekcję, zastanów się, czy nie powinna złamać tego wzorca — pięć sekcji z rzędu
w identycznym układzie wygląda jak template.

Zasady:

- Primitive przyjmuje `className` i przekazuje go **na koniec** do `cn()`, żeby wywołujący mógł nadpisać utility.
- Primitive nie zna kontekstu, w którym jest użyty. Brak propsów typu `isInHero`.
- Wariant to zamknięty union + mapa klas (`Record<Variant, string>`), nigdy sklejanie stringów warunkami.
- Nie dodajemy propsa, który ma jedno użycie. Wtedy wystarczy `className`.

## `cn()`

Zawsze łączymy klasy przez `cn()` z `src/lib/utils/cn.ts` (clsx + tailwind-merge).

`tailwind-merge` musi wiedzieć o naszych skalach — inaczej `text-display-lg` i `text-accent` trafiają do jednej grupy
i jedna z klas jest **po cichu usuwana**. Listy grup są w `cn.ts` i muszą być zgodne z `theme.css`.
Dodajesz token `text-*` → dopisz go do odpowiedniej listy w `cn.ts` i dodaj test.

## Warstwy i stacking

`Section` ustawia `isolate`, żeby parallax albo przypięty element nie mógł zamalować sąsiedniej
sekcji. Konsekwencja, o którą łatwo się potknąć:

> **Każdy overlay renderowany wewnątrz sekcji musi iść portalem do `document.body`.**

Wewnątrz sekcji `z-index` jest liczony w jej własnym kontekście stackingowym, więc `z-100`
oznacza „setka wewnątrz tej sekcji”, a cała sekcja nadal leży pod navbarem z `z-50`.
Dokładnie tak drawer usług wjechał pod nawigację: przycisk zamknięcia był zasłonięty, navbar
zostawał klikalny, a klik w kotwicę przewijał stronę przy zablokowanym scrollu.

Dlatego modale używają `Overlay` z `src/components/ui/overlay.tsx`. Nie buduj drugiego
backdropu ręcznie — dostajesz z niego portal, przygaszenie tła, blokadę scrolla, Escape,
klik poza panelem i pułapkę focusu.

Skala warstw: navbar `z-50`, overlaye `z-100`, skip link `z-100` przy focusie.

## Full-bleed

Zdjęcia mogą wychodzić do krawędzi viewportu. Dwie drogi:

1. Element **poza** `Container` — najprostsze i preferowane.
2. Utility `bleed` — gdy element musi zostać w drzewie kontenera.

`body` ma `overflow-x: clip`. Poziomy scrollbar to **zawsze błąd** — przycinaj we własnym kontenerze, nie licz na dokument.

## Strona `/system`

`src/app/system/page.tsx` to żywa referencja design systemu.
Wyłączona z indeksowania i z sitemapy, ale to najszybszy sposób obejrzenia tokenów i primitives w przeglądarce.

**Dodajesz token albo primitive → dodajesz go na `/system`.** To część definicji ukończenia zadania.

## Weryfikacja

Tailwind nie zgłasza błędu, gdy klasa nie istnieje — po prostu nic nie generuje.
Po dodaniu tokena sprawdź, że utility naprawdę powstało: `pnpm build`, potem szukaj klasy w `.next/static/chunks/*.css`.
Utility z `@utility` powstaje tylko wtedy, gdy klasa jest gdzieś użyta.
