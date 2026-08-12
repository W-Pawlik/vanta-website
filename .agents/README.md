# .agents — system instrukcji dla AI

Ten katalog jest kontraktem między człowiekiem a agentem AI pracującym w tym repozytorium.
Opisuje **czym jest projekt**, **jak ma wyglądać**, **jak ma być zbudowany** i **kiedy zadanie jest skończone**.

Jeżeli kod i te dokumenty się rozjeżdżają, to jest błąd — napraw jedno albo drugie w tym samym zadaniu.

## Zasada nadrzędna

> Ta strona ma wyglądać jak realizacja, za którą klient zapłacił za branding, UX/UI, development i motion design.
> Nie jak landing page zrobiony do portfolio.

Każda decyzja implementacyjna rozstrzygana jest na korzyść **poczucia jakości**, nie na korzyść liczby efektów.

## Kolejność czytania

| Plik                                                                       | Kiedy jest obowiązkowy                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [00-project-brief.md](00-project-brief.md)                                 | Zawsze. Cel biznesowy, zakres, lista sekcji, funkcja sprzedażowa każdej z nich. |
| [01-brand-and-design.md](01-brand-and-design.md)                           | Każda praca wizualna: layout, typografia, kolor, fotografia.                    |
| [02-design-system.md](02-design-system.md)                                 | Każda linia CSS/Tailwind. Tokeny, primitives, zakazy.                           |
| [03-architecture.md](03-architecture.md)                                   | Każdy nowy plik. Struktura katalogów, granica serwer/klient, przepływ danych.   |
| [04-coding-standards.md](04-coding-standards.md)                           | Każda linia TypeScriptu.                                                        |
| [05-animation-system.md](05-animation-system.md)                           | Każda animacja. Podział Motion / GSAP, scroll, timing, reduced motion.          |
| [06-testing.md](06-testing.md)                                             | Każda zmiana logiki lub komponentu.                                             |
| [07-quality-and-workflow.md](07-quality-and-workflow.md)                   | Przed zgłoszeniem zadania jako skończonego.                                     |
| [08-accessibility-and-performance.md](08-accessibility-and-performance.md) | Sekcje z obrazami, animacjami, formularzem.                                     |
| [09-content-and-copy.md](09-content-and-copy.md)                           | Każdy tekst widoczny dla użytkownika.                                           |

Dodatkowo:

- [checklists/](checklists/) — listy kontrolne do odhaczenia przed zakończeniem zadania.
- [decisions/](decisions/) — decyzje architektoniczne (ADR). Zmieniasz decyzję → dopisujesz ADR, nie edytujesz starego.
- [specs/](specs/) — specyfikacje pojedynczych sekcji/funkcji, tworzone przed implementacją.

## Reguły pracy agenta

1. **Nie zaczynaj implementacji sekcji bez specyfikacji.** Sekcja = jeden plik w `specs/`, zaakceptowany przed kodem.
2. **Nie dodawaj bibliotek.** Stack jest zamknięty ([ADR-0001](decisions/0001-stack-and-animation-split.md)). Nowa zależność wymaga ADR i zgody właściciela repo.
3. **Nie dodawaj podstron.** Zakres to jedna strona (`/`) plus wewnętrzny `/system`. Wyjątek opisany w briefie.
4. **Nie wymyślaj tokenów w locie.** Brakuje wartości → dodaj token w `src/styles/theme.css` i pokaż go na `/system`.
5. **Nie oznaczaj zadania jako gotowego bez `pnpm check`.** Musi przejść formatowanie, lint, typy i testy.
6. **Nie zostawiaj martwego kodu.** Brak nieużywanych komponentów, propsów, plików, „na przyszłość”.
7. **Nie zgaduj treści.** Copy pochodzi z briefu albo z `src/data/`. Brak treści → zapytaj, nie improwizuj.

## Stan projektu

Gotowe: tooling i bramka jakości, design system, primitives UI i animacyjne, walidacja i backend formularza, SEO,
zdjęcia (`public/images/`, atrybucje w `CREDITS.json`) oraz **etapy 1–4** z planu implementacji:
statyczny layout wszystkich 13 sekcji, typografia i obrazy responsywne, działający lead configurator, drag slider before/after.

Do zrobienia: **etapy 5–8** — motion reveals, GSAP (manifesto, process), interakcje hover, final polish.

Plan i szczegółowy status: [specs/00-implementation-plan.md](specs/00-implementation-plan.md).
