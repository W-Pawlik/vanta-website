# 09 — Treść i copy

## Skąd bierzemy treść

1. Brief projektu — teksty sekcji są w nim podane wprost.
2. `src/data/*.ts` — wszystko, co powtarza się lub jest listą.
3. Bezpośrednio w komponencie — **tylko** tekst pojedynczy, nieparametryzowany, występujący raz.

**Nie wymyślamy treści.** Brakuje copy → pytamy właściciela repo. Wypełniacz typu „Lorem ipsum” nie wchodzi do repo.

## Język

- Interfejs i treść: **polski**.
- Kod, nazwy plików, identyfikatory, komentarze, commity: **angielski**.
- Angielskie wtrącenia są dozwolone tam, gdzie brief je przewiduje i gdzie brzmią naturalnie jako element stylistyki
  (`SCROLL TO EXPLORE`, `MOST POPULAR`, `01 / THE STANDARD`, `CERAMIC / PAINT CORRECTION`, `BEFORE | AFTER`).
  Nie tłumaczymy ich na polski i nie mnożymy nowych.

## Ton

Konkretny, techniczny, pewny. Bez sprzedażowej egzaltacji.

- Mówimy, co robimy i jaki jest efekt.
- Nie obiecujemy „najlepszej jakości w mieście”.
- Nie używamy wykrzykników.
- Nie piszemy do klienta na „Ty” z nadmierną poufałością, ale nie unikamy formy bezpośredniej — brief używa `Twój samochód`.

Wzorzec z briefu: _„Nie maskujemy niedoskonałości. Usuwamy je.”_
Krótko, dwa zdania, drugie jest puentą.

## Zasady redakcyjne

### Ceny

- Zawsze forma „od”, zawsze przez `formatPriceFrom()` z `@/lib/utils/format`.
- W danych trzymamy liczbę (`1600`), nigdy sformatowany string.
- Spacje nierozdzielające — cena nie może się złamać między linie.
- Bez groszy.

### Liczby i oceny

- Przecinek dziesiętny: `4,9`. Przez `formatDecimal()`.
- Numeracja sekcji i kroków zawsze dwucyfrowa: `01`, `02`. Przez `formatOrdinal()`.

### Typografia treści

- Półpauza `—` w wtrąceniach i pauzach retorycznych. Nie dywiz `-`.
- Cudzysłowy polskie: `„…”`.
- Nagłówki wieloliniowe: łamanie linii jest **decyzją projektową**, przekazywaną jawnie jako tablica linii
  do `TextReveal`, nie zdane na przypadek.
- Nagłówki bez kropki na końcu, chyba że brief ją zawiera (`Zadbamy o każdy detal.` — zawiera).

### CTA

- Czasownik + korzyść: `Wyceń swój samochód`, `Umów detailing`, `Poproś o wycenę`.
- Nie: `Wyślij`, `Kliknij tutaj`, `Dowiedz się więcej`.
- Główne CTA prowadzi do formularza. Na stronie jest kilka punktów CTA, ale **jeden cel**.

### Komunikaty formularza

- Błąd mówi, co zrobić: `Podaj numer telefonu (9 cyfr).` Nie: `Nieprawidłowa wartość`.
- Komunikaty walidacji są zdefiniowane w schemacie Zod (`src/lib/validation/lead.ts`), nie w komponencie.
  Jedno miejsce, ten sam tekst na kliencie i na serwerze.
- Success state jest częścią marki, nie potwierdzeniem technicznym:
  _„Dzięki. Auto jest już o krok bliżej do VANTA.”_
- Pod formularzem zdejmujemy obawę: _„Bez zobowiązań.”_

## Dowód społeczny

Konkret zamiast ogólników. Każda opinia ma imię, inicjał nazwiska i **samochód klienta**
(`BMW M4 / Ceramic`) — ten detal buduje wiarygodność.

Liczby: `350+`, `4,9 / 5`, `5 lat`, `100%`. Zawsze z etykietą, co oznaczają.

## Realizacje

Opis realizacji to zakres prac, nie przymiotniki:

```
BMW M340i
Jednoetapowa korekta lakieru
Powłoka ceramiczna 3-letnia
Detailing wnętrza
Czas realizacji: 2 dni
```

Czas realizacji podajemy — pokazuje, że proces jest przewidywalny.
