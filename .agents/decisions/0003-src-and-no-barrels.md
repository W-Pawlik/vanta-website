# ADR-0003 — Katalog `src/`, brak plików barrel

- **Status:** Accepted
- **Data:** 2026-08-11

## Kontekst

Brief proponuje strukturę `app/`, `components/`, `lib/`, `hooks/`, `data/` w katalogu głównym.
Repozytorium ma jednak także konfigurację narzędzi (ESLint, Prettier, Vitest, Next, TypeScript),
dokumentację `.agents/` i katalog `public/`.

Osobno pojawia się pytanie o pliki `index.ts` re-eksportujące zawartość katalogów.

## Decyzja

**1. Cały kod aplikacji żyje w `src/`.**

Struktura wewnętrzna jest dokładnie taka, jak w briefie — tylko o jeden poziom głębiej.
Katalog główny zawiera wyłącznie konfigurację, dokumentację i assety.

**2. Nie tworzymy plików barrel.**

Importujemy bezpośrednio z pliku:

```ts
import { Button } from '@/components/ui/button' // tak
import { Button } from '@/components/ui' // nie
```

**3. Import przez alias `@/*`.** Ścieżki `../../` są zablokowane lintem; `./` i `../` w obrębie własnego katalogu są w porządku.

## Konsekwencje

Dobre:

- Katalog główny pozostaje czytelny. Widać, gdzie kończy się konfiguracja i zaczyna aplikacja.
- Graf zależności jest jawny — z importu widać dokładnie, co jest wciągane.
- Brak ryzyka cyklu przez barrel i brak przypadkowego wciągnięcia klienckiego komponentu do modułu serwerowego
  (typowa pułapka: barrel `components/index.ts` importujący `'use client'` obok komponentu serwerowego).
- Tree-shaking działa bez polegania na `sideEffects`.

Kosztowne:

- Import jest dłuższy. Uznajemy to za zaletę — dłuższa ścieżka mówi, skąd rzecz pochodzi.
- Zmiana lokalizacji pliku dotyka wszystkich importów. Przy tej skali projektu to nieistotne.

## Rozważone alternatywy

**Brak `src/`, katalogi w root.** Odrzucone: `app/`, `components/`, `lib/`, `hooks/`, `data/`, `styles/`, `server/`
obok siedmiu plików konfiguracyjnych, `.agents/` i `public/` to katalog główny, w którym trudno się zorientować.

**Barrel per katalog.** Odrzucone z powodu ryzyka cykli i przenikania granicy serwer/klient.

**Struktura feature-first (`features/hero/`, `features/lead-form/`).** Odrzucone: przy jednej stronie
i trzynastu sekcjach bez współdzielonej logiki domenowej dodaje poziom zagnieżdżenia bez korzyści.
Podział „warstwa, potem sekcja” jest tu prostszy i zgodny z briefem.
