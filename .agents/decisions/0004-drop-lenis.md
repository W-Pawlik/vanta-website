# ADR-0004 — Rezygnacja z Lenis, native scroll

- **Status:** Accepted
- **Data:** 2026-08-12
- **Zmienia:** [ADR-0001](0001-stack-and-animation-split.md) w części dotyczącej Lenis

## Kontekst

Po złożeniu strony scroll był zepsuty. Diagnoza wskazała dwie realne przyczyny, obie w naszej integracji Lenis:

1. **Arkusz `lenis/dist/lenis.css` nigdy nie był zaimportowany.** Lenis wymaga własnych reguł,
   m.in. `html.lenis, html.lenis body { height: auto }`.
2. **`html { scroll-behavior: smooth }` w `base.css` walczył z Lenisem.** Lenis w trybie root
   wywołuje `window.scrollTo` w każdej klatce; przy włączonym native smooth scroll każde z tych
   wywołań staje się osobną animacją przewijania. Strona przewija się „przeciw sobie".

Dodatkowo konfiguracja `autoRaf: false` z pętlą klatek na tickerze GSAP wprowadzała trzeci punkt
awarii: gdyby instancja Lenis nie była gotowa w momencie uruchomienia efektu, nic nie napędzałoby
`lenis.raf()` i scroll zamarłby całkowicie.

Obie usterki są naprawialne. Problem jest inny: **nie mamy w tym środowisku przeglądarki**, więc
jakości i „ciężkości" smooth scrolla nie da się zweryfikować. Utrzymywanie biblioteki, której
efektu nie można sprawdzić, w warstwie tak podstawowej jak przewijanie strony, jest złym układem.

Brief (§39) przewidział ten scenariusz: _„Jeżeli po wdrożeniu native scroll wygląda wystarczająco
dobrze, Lenis może zostać całkowicie pominięty."_ ADR-0001 zapisał tę rezygnację jako dopuszczalną
i właśnie dlatego wrapper był odizolowany.

## Decyzja

Usuwamy Lenis. Strona korzysta z natywnego przewijania.

- Zależność `lenis` usunięta z `package.json`.
- Komponent `src/components/motion/smooth-scroll.tsx` usunięty.
- `layout.tsx` renderuje `Navbar` / `main` / `Footer` bez wrappera.
- `html { scroll-behavior: smooth }` **zostaje** — teraz jest poprawne: to natywne wygładzanie
  skoków do kotwic, bez biblioteki, która by z nim walczyła. Przy `prefers-reduced-motion`
  nadal przechodzi w `auto`.
- GSAP i ScrollTrigger zostają bez zmian (`src/lib/motion/gsap.ts`). ScrollTrigger współpracuje
  z natywnym scrollem bez żadnego pośrednika — usunięcie Lenis **upraszcza** etap 6.

## Konsekwencje

Dobre:

- Scroll działa i jest przewidywalny na każdej platformie. Zero kodu między użytkownikiem a przewijaniem.
- Jedna zależność mniej w bundlu i jeden punkt awarii mniej.
- ScrollTrigger nie wymaga synchronizacji zegara ani `scrollerProxy`.
- Nie oszukujemy się co do jakości: nie ma efektu, którego nie umiemy ocenić.

Kosztowne:

- Tracimy wygładzoną inercję kółka myszy — element „premium feel" z briefu.
  Rekompensujemy to jakością animacji wejścia i mikrointerakcji (etapy 5–7), nie fizyką scrolla.

## Jeżeli kiedyś wracamy do Lenis

Wymagania, bez których nie ma sensu próbować:

1. Zaimportować `lenis/dist/lenis.css`.
2. Usunąć `scroll-behavior: smooth` z `html` (Lenis obsługuje kotwice sam, przez `lenis.scrollTo`).
3. Zostawić `autoRaf: true`, dopóki nie ma potwierdzonej potrzeby dzielenia zegara z GSAP.
4. Sprawdzić w **prawdziwej przeglądarce**, na touchpadzie i na kółku myszy, oraz z `prefers-reduced-motion`.

## Rozważone alternatywy

**Naprawić integrację (import CSS + usunięcie `scroll-behavior`).** Odrzucone na teraz:
naprawa jest prosta, ale bez weryfikacji w przeglądarce nie da się stwierdzić, czy scroll nie jest
zbyt ciężki — a brief stawia warunek „użytkownik ma zachować pełną kontrolę".
Do rozważenia ponownie, gdy w projekcie pojawi się narzędzie do testów przeglądarkowych.

**Własny lekki smooth scroll.** Odrzucone: to dokładnie ta klasa kodu, która psuje dostępność
i wydajność, a zysk jest kosmetyczny.
