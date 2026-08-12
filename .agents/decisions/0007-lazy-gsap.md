# ADR-0007 — GSAP ładowany leniwie, bez `@gsap/react`

- **Status:** Accepted
- **Data:** 2026-08-12
- **Zmienia:** regułę o `useGSAP()` w [05-animation-system.md](../05-animation-system.md);
  usuwa zależność `@gsap/react` ze stacku zamkniętego przez
  [ADR-0001](0001-stack-and-animation-split.md). Podział odpowiedzialności Motion ↔ GSAP
  z ADR-0001 **zostaje bez zmian**, podobnie jak reguła, że rejestracja pluginów żyje
  w `@/lib/motion/gsap`.

## Kontekst

Audyt wydajności pokazał, że GSAP + ScrollTrigger jest pobierany na ścieżce krytycznej każdej
wizyty. Pomiar na buildzie produkcyjnym (`<script src>` w prerenderowanym `pl.html`):

|       | initial JS                    |
| ----- | ----------------------------- |
| przed | 1257 KB raw / **381 KB gzip** |
| po    | 1145 KB raw / **338 KB gzip** |

GSAP odpowiadał za **112 KB raw / 43 KB gzip** z tej sumy — po zmianie siedzi w osobnym
chunku 69 KB, pobieranym dopiero wtedy, gdy jest potrzebny.

Nieproporcjonalność była w tym, **za co** się płaciło:

- GSAP ma w tym projekcie **jednego konsumenta** — `ScrollLitText` w sekcji Manifesto.
- Manifesto jest poniżej pierwszego ekranu (hero ma `min-h-svh`), więc efekt nie może się
  uruchomić przed hydracją.
- Przy `prefers-reduced-motion` animacja nie odtwarza się wcale, ale biblioteka i tak była
  pobierana i parsowana.
- Parsowanie i wykonanie tego skryptu konkuruje z hydracją o main thread, czyli dokładnie
  o to, co decyduje o INP.

Import statyczny w `lib/motion/gsap.ts` gwarantował, że koszt ponosi każdy odwiedzający —
także ten, który nigdy nie doscrolluje do Manifesto.

## Decyzja

**1. GSAP ładujemy dynamicznie.** `lib/motion/gsap.ts` nie importuje już GSAP w module scope.
Eksportuje `loadGsap()` — funkcję zwracającą cache'owaną obietnicę, która robi
`import('gsap')` + `import('gsap/ScrollTrigger')` i rejestruje plugin dokładnie raz.

**2. Rezygnujemy z `useGSAP()` i z zależności `@gsap/react`.** Ten hook importuje GSAP w module
scope, więc jest niekompatybilny z leniwym ładowaniem — trzymanie go oznaczałoby, że GSAP wraca
na ścieżkę krytyczną przez tylne drzwi. To była jedyna rola tej paczki w projekcie.

**3. Cleanup przechodzi na `gsap.context()`** w zwykłym `useEffect`. To jest to samo, co
`useGSAP()` opakowuje: `context.revert()` w funkcji czyszczącej daje scoping i jednorazowe
sprzątnięcie ScrollTriggerów. Dodatkowo flaga `cancelled` obsługuje unmount, który zdarzy się,
gdy pobieranie GSAP jest jeszcze w locie.

**4. Przy `prefers-reduced-motion` GSAP nie jest pobierany w ogóle.** Efekt kończy się przed
`loadGsap()`, więc nie ma requestu.

## Konsekwencje

Dobre:

- 43 KB gzip mniej na starcie; największy pojedynczy element z listy zniknął ze ścieżki krytycznej.
- Jedna zależność mniej.
- Użytkownicy z reduced motion nie pobierają biblioteki animacyjnej.
- Tekst Manifesto **nadal jest w SSR HTML** — `ScrollLitText` renderuje słowa serwerowo, leniwe
  jest tylko sterowanie animacją. Zweryfikowane w prerenderowanym HTML.

Kosztowne:

- Ręczny cleanup zamiast hooka. Ryzyko jest realne i dlatego jest opisane w komentarzu w
  `scroll-lit-text.tsx` — kto doda drugi konsumenta GSAP, musi powtórzyć ten wzorzec.
- Animacja startuje o jedno pobranie później. Bez znaczenia: trigger to `top 78%`, więc i tak
  czeka na scroll.

## Alternatywy odrzucone

- **`next/dynamic` na `ScrollLitText`** — z `ssr: false` wypada tekst z HTML, co jest regresją SEO
  (`.agents/08` wymaga treści w źródle). Z `ssr: true` chunk i tak jest potrzebny do hydracji.
- **Zastąpienie efektu Motion** (Motion jest już w bundlu, więc GSAP mógłby wypaść całkowicie) —
  osobna decyzja projektowa o jakości efektu, nie zmiana wydajnościowa. ADR-0001 przypisał
  scroll-driven sekwencje GSAP-owi i ten podział zostaje.
- **Zostawienie stanu bez zmian** — 34 % gzipowanego initial JS na jeden efekt poniżej pierwszego
  ekranu nie broni się przy celu Lighthouse ≥ 90 z `.agents/08`.
