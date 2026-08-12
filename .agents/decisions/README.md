# Decyzje architektoniczne (ADR)

Jeden plik = jedna decyzja. Nazwa: `NNNN-krotki-tytul.md`.

## Kiedy piszemy ADR

- Dodanie lub usunięcie zależności.
- Zmiana granicy serwer / klient.
- Zmiana podziału odpowiedzialności między bibliotekami animacyjnymi.
- Wybór dostawcy zewnętrznego (e-mail, hosting, analytics).
- Świadome złamanie zasady zapisanej w `.agents/`.

## Czego nie zapisujemy

Zwykłych decyzji implementacyjnych. Nazwa zmiennej, kolejność propsów, wybór między dwoma równoważnymi
zapisami tego samego — to należy do przeglądu kodu, nie do ADR.

## Zmiana decyzji

Starego ADR **nie edytujemy**. Piszemy nowy ze statusem `Supersedes NNNN`
i w starym zmieniamy status na `Superseded by NNNN`.

## Szablon

```markdown
# ADR-NNNN — Tytuł

- **Status:** Accepted | Superseded by NNNN
- **Data:** RRRR-MM-DD

## Kontekst

Co wymusiło decyzję. Fakty, nie preferencje.

## Decyzja

Co konkretnie ustalono. W trybie orzekającym.

## Konsekwencje

Co z tego wynika — również to, co staje się trudniejsze.

## Rozważone alternatywy

Co odrzucono i dlaczego.
```

## Spis

| ADR                                           | Tytuł                                                     | Status   |
| --------------------------------------------- | --------------------------------------------------------- | -------- |
| [0001](0001-stack-and-animation-split.md)     | Stack technologiczny i podział odpowiedzialności animacji | Accepted |
| [0002](0002-lead-delivery.md)                 | Dostarczanie zgłoszeń z formularza                        | Accepted |
| [0003](0003-src-and-no-barrels.md)            | Katalog `src/`, brak plików barrel                        | Accepted |
| [0004](0004-drop-lenis.md)                    | Rezygnacja z Lenis, native scroll                         | Accepted |
| [0005](0005-i18n-routing-and-dictionaries.md) | Dwujęzyczność: routing per locale i słowniki              | Accepted |
| [0006](0006-sharp-for-asset-preparation.md)   | sharp do przygotowania zdjec                              | Accepted |
| [0007](0007-lazy-gsap.md)                     | GSAP ładowany leniwie, bez `@gsap/react`                  | Accepted |
