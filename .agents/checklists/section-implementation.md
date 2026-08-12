# Checklist — implementacja sekcji

Do odhaczenia przed zgłoszeniem sekcji jako gotowej.

## Przed kodem

- [ ] Istnieje zaakceptowana specyfikacja w `.agents/specs/`.
- [ ] Znany etap w lejku (`WOW → TRUST → PROOF → OFFER → LEAD`) i funkcja sprzedażowa sekcji.
- [ ] Copy dostarczone (brief lub właściciel repo). Zero wypełniaczy.
- [ ] Zdjęcia dostarczone albo świadomie zastąpione placeholderem o docelowych proporcjach.

## Struktura

- [ ] Sekcja jest **Server Component**.
- [ ] Owinięta w `Section` z `id` z `SECTION_IDS`, jeżeli jest celem nawigacji.
- [ ] Poprawna hierarchia nagłówków (`h2` dla nagłówka sekcji, bez przeskoków).
- [ ] Semantyczne elementy tam, gdzie mają sens (`dl`, `blockquote`, `nav`, `ol`).
- [ ] Interaktywność wydzielona jako osobny `'use client'` — nie cała sekcja.
- [ ] Dane w `src/data/`, typowane, `as const`, ceny jako liczby.

## Styl

- [ ] Wyłącznie tokeny. Zero hexów, zero pikselowych rozmiarów typografii w komponencie.
- [ ] `Container` / `Section` / `SectionLabel` / `Button` zamiast lokalnych odpowiedników.
- [ ] Klasy łączone przez `cn()`.
- [ ] Nowy token → dodany w `theme.css`, uwzględniony w `cn.ts` (jeśli `text-*`), pokazany na `/system`.
- [ ] Tekst akapitowy ograniczony `max-w-measure`.
- [ ] Akcent użyty oszczędnie — maksymalnie jeden element w widoku.

## Animacja

- [ ] Narzędzie zgodne z podziałem: Motion dla stanów, GSAP dla sekwencji scrollowych.
- [ ] Użyte primitives z `components/motion/`, nie ręczne `initial`/`animate`.
- [ ] Czasy i easingi z `lib/motion/tokens.ts`.
- [ ] Animowane tylko `transform` i `opacity`.
- [ ] Reveal ma `once: true` — nie odtwarza się przy scrollu w górę.
- [ ] GSAP wyczyszczony przy unmount (`useGSAP`).

## Responsywność

- [ ] Sprawdzone na 360, 390, 768, 1024, 1440, 1920 px.
- [ ] Brak poziomego scrolla na każdej z tych szerokości.
- [ ] Mobile to **uproszczenie**, nie skalowanie desktopu.
- [ ] Żadna informacja nie jest dostępna wyłącznie przez hover.
- [ ] CTA na mobile wygodne do kliknięcia (min. 44 px wysokości).

## Dostępność

- [ ] Nawigacja klawiaturą, logiczna kolejność Tab, widoczny focus.
- [ ] Wszystkie obrazy z sensownym `alt` (lub `alt=""` dla dekoracyjnych).
- [ ] Kontrast zgodny z zasadami z `08-accessibility-and-performance.md`.
- [ ] Sprawdzone z `prefers-reduced-motion` — sekcja jest czytelna i użyteczna.

## Wydajność

- [ ] `next/image` z poprawnym `sizes`.
- [ ] `priority` tylko dla hero.
- [ ] Wymiary obrazów zarezerwowane — brak przesuwania layoutu.

## Domknięcie

- [ ] Testy dla logiki interakcji.
- [ ] `pnpm check` przechodzi.
- [ ] `pnpm build` przechodzi.
- [ ] Brak błędów i ostrzeżeń w konsoli.
- [ ] Brak martwego kodu i `TODO` bez odniesienia.
- [ ] `.agents/` zaktualizowane, jeżeli zmieniła się zasada.
