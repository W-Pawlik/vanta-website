# 08 — Dostępność i wydajność

Dostępność i wydajność nie są dodatkiem do „efektownej strony”. Są częścią tego, co sprawia, że strona wygląda na drogą.

## Dostępność

### Semantyka

- Dokładnie **jeden `<h1>`** na stronie — nagłówek hero.
- Nagłówki sekcji to `<h2>`, nie „duży `<div>`”. Nie przeskakujemy poziomów.
- Sekcja to `<section>` z `id` z `SECTION_IDS`. Nawigacja to `<nav>`. Stopka to `<footer>`.
- Statystyki jako lista definicji (`<dl>` / `<dt>` / `<dd>`) — liczba bez etykiety nic nie znaczy.
- Cytat z opinii jako `<blockquote>` z autorem w `<figcaption>` albo `<cite>`.
- Ocena gwiazdkowa musi mieć tekstowy odpowiednik (`5 z 5`) dla czytników ekranu.

### Klawiatura i focus

- Każdy interaktywny element osiągalny Tabem, w logicznej kolejności.
- Focus ring jest zdefiniowany globalnie w `base.css` (akcent, `outline-offset: 3px`). **Nie usuwamy go.**
- Skip link (`Przejdź do treści`) jest w `layout.tsx` — widoczny po sfokusowaniu.
- Menu mobilne: zamykanie klawiszem `Escape`, focus uwięziony w overlayu, przywracany po zamknięciu.
- Slider before/after: obsługa strzałkami, `role="slider"` z `aria-valuenow`, `aria-label`.
- `Magnetic` owija CTA, nie zastępuje go — element zachowuje własną semantykę i focus.

### Modale i overlaye

Każdy modal (drawer usług, lightbox galerii) musi mieć wszystkie te rzeczy naraz —
dostarcza je `Overlay`, więc nie implementuj ich od nowa:

- `role="dialog"` + `aria-modal="true"` + nazwa na panelu,
- zamykanie Escape, klikiem w tło i przyciskiem,
- blokada scrolla strony,
- **pułapka focusu** — bez niej Tab wychodzi na nawigację za przygaszonym tłem i można
  przewinąć stronę przy otwartym modalu,
- focus wraca na element, który modal otworzył.

### Formularz

- Każde pole ma powiązany `<label>` (nie placeholder w roli etykiety).
- Błąd walidacji powiązany z polem (`aria-describedby`), region komunikatów z `aria-live="polite"`.
- Krok formularza ma czytelny stan postępu, także tekstowy (`Krok 2 z 3`).
- Success state musi być ogłaszany, nie tylko animowany.

### Obrazy

- Każde zdjęcie ma sensowny `alt` — opisujący samochód i zakres prac, nie „zdjęcie”.
- Zdjęcie czysto dekoracyjne: `alt=""`. Nigdy brak atrybutu.
- Tekst nie jest częścią obrazu.

### Kontrast

- `content` na `canvas` oraz `content-invert` na `canvas-invert` mają wysoki kontrast — to bezpieczne pary.
- `content-muted` jest przeznaczony dla tekstu pomocniczego. Nie używamy go dla treści krytycznej ani dla małego tekstu na `surface`.
- `content-dim` **nie jest kolorem tekstu do czytania** — to stan spoczynkowy animacji.
- Akcent (`accent`) z tekstem: tylko `accent-contrast` (prawie czerń) na tle akcentu, nigdy biel.

### Reduced motion

Pełny kontrakt w [05-animation-system.md](05-animation-system.md). Wymóg, nie opcja.

## Wydajność

### Obrazy

- **Wyłącznie `next/image`.** Nie wrzucamy dużych JPG jako `background-image`.
- Formaty: AVIF i WebP (skonfigurowane w `next.config.ts`). Oryginały trzymamy osobno, poza `public/`.
- Hero: `priority` — to LCP strony. Reszta: domyślne lazy loading.
- `sizes` obowiązkowe dla każdego obrazu responsywnego. Bez tego przeglądarka ściąga największy wariant.
- Galeria realizacji nie ładuje wszystkich zdjęć na start.
- Above the fold: logo, hero, pierwszy content. Wszystko inne później.

### Przygotowanie plików

Zdjęcia nie trafiają do repo w takim rozmiarze, w jakim przyszły. Przed commitem:

```bash
pnpm images:prepare
```

- Każdy plik ma w skrypcie zapisany **docelowy rozmiar wyprowadzony z layoutu** (najszerszy
  boks CSS × 2 dla ekranów o dużej gęstości, potem ścięty tam, gdzie detal przestaje być
  widoczny). Progi są w `TARGETS` w `scripts/prepare-images.mjs`.
- Skrypt generuje też `src/lib/images/blur.ts`. Statyczne ścieżki nie dostają
  `blurDataURL` automatycznie, więc każdy `next/image` dostaje go przez
  `{...blurProps(src)}`. Bez tego zostaje skok „pusta ramka → zdjęcie", którego samo
  zmniejszenie plików nie usuwa.
- Dodajesz zdjęcie → dopisz je do `TARGETS` i uruchom skrypt. Bez tego obrazek nadal się
  wyświetli, ale bez placeholdera i w oryginalnym rozmiarze.

Pełne uzasadnienie: [ADR-0006](decisions/0006-sharp-for-asset-preparation.md).

### Animacja

- Animujemy tylko `transform` i `opacity`.
- Nie animujemy elementów poza viewportem.
- Reveal `once: true` — brak ponownych animacji przy scrollu w górę.
- Sekcja nie może wywoływać layout thrashingu — pomiary DOM (`getBoundingClientRect`) poza pętlą klatek albo raz na zdarzenie.

### Bundle

- Sekcje zostają Server Components. Klient dostaje tylko wyspy interaktywności.
- `optimizePackageImports` obejmuje `motion` i `gsap`.
- GSAP importujemy przez `@/lib/motion/gsap` — jedno miejsce rejestracji, brak przypadkowego wciągania pluginów.
- Bez wideo na mobile. Preferujemy dobrze zoptymalizowane zdjęcie z subtelnym ruchem.
- Brak loadera. Strona pokazuje treść od razu.

### Cele

| Metryka                                         | Cel                                         |
| ----------------------------------------------- | ------------------------------------------- |
| LCP                                             | < 2,5 s                                     |
| CLS                                             | < 0,05 (rezerwujemy wymiary każdego obrazu) |
| INP                                             | < 200 ms                                    |
| Lighthouse Performance / Accessibility (mobile) | ≥ 90                                        |

## SEO

Mimo że jest to projekt portfolio, strona ma wyglądać jak produkcyjna realizacja.

- Metadane budujemy przez `buildMetadata()` z `@/lib/seo/metadata`. Nie piszemy obiektu `Metadata` od zera w route.
- Lokalne SEO: `Auto Detailing Warszawa | VANTA`.
- Open Graph i Twitter card spójne, obraz 1200 × 630.
- `robots.ts`, `sitemap.ts`, `manifest.ts` już istnieją. `/system` jest wyłączona z indeksowania.
- Treść musi być w źródle HTML — to konsekwencja trzymania sekcji na serwerze.
- Favicon i ikony PWA to zadanie na etap assetów. Manifest celowo nie wskazuje jeszcze ikon.
- Warto dodać JSON-LD `LocalBusiness` / `AutoRepair` z danych `siteConfig` — jeden `<script type="application/ld+json">`.
