# 05 — System animacji

## Zasada nadrzędna

> Nie próbujemy zrobić wszystkiego jedną biblioteką.

Trzy narzędzia, trzy jasno rozdzielone zakresy. Wybór narzędzia nie jest kwestią gustu — jest opisany poniżej.

## Podział odpowiedzialności

### Motion for React — ~70–80% animacji

Import **zawsze** z `motion/react` (`framer-motion` jest zablokowany lintem).

Zakres: hover buttona i karty, reveal komponentów, stagger, kroki formularza, menu mobilne,
accordion, modal, `AnimatePresence`, animacje layoutu, gesty.

### GSAP + ScrollTrigger — sekwencje

Zakres: timeline hero, scroll-driven manifesto, sekcje pinned, złożone sekwencje,
text reveal zależny od pozycji scrolla, nietypowy parallax.

**Nie używamy GSAP do hovera buttona.** Jeżeli efekt da się opisać jako „stan A → stan B”, to jest zadanie dla Motion.

Reguły:

- **GSAP ładujemy leniwie**, przez `loadGsap()` z `@/lib/motion/gsap` — nigdy importem z paczki
  w module scope. Import statyczny wciąga 43 KB gzip na ścieżkę krytyczną każdej wizyty
  ([ADR-0007](decisions/0007-lazy-gsap.md)). Rejestracja pluginów dzieje się tam raz.
- **Nie używamy `useGSAP()`** i nie mamy zależności `@gsap/react` — ten hook importuje GSAP
  statycznie, więc omijałby leniwe ładowanie.
- Cleanup przez `gsap.context()` w `useEffect`: `context.revert()` w funkcji czyszczącej.
  Każdy `ScrollTrigger` musi zostać zabity przy unmount.
- Efekt musi obsłużyć unmount w trakcie pobierania biblioteki — wzorzec z flagą `cancelled`
  jest w `scroll-lit-text.tsx`.
- Przy `prefers-reduced-motion` nie wołamy `loadGsap()` wcale. Nie ma animacji, nie ma pobierania.

### Scroll — natywny, bez biblioteki

**Nie używamy Lenis ani żadnego innego smooth-scrolla.** Decyzja i diagnoza: [ADR-0004](decisions/0004-drop-lenis.md).

- Przewijanie jest natywne. Nie ma kodu między użytkownikiem a scrollem.
- `html { scroll-behavior: smooth }` w `base.css` wygładza tylko skoki do kotwic; przy
  `prefers-reduced-motion` przechodzi w `auto`.
- ScrollTrigger działa z natywnym scrollem bez `scrollerProxy` i bez dzielenia zegara.
- Nie dodawaj biblioteki smooth-scroll bez nowego ADR. Warunki, które trzeba wtedy spełnić,
  są wypisane w ADR-0004.

## Primitives animacyjne

W `src/components/motion/`. Sekcja **komponuje** te elementy, nie pisze własnych `initial`/`animate`.

| Komponent                    | Zastosowanie                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Reveal`                     | Domyślne wejście: fade + krótki lift, raz, przy 30% widoczności.                                     |
| `RevealGroup` + `RevealItem` | Sekwencja ze staggerem. Rodzic prowadzi, dzieci **nie mają własnego `whileInView`**.                 |
| `TextReveal`                 | Nagłówek wjeżdżający liniami z maski. Linie podajemy jawnie — miejsce łamania to decyzja projektowa. |
| `AnimatedCounter`            | Count-up raz, przy pierwszym wejściu w viewport.                                                     |
| `ParallaxImage`              | Delikatny dryf zdjęcia. Rama przycina, warstwa wewnętrzna jest powiększona o zakres ruchu.           |
| `Magnetic`                   | Przyciąganie CTA do kursora. Sam się wyłącza bez precyzyjnego wskaźnika.                             |
| `ScrollLitText`              | Tekst rozjaśniany słowo po słowie scrollem (GSAP). Używa go Manifesto.                               |

Efekty żyjące w konkretnej sekcji, nie w bibliotece primitives:
`ServicesList` (floating preview idący za kursorem), `WorkGallery` (parallax per zdjęcie + cursor `VIEW`),
`ProcessTimeline` (wypełniająca się linia), `BeforeAfterSlider` (drag + jednorazowa podpowiedź),
`TestimonialsSlider` (track przesuwany indeksem + drag wskaźnikiem).

## Tokeny czasu i easingu

`src/lib/motion/tokens.ts` (JS) ↔ `src/styles/theme.css` + `base.css` (CSS).
Nic nie wymyśla własnej krzywej ani własnego czasu.

### Intensywność — nie rozkładamy jej równomiernie

Jeżeli każda sekcja dostanie text reveal + parallax + fade, efekt premium znika.
Motion jest zasobem, który się wydaje, nie warstwą nakładaną na wszystko.

| Sekcja                             | Intensywność |
| ---------------------------------- | ------------ |
| Hero                               | ★★★★★        |
| Before / After                     | ★★★★★        |
| Manifesto                          | ★★★★☆        |
| Selected Work                      | ★★★★☆        |
| Services                           | ★★★☆☆        |
| Process                            | ★★★☆☆        |
| Stats, Pricing, Testimonials, Lead | ★★☆☆☆        |
| Footer, inline CTA                 | ★☆☆☆☆        |

### Wartości, których się trzymamy

- Reveal: `y: 24–32 px`, nigdy `y: 100 px`. Duży dystans czyta się jak szablon.
- Zoom obrazu na hover: `1 → 1.03`. Nigdy `1 → 1.2` — to najbardziej rozpoznawalny „portfolio dev" efekt.
- Parallax: 20–60 px i **różny dla różnych zdjęć**. Identyczny zakres wszędzie czyta się jak efekt globalny.
- Przycisk nigdy nie skaluje się na hover: zmienia kolor, a strzałka przesuwa się o 4 px.
- Floating preview idzie **za kursorem**, ale nie jest do niego przyklejony: pozycja przechodzi przez
  sprężynę, więc obraz nadąża z opóźnieniem, a nie klei się do wskaźnika. Zawsze przycięty do
  obszaru listy — nie wychodzi za krawędź sekcji. Przy focusie z klawiatury kotwiczy się do
  wiersza, bo nie ma wtedy kursora, za którym mógłby iść.

### Timing

| Rodzaj                                     | Czas           |
| ------------------------------------------ | -------------- |
| Mikroanimacja (hover, focus, zmiana stanu) | 200–500 ms     |
| Hover obrazu / floating preview            | 300–450 ms     |
| Reveal                                     | 600–900 ms     |
| Hero timeline                              | maks. ~1,5–2 s |

Animacja musi się skończyć, zanim zacznie irytować.
Użytkownik nie może czekać, aż strona pozwoli mu coś zrobić.

### Easing

Unikamy `ease-in-out` wszędzie. Kierunek: **szybki start + miękkie wyhamowanie**.

Animacja ma sprawiać wrażenie mechanicznej i precyzyjnej, nie agresywnej.
Dostępne: `outExpo`, `outQuint`, `outQuart`, `inOutQuart`. Więcej niż te cztery to już bałagan.

### Stagger

`STAGGER.tight` 0,06 s · `STAGGER.base` 0,09 s · `STAGGER.loose` 0,14 s.

## Reduced motion — wymóg, nie dodatek

Projekt musi respektować `prefers-reduced-motion`. Kontrakt jest dwuczęściowy:

**CSS** (`base.css`): globalne skrócenie animacji i transition, wyłączenie `scroll-behavior: smooth`.

**JS** (`useReducedMotion()` z `@/hooks/use-reduced-motion`) — jedno źródło prawdy dla Motion, GSAP i własnego kodu.

Gdy zwraca `true`:

| Wyłączamy                              | Zostawiamy                               |
| -------------------------------------- | ---------------------------------------- |
| parallax                               | proste przejścia `opacity`               |
| wygładzanie skoków do kotwic           | natychmiastowe pokazanie treści końcowej |
| transformacje sterowane scrollem       | działający interfejs                     |
| count-up (pokazujemy wartość docelową) |                                          |
| custom cursor, magnetic                |                                          |

Każdy nowy komponent animacyjny **musi** przyjąć ten flag i mieć ścieżkę bez transformacji.
Warianty w `src/lib/motion/variants.ts` przyjmują `reduceMotion` i same degradują się do fade.

## Mobile

Nie przenosimy desktopowych efektów na mobile.

Wyłączone na mobile: custom cursor, mocny parallax, wszystko zależne od hover, skomplikowane timeline'y.
Zostaje: reveal tekstu, fade/slide, before/after, formularz, subtelny parallax, animacja menu.

Bramkujemy przez `useIsDesktop()` i `useHasFinePointer()` z `@/hooks/use-media-query`.
**Hover nigdy nie jest jedyną drogą do informacji** — na mobile ta sama treść musi być widoczna bez interakcji.
Przykład: floating image w usługach jest na desktopie efektem hover, na mobile normalnym zdjęciem między nazwą i opisem.

## Wydajność

- Animujemy **tylko `transform` i `opacity`**. Nigdy `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow` w pętli klatek.
- Nie uruchamiamy animacji dla elementów poza viewportem.
- `viewport={{ once: true }}` jest domyślne. Reveal **nigdy** nie odtwarza się ponownie przy scrollu w górę — powtarzająca się animacja czyta się jak błąd.
- `will-change` tylko przy zmierzonym problemie i tylko na czas animacji.
- Strona nie może być demonstracją „potrafię zainstalować pięć bibliotek animacyjnych”.

## Mikrointerakcje z briefu

| Miejsce          | Efekt                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero             | zdjęcie `scale 1.08 → 1` przez ~1,5–2 s; nagłówek liniami z maski (`translateY(110%) → 0`); subheadline i CTA ze staggerem; navbar jako ostatni |
| Scroll indicator | `SCROLL TO EXPLORE` + pionowa linia cyklicznie wypełniana od góry                                                                               |
| Manifesto        | słowa przechodzą z `content-dim` do `content` zależnie od pozycji scrolla (GSAP ScrollTrigger)                                                  |
| Usługi           | hover: floating image przy kursorze, delikatna reakcja na pozycję myszy; cena i strzałka przesuwają się o kilka px                              |
| Before/After     | przeciągany separator; przy pierwszym wejściu w viewport **jednorazowa** podpowiedź 50% → 65% → 50%                                             |
| Realizacje       | obraz `1 → 1.04`, kontener nieruchomy; odsłonięcie nazwy i zakresu; cursor jako okrąg `VIEW`                                                    |
| Parallax         | 20–50 px. Efekt ma być prawie podświadomy                                                                                                       |
| Liczby           | count-up raz przy wejściu w viewport                                                                                                            |
| Pakiety          | karty `y: 40 → 0`, `opacity: 0 → 1`, stagger 0,08–0,12 s; hover to minimalne przesunięcie treści, bez efektów 3D                                |
| Opinie           | wszystkie trzy cytaty w jednym flex-tracku; zmiana slajdu przesuwa track o 100 %; drag wskaźnikiem (mysz i palec), próg 60 px albo flick        |
| Formularz        | krok wychodzący `x: 0 → -30`, `opacity → 0`; wchodzący `x: 30 → 0`; 300–450 ms; `AnimatePresence`; progress bar płynnie zmienia szerokość       |
| Success state    | karta formularza transformuje się w ✓ + komunikat. Nie „Formularz został wysłany”                                                               |
| Menu mobilne     | pełnoekranowe, pozycje ze staggerem                                                                                                             |

## Gesty a scroll strony

Każda powierzchnia przeciągana poziomo dzieli palec ze scrollem strony. Obowiązują dwie zasady:

1. **`touch-pan-y`, nigdy `touch-none`.** `touch-action: none` oddaje elementowi wszystkie gesty, więc palec, który
   wyląduje na zdjęciu, nie przewinie już strony. Przy elemencie szerokim na całą kolumnę oznacza to, że strony nie da
   się przescrollować dalej — tak zachowywał się `BeforeAfterSlider`. `pan-y` zostawia pionowy pan przeglądarce,
   a gesty poziome i tak docierają do handlera.
2. **`preventDefault()` tylko dla wskaźnika, który nie jest palcem.** Wywołane na `pointermove` przy
   `pointerType === 'touch'` odbiera przeglądarce scroll, który właśnie oddaliśmy przez `pan-y`.

Z tego samego powodu dotknięcie nie jest jeszcze przeciągnięciem: `BeforeAfterSlider` ustawia separator natychmiast
tylko pod myszą, a przy palcu czeka, aż gest okaże się poziomy — inaczej próba przewinięcia strony przeskakuje
porównanie.
