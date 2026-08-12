# 07 — Jakość kodu i przebieg pracy

## Bramka jakości

```
pnpm check
```

Uruchamia po kolei: `format:check` → `lint` → `typecheck` → `test`.
**Zadanie nie jest skończone, dopóki to nie przechodzi.**

Pojedyncze polecenia:

| Polecenie                          | Rola                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                         | serwer developerski (Turbopack)                                      |
| `pnpm build`                       | build produkcyjny — jedyny pełny test typów w plikach konwencji Next |
| `pnpm format`                      | Prettier zapisuje zmiany                                             |
| `pnpm lint` / `pnpm lint:fix`      | ESLint                                                               |
| `pnpm typecheck`                   | `tsc --noEmit`                                                       |
| `pnpm test` / `pnpm test:coverage` | Vitest                                                               |

Zasada: **nie wyłączamy reguły, żeby przejść bramkę.** Reguła jest błędem projektowym albo kod jest błędny.
Jeżeli wyłączenie jest jedynym wyjściem — `eslint-disable-next-line` z komentarzem _dlaczego_, nigdy blokowo na plik.

## Definition of Done

Zadanie jest skończone, gdy **wszystkie** punkty są spełnione:

1. `pnpm check` przechodzi.
2. `pnpm build` przechodzi.
3. Zachowanie sprawdzone w przeglądarce: desktop **i** mobile (DevTools ≤ 390 px).
4. Sprawdzone z włączonym `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS prefers-reduced-motion).
5. Nawigacja klawiaturą działa, focus jest widoczny, kolejność Tab jest logiczna.
6. Brak poziomego scrolla na żadnej szerokości.
7. Brak błędów i ostrzeżeń w konsoli.
8. Nowe tokeny i primitives widoczne na `/system`.
9. Nowa logika ma testy (patrz [06-testing.md](06-testing.md)).
10. Brak martwego kodu, brak `TODO` bez wskazania na ADR lub `specs/`.
11. Dokumentacja w `.agents/` zaktualizowana, jeżeli zmieniła się zasada, a nie tylko implementacja.

## Przebieg pracy nad sekcją

```
1. Specyfikacja      → .agents/specs/NN-nazwa-sekcji.md, zaakceptowana przed kodem
2. Dane              → src/data/<nazwa>.ts (typowane, as const)
3. Struktura         → sekcja jako Server Component, semantyczny HTML, treść w źródle
4. Styl              → tokeny i primitives; brak nowych wartości bez tokena
5. Interaktywność    → wydzielony 'use client' tylko dla tego, co reaguje
6. Animacja          → primitives z components/motion, tokeny z lib/motion
7. Reduced motion    → ścieżka bez transformacji
8. Mobile            → uproszczenie, nie skalowanie
9. Testy             → logika interakcji
10. /system          → nowe tokeny i primitives
11. pnpm check
```

Kolejność ma znaczenie: **najpierw działający, semantyczny HTML, potem animacja.**
Strona musi mieć sens bez JavaScriptu i bez animacji.

## Specyfikacja sekcji

Plik w `.agents/specs/`, minimalnie:

- Cel sprzedażowy sekcji (który etap `WOW → TRUST → PROOF → OFFER → LEAD`).
- Copy — dokładne teksty.
- Struktura HTML i hierarchia nagłówków.
- Wymagane dane i ich kształt.
- Zachowanie na desktopie i na mobile.
- Animacje: co, jakim narzędziem, jakim tokenem czasu.
- Wariant reduced motion.
- Co jest testowane.

## Przegląd kodu

Lista kontrolna: [checklists/code-review.md](checklists/code-review.md).
Checklist implementacji sekcji: [checklists/section-implementation.md](checklists/section-implementation.md).

## Commity

Conventional Commits, tryb rozkazujący, po angielsku:

```
feat(hero): add cinematic scale and line-by-line text reveal
fix(lead-form): re-validate payload in the server action
refactor(services): extract floating image into a client island
docs(agents): tighten the reduced-motion contract
test(validation): cover four-digit price grouping
chore(deps): drop vite-tsconfig-paths in favour of native resolution
```

Zasady:

- Jeden commit = jedna zmiana logiczna. Refaktor osobno od nowej funkcji.
- Commit musi przechodzić `pnpm check`. Nie commitujemy stanu „naprawię w następnym”.
- Nie commitujemy `.env.local`, `coverage/`, `.next/`.

## ADR

Decyzje architektoniczne trafiają do `.agents/decisions/` jako `NNNN-krotki-tytul.md`.

ADR piszemy, gdy: dodajemy lub usuwamy zależność, zmieniamy granicę serwer/klient,
zmieniamy podział odpowiedzialności między bibliotekami animacyjnymi, wybieramy dostawcę zewnętrznego,
albo świadomie łamiemy zasadę z `.agents/`.

Decyzję zmienioną **zastępujemy nowym ADR** ze statusem `Supersedes NNNN`. Starego nie edytujemy.

## Aktualizacja tej dokumentacji

`.agents/` opisuje stan faktyczny, nie intencje.
Zmieniasz zasadę → aktualizujesz dokument w tym samym zadaniu.
Rozjazd między kodem a `.agents/` traktujemy jak błąd, nie jak dług.
