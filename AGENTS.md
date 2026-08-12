<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# VANTA Auto Detailing

Jednostronicowa strona wizerunkowo-sprzedażowa studia detailingu premium.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · GSAP · Zod · Vitest.
Scroll natywny, bez biblioteki smooth-scroll ([ADR-0004](.agents/decisions/0004-drop-lenis.md)).

## Zacznij tutaj

**Przed jakąkolwiek zmianą przeczytaj [`.agents/README.md`](.agents/README.md).**

Ten katalog jest kontraktem projektu: opisuje markę, system stylów, architekturę, praktyki kodowania,
system animacji, podejście do testów i definicję ukończenia zadania. Nie improwizuj wokół niego.

Minimum na start:

| Zadanie                  | Przeczytaj                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Cokolwiek                | [`.agents/README.md`](.agents/README.md), [`00-project-brief.md`](.agents/00-project-brief.md)                   |
| Styl, layout, typografia | [`01-brand-and-design.md`](.agents/01-brand-and-design.md), [`02-design-system.md`](.agents/02-design-system.md) |
| Nowy plik, nowa sekcja   | [`03-architecture.md`](.agents/03-architecture.md), [`04-coding-standards.md`](.agents/04-coding-standards.md)   |
| Animacja                 | [`05-animation-system.md`](.agents/05-animation-system.md)                                                       |
| Testy                    | [`06-testing.md`](.agents/06-testing.md)                                                                         |
| Domknięcie zadania       | [`07-quality-and-workflow.md`](.agents/07-quality-and-workflow.md)                                               |

## Twarde zasady

1. `pnpm check` musi przechodzić. Bez tego zadanie nie jest skończone.
2. Stack jest zamknięty. Nowa zależność wymaga ADR w `.agents/decisions/`.
3. Domyślnie Server Component. `'use client'` tylko na wyspie, która naprawdę reaguje.
4. Zero surowych wartości wizualnych w komponentach — wyłącznie tokeny z `src/styles/theme.css`.
5. Każda animacja ma ścieżkę `prefers-reduced-motion`.
6. Brak plików barrel. Import przez alias `@/*`.
7. Sekcja nie wchodzi do kodu bez specyfikacji w `.agents/specs/`.

## Polecenia

```bash
pnpm dev            # serwer developerski
pnpm build          # build produkcyjny
pnpm check          # format + lint + typy + testy
pnpm test:watch     # testy w trybie watch
pnpm test:coverage  # pokrycie z progami
```

## Język

Kod, nazwy, komentarze i commity — angielski.
Dokumentacja w `.agents/` i treść widoczna dla użytkownika — polski.
