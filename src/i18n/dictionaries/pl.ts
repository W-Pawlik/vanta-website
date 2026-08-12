/**
 * Polish dictionary — the **source of truth for the dictionary shape**.
 * `en.ts` is typed against it, so a missing key is a compile error, not a gap
 * discovered in production.
 *
 * Only words live here. Prices, image paths, slugs, aspect ratios and parallax
 * ranges stay in `src/data/` — they are the same in every language.
 */
export const pl = {
  meta: {
    title: 'Auto Detailing Warszawa | VANTA',
    description:
      'Profesjonalny detailing, korekta lakieru i zabezpieczenia ceramiczne dla samochodów, które zasługują na więcej.',
  },

  common: {
    skipToContent: 'Przejdź do treści',
    home: 'VANTA Auto Detailing — strona główna',
    close: 'Zamknij',
  },

  language: {
    label: 'Zmień język',
  },

  nav: {
    items: {
      services: 'Usługi',
      work: 'Realizacje',
      process: 'Proces',
      packages: 'Pakiety',
    },
    cta: 'Wyceń auto',
    mobileCta: 'Wyceń samochód',
    main: 'Nawigacja główna',
    mobile: 'Nawigacja mobilna',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
  },

  hero: {
    headline: ['Twój samochód.', 'W najlepszej', 'formie.'],
    lead: 'Profesjonalny detailing, korekta lakieru i zabezpieczenia ceramiczne dla samochodów, które zasługują na więcej.',
    cta: 'Wyceń swój samochód',
    secondaryCta: 'Zobacz realizacje',
    projects: 'realizacji',
    scroll: 'Scroll to explore',
    imageAlt:
      'Czarny Mercedes CLS w ciemnym studiu detailingowym, światło krawędziowe podkreśla linie lakieru',
  },

  manifesto: {
    label: 'THE STANDARD',
    headline: ['Nie maskujemy', 'niedoskonałości.', 'Usuwamy je.'],
    body: 'W VANTA każdy samochód traktujemy indywidualnie. Dobieramy proces, kosmetyki i zabezpieczenie do stanu lakieru, sposobu użytkowania auta i efektu, którego oczekujesz.',
    punchline: ['Bez przypadkowych rozwiązań.', 'Bez pośpiechu.'],
  },

  services: {
    label: 'SERVICES',
    headline: ['Zadbamy o', 'każdy detal.'],
    aside:
      'Cztery kategorie prac. Zakres dobieramy do stanu lakieru i sposobu użytkowania auta, a dokładną wycenę przedstawiamy przed realizacją.',
    priceNote: 'Ceny orientacyjne. Finalna wycena zależy od wielkości auta i stanu lakieru.',
    pricelistCta: 'Zobacz pełny cennik',
    openDetails: 'Zobacz szczegóły',
    drawer: {
      region: 'Szczegóły usługi',
      variants: 'Warianty',
      includes: 'W każdym wariancie',
      cta: 'Wyceń tę usługę',
    },
    pricelist: {
      title: 'Cennik orientacyjny',
      intro: 'Pojedyncze usługi. Wszystkie ceny są cenami „od”, dla auta w dobrym stanie.',
      perUnit: 'szt.',
      question: 'Nie wiesz, czego potrzebujesz?',
      cta: 'Dobierzmy zakres',
      groups: {
        paint: 'Lakier',
        wheels: 'Felgi i opony',
        interior: 'Wnętrze',
        glass: 'Szyby',
        additional: 'Dodatkowe',
      },
      items: {
        'detailing-wash': {
          name: 'Mycie detailingowe',
          description: 'Bezpieczne mycie dwuwiadrowe.',
        },
        decontamination: {
          name: 'Dekontaminacja lakieru',
          description: 'Usuwanie smoły i osadów metalicznych.',
        },
        'clay-bar': {
          name: 'Glinkowanie',
          description: 'Wygładzenie powierzchni przed polerowaniem.',
        },
        'correction-one-step': {
          name: 'Korekta One Step',
          description: 'Odświeżenie lakieru i usunięcie hologramów.',
        },
        'correction-two-step': {
          name: 'Korekta Two Step',
          description: 'Mocniejsze rysy i głębsza poprawa koloru.',
        },
        'correction-multi-step': {
          name: 'Korekta Multi Step',
          description: 'Maksymalna redukcja defektów.',
        },
        'wheel-detailing': {
          name: 'Detailing felg',
          description: 'Czyszczenie felgi z obu stron.',
        },
        'wheel-decontamination': {
          name: 'Dekontaminacja felg',
          description: 'Usuwanie osadów z klocków hamulcowych.',
        },
        'wheel-ceramic': {
          name: 'Ceramika na felgi',
          description: 'Łatwiejsze mycie i ochrona przed zapiekaniem.',
        },
        'tyre-dressing': {
          name: 'Dressing opon',
          description: 'Satynowe wykończenie, bez efektu mokrej gumy.',
        },
        'seat-shampoo': {
          name: 'Pranie fotela',
          description: 'Ekstrakcja tapicerki materiałowej.',
        },
        'upholstery-shampoo': {
          name: 'Pranie kompletu tapicerki',
          description: 'Fotele, kanapa i dywaniki.',
        },
        'leather-cleaning': {
          name: 'Czyszczenie skóry',
          description: 'Delikatne, bez naruszania powłoki fabrycznej.',
        },
        'leather-conditioning': {
          name: 'Impregnacja skóry',
          description: 'Ochrona przed przesuszeniem i przetarciami.',
        },
        ozone: {
          name: 'Ozonowanie',
          description: 'Neutralizacja zapachów i bakterii.',
        },
        'glass-polishing': {
          name: 'Polerowanie szyby',
          description: 'Usuwanie zmatowień i śladów wycieraczek.',
        },
        'glass-hydrophobic': {
          name: 'Powłoka hydrofobowa',
          description: 'Lepsza widoczność w deszczu.',
        },
        'glass-full-set': {
          name: 'Zabezpieczenie wszystkich szyb',
          description: 'Komplet szyb wraz z tylną.',
        },
        'engine-bay': {
          name: 'Detailing komory silnika',
          description: 'Bezpieczne czyszczenie i pielęgnacja tworzyw.',
        },
        'tar-removal': {
          name: 'Usuwanie smoły',
          description: 'Progi, zderzaki i nadkola.',
        },
        'iron-fallout': {
          name: 'Usuwanie osadów metalicznych',
          description: 'Cząstki metalu wtopione w lakier.',
        },
        'presale-preparation': {
          name: 'Przygotowanie auta do sprzedaży',
          description: 'Auto gotowe na zdjęcia i oglądanie.',
        },
      },
    },
    items: {
      'paint-correction': {
        name: 'Korekta lakieru',
        description: 'Usuwanie zarysowań, hologramów i zmatowień. Przywracamy głębię koloru.',
        imageAlt: 'Maszyna polerska pracująca na ciemnym lakierze samochodu',
        includes: ['Dekontaminacja lakieru', 'Przygotowanie powierzchni', 'Inspekcja pod lampą'],
        variants: {
          'one-step': { name: 'One Step', description: 'Lekkie zmatowienia i drobne hologramy.' },
          'two-step': {
            name: 'Two Step',
            description: 'Mocniejsze rysy i wyraźniejsza poprawa głębi.',
          },
          'multi-step': {
            name: 'Multi Step',
            description: 'Maksymalna redukcja defektów, do 90%.',
          },
        },
      },
      'paint-protection': {
        name: 'Ochrona lakieru',
        description: 'Zabezpieczenie po korekcie — od wosku po powłokę ceramiczną na pięć lat.',
        imageAlt: 'Krople wody perlące się na czarnym lakierze zabezpieczonym powłoką ceramiczną',
        includes: [
          'Przygotowanie lakieru',
          'Aplikacja w kontrolowanych warunkach',
          'Zalecenia do pielęgnacji',
        ],
        variants: {
          wax: { name: 'Wosk / sealant', description: 'Ochrona na jeden sezon, szybka aplikacja.' },
          'ceramic-1y': {
            name: 'Powłoka 1 rok',
            description: 'Wejście w ceramikę i łatwiejsze mycie.',
          },
          'ceramic-3y': { name: 'Powłoka 3 lata', description: 'Najczęściej wybierana trwałość.' },
          'ceramic-5y': { name: 'Powłoka 5 lat', description: 'Maksymalna trwałość i połysk.' },
        },
      },
      interior: {
        name: 'Detailing wnętrza',
        description: 'Czyszczenie, pielęgnacja i zabezpieczenie każdego elementu kabiny.',
        imageAlt: 'Detal skórzanego fotela w ciemnym wnętrzu samochodu',
        includes: [
          'Odkurzanie i czyszczenie detali',
          'Pielęgnacja tworzyw',
          'Neutralizacja zapachów',
        ],
        variants: {
          basic: { name: 'Basic', description: 'Kompleksowe czyszczenie bez prania tapicerki.' },
          full: { name: 'Full', description: 'Pranie tapicerki i pełne odświeżenie kabiny.' },
          leather: { name: 'Full + skóra', description: 'Czyszczenie i impregnacja skóry.' },
        },
      },
      additional: {
        name: 'Usługi dodatkowe',
        description: 'Felgi, szyby, komora silnika i przygotowanie auta do sprzedaży.',
        imageAlt: 'Czarny samochód sportowy w ciemnym studiu detailingowym',
        includes: ['Wycena po zdjęciach', 'Można łączyć z pozostałymi usługami'],
        variants: {
          wheels: {
            name: 'Felgi i opony',
            description: 'Detailing, dekontaminacja, ceramika, dressing.',
          },
          'engine-bay': {
            name: 'Komora silnika',
            description: 'Bezpieczne czyszczenie i pielęgnacja tworzyw.',
          },
          glass: { name: 'Szyby', description: 'Polerowanie i powłoka hydrofobowa.' },
          presale: {
            name: 'Przygotowanie do sprzedaży',
            description: 'Auto gotowe na zdjęcia i oglądanie.',
          },
        },
      },
    },
  },

  beforeAfter: {
    label: 'TRANSFORMATION',
    headline: ['Różnicę', 'najlepiej', 'zobaczyć.'],
    aside: 'Przeciągnij separator, żeby porównać stan lakieru przed i po korekcie.',
    before: 'Przed',
    after: 'Po VANTA',
    sliderLabel: 'Porównanie przed i po — przeciągnij lub użyj strzałek',
    sliderValue: 'widoku „przed”',
    beforeAlt:
      'Ten sam bok przed korektą — lakier pokryty swirlami i mikrozarysowaniami, refleksy rozmyte',
    caseLabel: 'Realizacja',
    scopeLabel: 'Zakres prac',
    durationLabel: 'Czas realizacji',
    car: 'Porsche',
    scope: ['Dwuetapowa korekta lakieru', 'Powłoka ceramiczna', 'Zabezpieczenie felg'],
    duration: '2 dni',
    imageAlt: 'Bok czarnego Porsche po korekcie — ostre, głębokie refleksy świateł hali w lakierze',
  },

  work: {
    label: 'SELECTED WORK',
    headline: ['Samochody', 'mówią za nas.'],
    aside:
      'Wybrane realizacje z ostatnich miesięcy. Jeden język zdjęć, bo każde auto fotografujemy w tych samych warunkach — inaczej portfolio nic nie mówi o jakości.',
    statement: ['Detail is', 'everything.'],
    view: 'Zobacz',
    lightboxRegion: 'Powiększone zdjęcie realizacji',
    openFrame: 'Otwórz zdjęcie',
    items: {
      'porsche-911': {
        car: 'Porsche 911',
        scope: 'Korekta + ceramika',
        imageAlt: 'Porsche 911 w ciemnym otoczeniu, widok z boku',
      },
      'mercedes-amg-gt': {
        car: 'Mercedes-AMG GT',
        scope: 'Wieloetapowa korekta + coating',
        imageAlt:
          'Mercedes-AMG GT w ciemnym studiu, linie światła rysują krawędzie nadwozia na czarnym tle',
      },
      maserati: {
        car: 'Maserati',
        scope: 'Korekta lakieru + szyby',
        imageAlt: 'Tylny błotnik czarnego Maserati z ostrymi refleksami świateł na lakierze',
      },
    },
    closing: {
      title: 'The finish',
      scope: 'Reflection / Detail',
      imageAlt: 'Detal sylwetki i felgi sportowego samochodu w ciemnym kadrze',
    },
  },

  inlineCta: {
    text: 'Podoba Ci się efekt?',
    cta: 'Wyceń swój samochód',
  },

  process: {
    label: 'PROCESS',
    headline: ['Od pierwszej', 'wiadomości do ostatniego', 'refleksu.'],
    aside: 'Cztery kroki. Zero niespodzianek. Zakres i koszt znasz przed rozpoczęciem prac.',
    steps: {
      contact: { title: 'Kontakt', description: 'Krótki formularz albo kilka zdjęć auta.' },
      quote: {
        title: 'Wycena',
        description: 'Dobieramy zakres prac i podajemy koszt przed startem.',
      },
      work: {
        title: 'Realizacja',
        description: 'Zostawiasz auto w studio. Resztą zajmujemy się my.',
      },
      pickup: {
        title: 'Odbiór',
        description: 'Odbierasz samochód z zaleceniami do dalszej pielęgnacji.',
      },
    },
  },

  stats: {
    label: 'WHY VANTA',
    items: {
      projects: 'zrealizowanych samochodów',
      rating: 'średnia ocen w Google',
      years: 'lat doświadczenia',
      individual: 'indywidualnego podejścia',
    },
    manifesto: {
      headline: ['Detailingu', 'nie robi się', 'na skróty.'],
      body: [
        'Pracujemy na sprawdzonych produktach i dokładnie wiemy, kiedy mniej znaczy więcej.',
        'Nie proponujemy najdroższego pakietu. Proponujemy rozwiązanie odpowiednie dla Twojego auta.',
      ],
    },
  },

  packages: {
    label: 'COMPLETE PACKAGES',
    mostPopular: 'NAJCZĘŚCIEJ WYBIERANY',
    headline: ['Pakiety', 'kompleksowe.'],
    aside:
      'Nie chcesz dobierać usług osobno? Wybraliśmy trzy zestawy, które pokrywają najczęstsze potrzeby — od odświeżenia po pełną metamorfozę.',
    /** `{price}` is the value of the same services bought separately. */
    separateValue: 'Osobno: {price}',
    items: {
      refresh: {
        name: 'Refresh',
        tagline: 'Dla samochodów wymagających odświeżenia.',
        features: [
          'Dokładne mycie detailingowe',
          'Dekontaminacja lakieru',
          'Oczyszczenie felg',
          'Zabezpieczenie lakieru',
          'Podstawowe czyszczenie wnętrza',
        ],
        cta: 'Wybieram Refresh',
      },
      signature: {
        name: 'Signature',
        tagline: 'Najczęściej wybierany zakres prac.',
        features: [
          'Pełne przygotowanie lakieru',
          'Jednoetapowa korekta',
          'Detailing wnętrza',
          'Powłoka ceramiczna',
          'Zabezpieczenie szyb',
        ],
        cta: 'Wybieram Signature',
      },
      'black-label': {
        name: 'Black Label',
        tagline: 'Maksymalny efekt i maksymalna ochrona.',
        features: [
          'Wieloetapowa korekta lakieru',
          'Premium coating',
          'Detailing wnętrza',
          'Zabezpieczenie felg',
          'Zabezpieczenie szyb',
          'Zabezpieczenie elementów piano black',
          'Pełna pielęgnacja wykończeniowa',
        ],
        cta: 'Zapytaj o Black Label',
      },
    },
  },

  testimonials: {
    label: 'REVIEWS',
    heading: 'Klienci wracają. Ich auta też.',
    previous: 'Poprzednia opinia',
    next: 'Następna opinia',
    ratingLabel: 'Ocena {value} z 5',
    items: [
      {
        quote:
          'Oddałem auto na korektę i ceramikę. Efekt zdecydowanie przekroczył moje oczekiwania. Lakier wygląda lepiej niż przy odbiorze samochodu z salonu.',
        author: 'Michał K.',
        car: 'BMW M4 / Ceramic',
      },
      {
        quote:
          'Świetny kontakt, konkretna wycena i zero naciągania na dodatkowe usługi. Auto wygląda rewelacyjnie.',
        author: 'Adrian W.',
        car: 'Audi RS3 / Full Detail',
      },
      {
        quote:
          'Pierwszy detailing, po którym naprawdę zobaczyłem różnicę. Na pewno wrócę z kolejnym samochodem.',
        author: 'Mateusz P.',
        car: 'Porsche 911 / Paint Correction',
      },
    ],
  },

  lead: {
    label: 'WYCENA',
    headline: ['Zobaczmy, czego', 'potrzebuje', 'Twoje auto.'],
    lead: 'Odpowiedz na trzy krótkie pytania. Skontaktujemy się z Tobą z orientacyjną wyceną i propozycją zakresu prac.',
    reassurance: ['Bezpłatnie', 'Bez zobowiązań', 'Odpowiedź tego samego dnia'],
    form: {
      progressLabel: 'Postęp formularza',
      step1: 'Jakim autem jeździsz?',
      step2: 'Co chcesz poprawić?',
      step2Hint: 'Możesz wybrać więcej niż jedną pozycję.',
      step3: 'Gdzie wysłać wycenę?',
      carModel: 'Marka i model (opcjonalnie)',
      carModelPlaceholder: 'np. BMW M340i',
      name: 'Imię',
      phone: 'Telefon',
      email: 'E-mail (opcjonalnie)',
      consent: 'Zgadzam się na kontakt telefoniczny lub e-mailowy w sprawie mojego zapytania.',
      back: 'Wstecz',
      next: 'Dalej',
      submit: 'Poproś o wycenę',
      submitting: 'Wysyłamy…',
      successTitle: 'Dzięki. Auto jest już o krok bliżej do VANTA.',
      successBody: 'Skontaktujemy się z Tobą w sprawie wyceny — zwykle tego samego dnia roboczego.',
      carTypes: {
        sedan: 'Sedan / kombi',
        suv: 'SUV',
        coupe: 'Coupe / sport',
        other: 'Inne',
      },
      interests: {
        paint: 'Lakier',
        interior: 'Wnętrze',
        ceramic: 'Ceramika',
        scratches: 'Rysy',
        full: 'Kompleksowy detailing',
        advice: 'Nie wiem — doradźcie mi',
      },
    },
  },

  finalCta: {
    headline: ['Twój samochód', 'może wyglądać', 'lepiej.'],
    cta: 'Umów detailing',
    imageAlt: 'BMW M3 z włączonymi reflektorami na ciemnej, zamglonej drodze',
  },

  footer: {
    studio: 'Studio',
    contact: 'Kontakt',
    social: 'Social',
    legal: 'Polityka prywatności · Cookies',
  },

  notFound: {
    label: 'BŁĄD 404',
    headline: 'Tej strony tu nie ma.',
    body: 'Możliwe, że adres jest nieaktualny. Wróć na stronę główną — wszystko, co ważne, jest tam.',
    cta: 'Wróć na stronę główną',
  },

  errorPage: {
    label: 'COŚ POSZŁO NIE TAK',
    headline: 'Nie udało się wczytać tej sekcji.',
    body: 'Spróbuj ponownie. Jeśli problem się powtarza, zadzwoń — umówimy termin telefonicznie.',
    cta: 'Spróbuj ponownie',
  },

  validation: {
    carType: 'Wybierz typ samochodu.',
    interests: 'Wybierz przynajmniej jedną pozycję.',
    name: 'Podaj imię.',
    phone: 'Podaj numer telefonu (9 cyfr).',
    email: 'Podaj poprawny adres e-mail.',
    consent: 'Zgoda jest wymagana, aby wysłać zgłoszenie.',
    maxLength: 'Maksymalnie {max} znaków.',
    formInvalid: 'Sprawdź zaznaczone pola i spróbuj ponownie.',
    deliveryFailed: 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń do nas.',
  },
}
