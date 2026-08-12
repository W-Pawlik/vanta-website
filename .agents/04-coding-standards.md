# 04 — Praktyki kodowania

## TypeScript

`strict` plus: `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`,
`noImplicitOverride`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`.

- **`any` jest zabronione** (lint: error). Nie wiesz typu → `unknown` i zawężaj.
- Rzutowanie `as` to sygnał ostrzegawczy. Dozwolone przy granicach bibliotek (typy Motion) — z komentarzem _dlaczego_.
- Nie piszemy typu zwracanego przy komponentach React. Piszemy go przy funkcjach z `lib/` i hookach — to kontrakt.
- Union zamiast boolean flag. `tone: 'default' | 'invert'` zamiast `isInverted`.
- Typy wyprowadzamy z danych, nie duplikujemy: `type CarType = (typeof CAR_TYPES)[number]`.
- `import type` jawnie (`verbatimModuleSyntax` tego wymaga, lint poprawia automatycznie).

## Komponenty React

- Funkcja nazwana, eksport nazwany. Domyślny eksport **tylko** w plikach konwencji Next (`page`, `layout`, `error`, `not-found`, `sitemap`, `robots`, `manifest`).
- Propsy jako `type` zadeklarowany nad komponentem. Bez `React.FC`.
- Destrukturyzujemy propsy w sygnaturze, z wartościami domyślnymi w miejscu.
- Kolejność w pliku: importy → stałe modułowe → typy → komponent → helpery pod komponentem.
- Nie owijamy w `memo` / `useCallback` / `useMemo` bez zmierzonego problemu. Wyjątek: wartość przekazywana do `useSyncExternalStore` albo do zewnętrznej biblioteki, gdzie stabilność referencji jest częścią kontraktu.

## Stan

- Stan trzymamy tak lokalnie, jak to możliwe. Brak globalnego store — projekt go nie potrzebuje.
- Wartości pochodne **wyliczamy w renderze**, nie trzymamy w stanie i nie synchronizujemy efektem.
- Reguła `react-hooks/set-state-in-effect` jest włączona jako błąd. `setState` w ciele efektu = zła architektura.
  Poprawny wzorzec (z `animated-counter.tsx`): stan zapisuje wyłącznie callback animacji, a wartość wyświetlana jest pochodna.

```tsx
// źle — kaskadowy render
useEffect(() => {
  if (reduceMotion) setDisplayed(value)
}, [reduceMotion, value])

// dobrze — pochodne w renderze
const displayed = reduceMotion ? value : isInView ? animatedValue : 0
```

- Każdy `useEffect` musi mieć cleanup, jeżeli cokolwiek subskrybuje, uruchamia timer albo animację.

## Efekty i zdarzenia

- Subskrypcje zewnętrzne (media queries, scroll) przez `useSyncExternalStore`, nie `useState` + `useEffect`.
- Listener dodany → listener usunięty w tym samym bloku. Zawsze ta sama referencja funkcji.
- Nie dotykamy DOM-u poza `ref`. Brak `document.querySelector` w komponentach.

## Obsługa błędów

- Nie łykamy błędów po cichu. Albo obsługujemy, albo propagujemy.
- `console.log` zabroniony lintem. `console.warn` / `console.error` dozwolone dla diagnostyki serwerowej i granic błędów.
- Komunikat dla użytkownika: co się stało + co może zrobić. Nigdy stack trace, nigdy nazwa technicznego pola.

## Komentarze

Komentujemy **dlaczego**, nigdy **co**.

```ts
// źle
// ustaw overflow na hidden
body.style.overflow = 'hidden'

// dobrze
// Kompensujemy znikający scrollbar, żeby layout nie skoczył przy otwarciu menu.
body.style.paddingRight = `${scrollbarWidth}px`
```

Komentarz jest potrzebny, gdy: obchodzimy zachowanie biblioteki, wartość wygląda arbitralnie,
kod celowo łamie oczywistą konwencję, albo istnieje pułapka, w którą łatwo wpaść przy zmianie.

`TODO` musi wskazywać ADR albo plik w `specs/`. `TODO` bez właściciela nie wchodzi do repo.

## Czego nie robimy

- Nie zostawiamy zakomentowanego kodu.
- Nie tworzymy abstrakcji „na przyszłość”. Trzecie użycie uzasadnia wyodrębnienie, nie pierwsze.
- Nie dodajemy propsów, których nikt nie przekazuje.
- Nie zostawiamy nieużywanych plików, eksportów ani zależności.
- Nie mieszamy refaktoru z nową funkcją w jednej zmianie.

## Formatowanie

Prettier decyduje o wszystkim (bez średników, apostrofy pojedyncze, 100 kolumn, przecinki końcowe).
`prettier-plugin-tailwindcss` sortuje klasy — **nie sortujemy ręcznie**, nie walczymy z wynikiem.
