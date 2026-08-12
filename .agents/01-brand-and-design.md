# 01 — Marka i kierunek wizualny

## Kierunek

**dark automotive premium + editorial + performance**

Strona ma przypominać nowoczesną kampanię motoryzacyjną, nie szablon strony lokalnej firmy.
Inspiracje: strony producentów premium, marek performance, studiów projektowych, kampanii produktowych.

Antywzorzec, którego unikamy: _czarne tło, złote logo, pięć identycznych kafelków_.

## Kolor

Wartości są zdefiniowane jako tokeny — patrz [02-design-system.md](02-design-system.md).
Tutaj jest zasada ich użycia.

| Rola             | Token                       | Zasada                                                                                      |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| Tło strony       | `canvas`                    | Nigdy `#000000`. Głębia bierze się z małych różnic między powierzchniami.                   |
| Karty, panele    | `surface`, `surface-raised` | Różnica między nimi jest subtelna i celowa.                                                 |
| Jasna przerwa    | `canvas-invert`             | **Tylko** sekcja Proces. Ma być zauważalną zmianą rytmu.                                    |
| Tekst            | `content`                   | Złamana biel, nie czysta.                                                                   |
| Tekst pomocniczy | `content-muted`             | Opisy, meta, podpisy.                                                                       |
| Tekst wygaszony  | `content-dim`               | Wyłącznie stan spoczynkowy tekstu rozjaśnianego scrollem. Nigdy dla treści do przeczytania. |
| Akcent           | `accent`                    | Racing lime.                                                                                |

### Reguła akcentu

Akcent działa jak **kontrolka w samochodzie sportowym**: rzadko, celowo, zawsze coś znaczy.

Dozwolone: CTA, aktywny element, duże liczby, małe oznaczenia (`MOST POPULAR`), progress, cursor, jeden fragment formularza.

Zakazane: całe sekcje w akcencie, akcent jako tło dużych bloków, akcent na tekście akapitowym, dwa różne akcenty.

Praktyczny limit: **maksymalnie jeden element w akcencie na widok** (poza CTA w navbarze).

## Typografia

| Rola                        | Rodzina     | Token          |
| --------------------------- | ----------- | -------------- |
| Nagłówki                    | Inter Tight | `font-display` |
| Tekst                       | Geist       | `font-sans`    |
| Etykiety, liczby techniczne | Geist Mono  | `font-mono`    |

Zasady:

- Nagłówki: duże, ciężkie, zwarte. `line-height` poniżej 1, ujemny `letter-spacing`. Czasami uppercase.
- Wielkość nagłówka jest płynna (`clamp`) — nie definiujemy osobnych rozmiarów per breakpoint.
- Tekst akapitowy: maksymalnie ~610 px szerokości (`max-w-measure`). Dłuższa linia = trudniejsze czytanie.
- Etykieta sekcji zawsze mono, uppercase, szeroki tracking, najmniejszy rozmiar na stronie.
- Nie mieszamy `font-display` z tekstem akapitowym i odwrotnie.

## Layout

- Maksymalna szerokość treści: `max-w-shell` (1600 px). Duże boczne marginesy.
- Pionowy padding sekcji: `py-section` (96–180 px, płynnie). Wariant `tight` dla sekcji krótszych.
- **Nie każda sekcja musi być w kontenerze.** Zdjęcia mogą wychodzić do krawędzi viewportu (`bleed`).
- Zaokrąglenia subtelne (12–20 px). Część powierzchni zostaje prostokątna — marka ma być motoryzacyjna, nie startupowa.
- Ramek jak najmniej. Jeżeli ramka, to `border-line` (bardzo niski kontrast).

## Fotografia — 50% efektu wizualnego

To najważniejszy element wizualny projektu. Zdjęcie ma wyglądać jak materiał reklamowy.

### Zakazane typy zdjęć

- Samochód na parkingu.
- Człowiek z gąbką.
- Pracownik z podniesionym kciukiem.
- Przypadkowe zdjęcia warsztatu.

### Hero

Ciemne studio detailingowe. Samochód pod kątem 30–45°.
Światło krawędziowe, wyraźne reflection lines na lakierze, mocny kontrast, dużo czerni.
Samochód **nie zajmuje całego kadru** — trzeba zostawić przestrzeń na typografię.

Preferowane auta: Porsche 911, BMW M3/M4, Audi RS5, Mercedes AMG GT/C43, sportowa Cupra.

### Zdjęcia detali (macro)

Przeplatane ze zdjęciami całych samochodów:
refleks na wypolerowanym lakierze, detal felgi, zacisk hamulcowy za ciemną felgą,
skórzana kierownica lub fotel, aplikacja powłoki, maszyna polerska w pracy,
krople wody na powłoce hydrofobowej, lampa inspekcyjna na lakierze.

### Portfolio

Nie same supersamochody. Wiarygodność rośnie, gdy pojawiają się też zwykłe auta premium
(Cupra Formentor, Tesla Model 3 obok Porsche 911).

### Grading — jeden język fotograficzny

Wszystkie zdjęcia muszą wyglądać jak **jedna sesja**:
ciemne studio / salon / nocne miasto, kontrolowane światło, chłodne cienie, mocne refleksy na lakierze,
bardzo głęboka czerń. Kilka ciepłych świateł jest w porządku — ciepły kadr jako całość nie.

To najczęściej łamana zasada w tym projekcie i najkosztowniejsza.
Cztery realizacje z czterech różnych sesji przewracają cały efekt premium, nawet jeśli każde zdjęcie
osobno jest dobre. Test jest jeden: **czy wygląda, jakby art director wybrał te kadry z jednej kampanii?**

Odrzucamy natychmiast, niezależnie od jakości zdjęcia:

- jasne niebo albo duża jasna plama na ciemnej stronie,
- przypadkowe otoczenie (pachołki, parkingi, znaki, wykładzina targowa),
- kadr, w którym nie widać lakieru,
- ciepły, „lifestyle'owy" grading.

### Grid realizacji

Galeria **nieregularna** — nie 3 × 2 identyczne kafle.
Przykładowy rytm: duże Porsche → dwa mniejsze obok siebie → duże pionowe BMW → panoramiczny detal Audi.
To daje charakter editorial.

## Mobile

Mobile nie jest pomniejszonym desktopem. Upraszczamy świadomie.

Zostaje: mocny hero, duże CTA, usługi, before/after, realizacje, opinie, formularz, sticky CTA.
Nagłówek hero: 48–64 px. CTA prawie pełnej szerokości.

Odpada: custom cursor, mocny parallax, wszystko zależne od hover, skomplikowane timeline'y.

Szczegóły w [05-animation-system.md](05-animation-system.md).
