# ADR-0005 — Dwujęzyczność: routing per locale i słowniki

- **Status:** Accepted
- **Data:** 2026-08-12

## Kontekst

Strona miała być dwujęzyczna (polski + angielski) z subtelnym przełącznikiem.
Projekt jest portfolio, więc angielska wersja nie jest dodatkiem — to ona będzie czytana
przez większość osób oglądających realizację.

Do rozstrzygnięcia były trzy rzeczy: gdzie trzyma się teksty, jak wygląda routing i jak
komponenty dostają się do treści bez przekazywania `locale` przez pół drzewa.

## Decyzja

**Routing.** Wszystkie route'y żyją pod `src/app/[locale]/`, a root layout jest w środku
tego segmentu. `src/proxy.ts` (w Next 16 `middleware` jest przemianowane na `proxy`)
przekierowuje żądania bez prefiksu, wybierając locale z `Accept-Language` z polskim jako
fallbackiem. Oba locale są prerenderowane statycznie przez `generateStaticParams`.

**Dostęp do treści.** Server Components wołają `getDictionary()` z `@/i18n/server`, które
czyta locale przez `next/root-params`. Dzięki temu **nie ma prop drillingu** — żadna sekcja
nie przyjmuje `locale` tylko po to, żeby przekazać je dalej.

**Rozdzielenie modułów.** To był realny błąd, na który wpadliśmy w trakcie:

- `@/i18n/dictionaries` — bez żadnego importu z Next. Trzyma słowniki, `Dictionary`,
  `dictionaryFor()`, `interpolate()`. Może go importować kod kliencki.
- `@/i18n/server` — `getDictionary()`, `getLocale()`. Importuje `next/root-params`.

Import `next/root-params` na poziomie modułu w pliku, z którego korzysta komponent
kliencki (u nas `error.tsx`), **wysadza build** — nawet jeśli sama funkcja nie jest
wywoływana. Dlatego granica jest twarda.

**Typowanie.** `pl.ts` jest źródłem prawdy dla kształtu: `type Dictionary = typeof pl`,
a `en.ts` jest zadeklarowany jako `Dictionary`. Brakujący albo przemianowany klucz to błąd
kompilacji, nie luka odkryta na produkcji. `pl.ts` **nie** używa `as const` — literalne
typy wymuszałyby identyczne co do znaku teksty angielskie.

**Podział danych i treści.** `src/data/` trzyma tylko to, co jest niezależne od języka:
ceny, ścieżki do zdjęć, slugi, proporcje kadrów, zakresy parallaxu. Wszystkie słowa są
w słownikach, kluczowane slugiem.

**Ograniczenia platformy i ich obejścia.** `next/root-params` nie działa w Client
Components, Server Actions ani Route Handlers. Konsekwencje:

- komponenty klienckie dostają swoje teksty jako propsy (`Navbar`, `LeadForm`, slidery),
- `error.tsx` czyta locale ze ścieżki URL, z fallbackiem na domyślne,
- Server Action formularza dostaje locale w **ukrytym polu** i waliduje je jak każdy inny
  niezaufany input, zanim wybierze słownik,
- `sitemap.ts` i `robots.ts` wyliczają locale z `@/i18n/config`.

**Walidacja.** `createLeadSchemas(messages)` jest fabryką, nie stałą modułową. Klient
buduje schemat ze swojego słownika, akcja odbudowuje go z locale przesłanego w formularzu.
Jedna definicja tego, co jest poprawne; wording idzie za językiem strony.

## Konsekwencje

Dobre:

- Obie wersje są statycznym HTML-em, z `hreflang` i `alternates.languages` — dla
  wyszukiwarek to tłumaczenia, nie duplikaty.
- Dodanie trzeciego języka to jeden plik słownika plus wpis w `locales`.
- Teksty są w jednym miejscu, więc korekta copy nie wymaga wchodzenia w komponenty.

Kosztowne:

- Podwójny koszt każdej zmiany copy — trzeba dopisać oba języki. Rekompensuje to
  kompilacja, która nie przepuści połowicznej zmiany.
- Klucze wariantów usług i pozycji cennika są zwykłymi stringami, więc TypeScript nie
  sprawdzi ich pokrycia. Zamiast tego pilnuje tego test
  `src/i18n/services-copy.test.ts` — w obie strony: brak treści dla klucza z danych
  **i** treść bez odpowiadającego jej klucza.
- Komponenty klienckie mają dłuższe listy propsów.

## Rozważone alternatywy

**`next-intl` / `next-i18next`.** Odrzucone: nowa zależność w zamkniętym stacku
([ADR-0001](0001-stack-and-animation-split.md)), a przy dwóch językach i braku pluralizacji
poza jednym `{max}` nie ma czego delegować. Wbudowany wzorzec z dokumentacji Next 16
wystarcza.

**Prefiks tylko dla drugiego języka (`/` = PL, `/en` = EN).** Odrzucone: wymaga route
groups i sprawia, że domyślny język nie ma kanonicznego adresu z prefiksem. Symetryczne
`/pl` i `/en` są nudniejsze i przewidywalne.

**Przełącznik jako `<select>` albo dropdown z flagami.** Odrzucone: flaga oznacza kraj,
nie język, a dwie pozycje nie potrzebują rozwijanego menu. Dwa linki `PL / EN` w rozmiarze
metadanych.
