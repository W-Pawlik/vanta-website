# ADR-0006 — sharp jako narzędzie do przygotowania zdjęć

- **Status:** Accepted
- **Data:** 2026-08-12

## Kontekst

Zdjęcia ładowały się na Vercelu wyraźnie zbyt długo. Diagnoza pokazała dwie osobne przyczyny:

1. **Pliki źródłowe były 2–4× większe, niż layout potrafi wyświetlić.** Hero i Final CTA miały
   2560 px szerokości przy kontenerze 1280 px; kadry galerii 1500–2000 px przy boksach
   520–900 px. `next/image` i tak je przeskalowuje, ale pierwsze żądanie każdego wariantu
   płaci za „zimną" optymalizację po stronie Vercela — im większe wejście, tym dłużej.
2. **Brak placeholderów.** Statyczne ścieżki (`/images/…`), w odróżnieniu od statycznych
   importów, nie dostają automatycznie `blurDataURL`. Efekt: pusta ramka, potem skok do
   zdjęcia. Duża część odczucia „długo się ładuje" to właśnie ten skok, nie same bajty.

Obu rzeczy nie da się naprawić z poziomu URL-i CDN — trzeba lokalnie przetworzyć pliki,
w tym dwa dostarczone przez właściciela repo (para przed/po, jeden plik w PNG 1,8 MB).

## Decyzja

Dodajemy **`sharp` jako `devDependency`** i skrypt `scripts/prepare-images.mjs`
(`pnpm images:prepare`).

Skrypt robi dwie rzeczy:

- przekodowuje każde zdjęcie w `public/images/` do największego rozmiaru, jaki layout może
  faktycznie pokazać, przez mozjpeg (progresywny, 4:2:0);
- generuje `src/lib/images/blur.ts` — podglądy 16 px szerokości jako base64, wykorzystywane
  jako `placeholder="blur"` przez helper `blurProps(src)`.

Wynik pierwszego przebiegu: **2431 kB → 881 kB (−64 %)**, bez widocznej utraty jakości przy
rozmiarach, w jakich zdjęcia są wyświetlane.

Zabezpieczenia w skrypcie:

- `withoutEnlargement` — nigdy nie powiększa źródła mniejszego niż cel (para przed/po ma
  natywnie 1376 px i taka zostaje);
- odmowa zapisu, gdy wynik nie jest istotnie mniejszy (< 97 % wejścia). Przekodowanie jest
  stratne, więc dwukrotne uruchomienie nie ma po cichu psuć jakości.

Skrypt jest **narzędziem uruchamianym ręcznie**. Nie wchodzi do `pnpm check`, nie wchodzi do
CI, nie jest częścią builda.

## Konsekwencje

Dobre:

- 64 % mniej bajtów do przesłania i do przetworzenia przez optymalizator Vercela, co przy
  limitach transformacji na planie Hobby ma też znaczenie kosztowe.
- Blur placeholder usuwa skok „pusta ramka → zdjęcie", czyli tę część problemu, której samo
  zmniejszenie plików by nie ruszyło.
- Progi rozmiarów są w jednym miejscu (`TARGETS`) i można je odczytać obok layoutu, zamiast
  zgadywać, dlaczego dany plik ma taką szerokość.

Kosztowne:

- Nowa zależność, choć wyłącznie deweloperska i nieobecna w bundlu. `sharp` ma binarki
  natywne, więc `pnpm install` waży więcej i jest wrażliwy na platformę.
- `src/lib/images/blur.ts` jest generowany i wersjonowany. Dodanie zdjęcia bez uruchomienia
  skryptu oznacza brak placeholdera — `blurProps` zwraca wtedy `undefined`, więc obrazek
  nadal się renderuje, tylko bez podglądu. Świadomie wybrana cicha degradacja, nie błąd.
- Oryginałów nie trzymamy w repo, więc ponowne przygotowanie od zera wymaga ich odtworzenia.

## Rozważone alternatywy

**Parametry URL-i Unsplash (`&w=&q=`).** Tak przygotowaliśmy zdjęcia pierwotnie i to działa —
ale nie obejmuje plików lokalnych (para przed/po) i nie generuje placeholderów.

**Statyczne importy zamiast ścieżek (`import hero from '…jpg'`).** Next generuje wtedy
`blurDataURL` i wymiary automatycznie, bez `sharp`. Odrzucone: wymagałoby przeniesienia
zdjęć z `public/` do `src/`, przepisania wszystkich ścieżek oraz importów w plikach danych,
i sprzęgałoby warstwę danych z bundlerem. Zysk ten sam, koszt wyraźnie wyższy.

**`images: { unoptimized: true }`.** Odrzucone: oddaje AVIF/WebP i responsywne warianty,
czyli największą zaletę `next/image`. Zostaje w zapasie, gdyby limit transformacji na planie
Hobby zaczął zgrzytać.
