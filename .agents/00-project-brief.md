# 00 — Brief projektu

## Klient

**VANTA Auto Detailing** — studio detailingu klasy premium w Warszawie.

Marka nie konkuruje ceną. Sprzedaje efekt, bezpieczeństwo lakieru i wygodę klienta.
VANTA ma wyglądać jak firma, której bez wahania oddaje się nowe BMW, Porsche albo kilkuletnie Audi.

Charakter marki: **nowoczesna, premium, techniczna — ale nie ostentacyjnie luksusowa.**
Świadomie odrzucamy estetykę „czarno-złote premium”.

Hasło: **Twój samochód. W najlepszej formie.**

## Cel strony

Kolejność, w jakiej strona ma działać na użytkownika:

```
WOW  →  TRUST  →  PROOF  →  OFFER  →  TRUST  →  LEAD
```

1. **WOW** — efekt w pierwszych sekundach (hero).
2. **TRUST** — manifest + usługi: to firma, która wie, co robi.
3. **PROOF** — before/after + realizacje: dowód, nie obietnica.
4. **OFFER** — proces + pakiety: konkret, ceny „od”.
5. **TRUST** — opinie.
6. **LEAD** — formularz wyceny. To jest cel konwersji.

Każda sekcja musi mieć przypisaną funkcję sprzedażową. Sekcja bez funkcji nie wchodzi na stronę.

## Zakres (MVP)

Jedna strona, następujące sekcje w tej kolejności:

| #   | Sekcja            | Funkcja               | Kluczowa interakcja                           |
| --- | ----------------- | --------------------- | --------------------------------------------- |
| —   | `Navbar`          | nawigacja + stałe CTA | sticky, transparent → blur po scrollu         |
| 01  | `Hero`            | WOW                   | cinematic scale + text reveal liniami         |
| 02  | `Manifesto`       | TRUST                 | scroll-driven rozjaśnianie tekstu             |
| 03  | `Services`        | TRUST                 | floating image na hover (desktop)             |
| 04  | `BeforeAfter`     | PROOF                 | przeciągany separator                         |
| 05  | `SelectedWork`    | PROOF                 | nieregularny grid, zoom + custom cursor       |
| 06  | `Process`         | OFFER                 | jasne tło, wypełniająca się linia             |
| 07  | `Stats`           | TRUST                 | count-up raz, przy wejściu w viewport         |
| 08  | `Pricing`         | OFFER                 | 3 pakiety, `Signature` subtelnie wyróżniony   |
| 09  | `Testimonials`    | TRUST                 | poziomy slider, 3 opinie                      |
| 10  | `LeadForm`        | LEAD                  | 3-krokowy configurator + success state        |
| 11  | `FinalCTA`        | LEAD                  | bardzo duży tekst, cinematic crop             |
| —   | `Footer`          | domknięcie            | dane kontaktowe, social                       |
| —   | `MobileStickyCta` | LEAD                  | pasek po minięciu hero, znika przy formularzu |

Trzy efekty, które są priorytetem, jeżeli trzeba coś ograniczyć:

1. **Cinematic hero + text reveal** — pierwsze wrażenie.
2. **Before / After** — interakcja.
3. **Scroll-driven manifesto / galeria** — creative development.

Reszta strony może korzystać z prostych animacji Motion. To wystarczy.

## Poza zakresem

Nie budujemy: logowania, panelu klienta, CMS, bazy danych, dashboardu, wielu podstron.
Backend ogranicza się do obsługi jednego formularza.

## Opcjonalne rozszerzenie

Jedna podstrona case study: `/realizacje/bmw-m3`.
Duże fotografie, zakres prac, before/after, proces, efekt, CTA.
Robimy ją **tylko** po ukończeniu strony głównej i tylko po decyzji właściciela repo.

## Czego świadomie nie robimy

- WebGL / Three.js z obracającym się samochodem.
- Loadera trwającego kilka sekund.
- Horizontal scrolla całej strony.
- Custom cursora wszędzie (tylko galeria).
- Dźwięków.
- Dziesięciu różnych easingów.
- Ciężkiego wideo na mobile.
- Animowania każdego słowa.
- Scroll hijackingu.

Projekt ma wyglądać na drogi, nie na przekombinowany.

## Kryterium sukcesu

Potencjalny klient studia: _„Jeżeli tak dopracowana jest strona, równie dopracowana będzie usługa przy moim samochodzie.”_

Potencjalny klient programisty: _„Gdyby moja firma dostała taką stronę, chcę z tą osobą porozmawiać.”_
