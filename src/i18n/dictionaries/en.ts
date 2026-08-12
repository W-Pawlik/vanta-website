import type { Dictionary } from '../dictionaries'

/**
 * English dictionary.
 *
 * Typed against the Polish one, so a missing or renamed key fails the build.
 * Copy is adapted, not translated word for word — the brand voice matters more
 * than literal equivalence, and English car-detailing terminology differs.
 */
export const en: Dictionary = {
  meta: {
    title: 'Auto Detailing Warsaw | VANTA',
    description:
      'Professional detailing, paint correction and ceramic protection for cars that deserve more.',
  },

  common: {
    skipToContent: 'Skip to content',
    home: 'VANTA Auto Detailing — home',
    close: 'Close',
  },

  language: {
    label: 'Change language',
  },

  nav: {
    items: {
      services: 'Services',
      work: 'Work',
      process: 'Process',
      packages: 'Packages',
    },
    cta: 'Get a quote',
    mobileCta: 'Get a quote',
    main: 'Main navigation',
    mobile: 'Mobile navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  hero: {
    headline: ['Your car.', 'At its', 'absolute best.'],
    lead: 'Professional detailing, paint correction and ceramic protection for cars that deserve more.',
    cta: 'Get your car quoted',
    secondaryCta: 'See our work',
    projects: 'cars detailed',
    scroll: 'Scroll to explore',
    imageAlt:
      'Black Mercedes CLS in a dark detailing studio, edge lighting tracing the lines of the paint',
  },

  manifesto: {
    label: 'THE STANDARD',
    headline: ['We don’t hide', 'imperfections.', 'We remove them.'],
    body: 'At VANTA every car is treated individually. We match the process, the products and the protection to the condition of the paint, how the car is used, and the result you are after.',
    punchline: ['No guesswork.', 'No rushing.'],
  },

  services: {
    label: 'SERVICES',
    headline: ['Every detail', 'accounted for.'],
    aside:
      'Four categories of work. We match the scope to the condition of the paint and how the car is used, and you get an exact quote before anything starts.',
    priceNote: 'Indicative prices. The final quote depends on car size and paint condition.',
    pricelistCta: 'See the full price list',
    openDetails: 'See details',
    drawer: {
      region: 'Service details',
      variants: 'Options',
      includes: 'Included in every option',
      cta: 'Get this service quoted',
    },
    pricelist: {
      title: 'Indicative price list',
      intro: 'Individual services. Every price is a "from" price, for a car in good condition.',
      perUnit: 'ea.',
      question: 'Not sure what you need?',
      cta: 'Let us scope it with you',
      groups: {
        paint: 'Paint',
        wheels: 'Wheels and tyres',
        interior: 'Interior',
        glass: 'Glass',
        additional: 'Additional',
      },
      items: {
        'detailing-wash': {
          name: 'Detailing wash',
          description: 'Safe two-bucket method.',
        },
        decontamination: {
          name: 'Paint decontamination',
          description: 'Tar and iron fallout removal.',
        },
        'clay-bar': {
          name: 'Clay bar',
          description: 'Smoothing the surface before polishing.',
        },
        'correction-one-step': {
          name: 'One-step correction',
          description: 'Refreshes the paint and removes holograms.',
        },
        'correction-two-step': {
          name: 'Two-step correction',
          description: 'Deeper scratches and a stronger gain in depth.',
        },
        'correction-multi-step': {
          name: 'Multi-step correction',
          description: 'Maximum defect reduction.',
        },
        'wheel-detailing': {
          name: 'Wheel detailing',
          description: 'Cleaned on both faces.',
        },
        'wheel-decontamination': {
          name: 'Wheel decontamination',
          description: 'Brake dust deposits removed.',
        },
        'wheel-ceramic': {
          name: 'Ceramic coating for wheels',
          description: 'Easier cleaning, less baked-on dust.',
        },
        'tyre-dressing': {
          name: 'Tyre dressing',
          description: 'Satin finish, no wet-look shine.',
        },
        'seat-shampoo': {
          name: 'Seat shampoo',
          description: 'Hot-water extraction of fabric.',
        },
        'upholstery-shampoo': {
          name: 'Full upholstery shampoo',
          description: 'Seats, bench and mats.',
        },
        'leather-cleaning': {
          name: 'Leather cleaning',
          description: 'Gentle, without stripping the factory coating.',
        },
        'leather-conditioning': {
          name: 'Leather conditioning',
          description: 'Protects against drying and wear.',
        },
        ozone: {
          name: 'Ozone treatment',
          description: 'Neutralises odours and bacteria.',
        },
        'glass-polishing': {
          name: 'Glass polishing',
          description: 'Removes hazing and wiper marks.',
        },
        'glass-hydrophobic': {
          name: 'Hydrophobic glass coating',
          description: 'Better visibility in the rain.',
        },
        'glass-full-set': {
          name: 'All glass sealed',
          description: 'Full set including the rear screen.',
        },
        'engine-bay': {
          name: 'Engine bay detailing',
          description: 'Safe cleaning and trim care.',
        },
        'tar-removal': {
          name: 'Tar removal',
          description: 'Sills, bumpers and arches.',
        },
        'iron-fallout': {
          name: 'Iron fallout removal',
          description: 'Metal particles embedded in the paint.',
        },
        'presale-preparation': {
          name: 'Pre-sale preparation',
          description: 'Ready for photos and viewings.',
        },
      },
    },
    items: {
      'paint-correction': {
        name: 'Paint correction',
        description: 'Removing scratches, holograms and dullness. We bring the colour back.',
        imageAlt: 'A polisher working on dark car paint',
        includes: ['Paint decontamination', 'Surface preparation', 'Inspection under light'],
        variants: {
          'one-step': { name: 'One Step', description: 'Light dullness and minor holograms.' },
          'two-step': {
            name: 'Two Step',
            description: 'Deeper scratches and a clear gain in depth.',
          },
          'multi-step': {
            name: 'Multi Step',
            description: 'Maximum defect reduction, up to 90%.',
          },
        },
      },
      'paint-protection': {
        name: 'Paint protection',
        description: 'Protection after correction — from wax to a five-year ceramic coating.',
        imageAlt: 'Water beading on black paint protected by a ceramic coating',
        includes: [
          'Paint preparation',
          'Application in controlled conditions',
          'Aftercare guidance',
        ],
        variants: {
          wax: { name: 'Wax / sealant', description: 'One season of protection, applied quickly.' },
          'ceramic-1y': {
            name: '1-year coating',
            description: 'An entry into ceramic, easier washing.',
          },
          'ceramic-3y': {
            name: '3-year coating',
            description: 'The durability most clients pick.',
          },
          'ceramic-5y': { name: '5-year coating', description: 'Maximum durability and gloss.' },
        },
      },
      interior: {
        name: 'Interior detailing',
        description: 'Cleaning, conditioning and protection of every surface in the cabin.',
        imageAlt: 'Close-up of a leather seat in a dark car interior',
        includes: ['Vacuuming and detail cleaning', 'Trim conditioning', 'Odour neutralisation'],
        variants: {
          basic: { name: 'Basic', description: 'Thorough cleaning without shampooing.' },
          full: { name: 'Full', description: 'Upholstery shampoo and a full cabin refresh.' },
          leather: { name: 'Full + leather', description: 'Leather cleaned and conditioned.' },
        },
      },
      additional: {
        name: 'Additional services',
        description: 'Wheels, glass, engine bay and pre-sale preparation.',
        imageAlt: 'Black sports car in a dark detailing studio',
        includes: ['Quoted from photos', 'Can be combined with any other service'],
        variants: {
          wheels: {
            name: 'Wheels and tyres',
            description: 'Detailing, decontamination, ceramic, dressing.',
          },
          'engine-bay': {
            name: 'Engine bay',
            description: 'Safe cleaning and trim care.',
          },
          glass: { name: 'Glass', description: 'Polishing and a hydrophobic coating.' },
          presale: {
            name: 'Pre-sale preparation',
            description: 'Ready for photos and viewings.',
          },
        },
      },
    },
  },

  beforeAfter: {
    label: 'TRANSFORMATION',
    headline: ['The difference', 'is easier', 'to see.'],
    aside: 'Drag the separator to compare the paint before and after correction.',
    before: 'Before',
    after: 'After VANTA',
    sliderLabel: 'Before and after comparison — drag or use the arrow keys',
    sliderValue: 'of the “before” view',
    caseLabel: 'Project',
    scopeLabel: 'Scope of work',
    durationLabel: 'Turnaround',
    car: 'Mercedes-AMG GT',
    scope: ['Paint correction', 'Ceramic coating', 'Interior detail'],
    duration: '2 days',
    imageAlt: 'Macro of polished black paint — sharp light reflections across the body panel',
  },

  work: {
    label: 'SELECTED WORK',
    headline: ['The cars', 'speak for us.'],
    aside:
      'Selected projects from recent months. One photographic language, because every car is shot under the same conditions — otherwise a portfolio says nothing about quality.',
    statement: ['Detail is', 'everything.'],
    view: 'View',
    lightboxRegion: 'Enlarged project photograph',
    openFrame: 'Open photograph',
    items: {
      'porsche-911': {
        car: 'Porsche 911',
        scope: 'Correction + ceramic',
        imageAlt: 'Porsche 911 in a dark setting, side view',
      },
      'mercedes-amg-gt': {
        car: 'Mercedes-AMG GT',
        scope: 'Multi-stage correction + coating',
        imageAlt:
          'Mercedes-AMG GT in a dark studio, light lines tracing the body edges against black',
      },
      maserati: {
        car: 'Maserati',
        scope: 'Paint correction + glass',
        imageAlt: 'Rear fender of a black Maserati with sharp light reflections on the paint',
      },
    },
    closing: {
      title: 'The finish',
      scope: 'Reflection / Detail',
      imageAlt: 'Detail of the silhouette and wheel of a sports car in a dark frame',
    },
  },

  inlineCta: {
    text: 'Like what you see?',
    cta: 'Get your car quoted',
  },

  process: {
    label: 'PROCESS',
    headline: ['From the first', 'message to the last', 'reflection.'],
    aside: 'Four steps. No surprises. You know the scope and the cost before work begins.',
    steps: {
      contact: { title: 'Contact', description: 'A short form, or a few photos of the car.' },
      quote: { title: 'Quote', description: 'We set the scope and give you the cost up front.' },
      work: { title: 'The work', description: 'You leave the car with us. We take it from there.' },
      pickup: {
        title: 'Pick-up',
        description: 'You collect the car, with aftercare advice included.',
      },
    },
  },

  stats: {
    label: 'WHY VANTA',
    items: {
      projects: 'cars detailed',
      rating: 'average Google rating',
      years: 'years of experience',
      individual: 'individual approach',
    },
    manifesto: {
      headline: ['Detailing', 'has no', 'shortcuts.'],
      body: [
        'We work with proven products and we know exactly when less is more.',
        'We don’t push the most expensive package. We propose what your car actually needs.',
      ],
    },
  },

  packages: {
    label: 'COMPLETE PACKAGES',
    mostPopular: 'MOST POPULAR',
    headline: ['Complete', 'packages.'],
    aside:
      'Would rather not pick services one by one? These three sets cover the most common needs — from a refresh to a full transformation.',
    separateValue: 'Separately: {price}',
    items: {
      refresh: {
        name: 'Refresh',
        tagline: 'For cars that need bringing back to life.',
        features: [
          'Thorough detailing wash',
          'Paint decontamination',
          'Wheel cleaning',
          'Paint protection',
          'Basic interior clean',
        ],
        cta: 'Choose Refresh',
      },
      signature: {
        name: 'Signature',
        tagline: 'The scope most clients choose.',
        features: [
          'Full paint preparation',
          'Single-stage correction',
          'Interior detailing',
          'Ceramic coating',
          'Glass protection',
        ],
        cta: 'Choose Signature',
      },
      'black-label': {
        name: 'Black Label',
        tagline: 'Maximum finish, maximum protection.',
        features: [
          'Multi-stage paint correction',
          'Premium coating',
          'Interior detailing',
          'Wheel protection',
          'Glass protection',
          'Piano black trim protection',
          'Full finishing care',
        ],
        cta: 'Ask about Black Label',
      },
    },
  },

  testimonials: {
    label: 'REVIEWS',
    heading: 'Clients come back. So do their cars.',
    previous: 'Previous review',
    next: 'Next review',
    ratingLabel: 'Rated {value} out of 5',
    items: [
      {
        quote:
          'I brought the car in for correction and a ceramic coating. The result went well beyond what I expected. The paint looks better than the day I collected it from the dealer.',
        author: 'Michał K.',
        car: 'BMW M4 / Ceramic',
      },
      {
        quote:
          'Great communication, a straight quote and no upselling whatsoever. The car looks superb.',
        author: 'Adrian W.',
        car: 'Audi RS3 / Full Detail',
      },
      {
        quote:
          'The first detail where I genuinely saw the difference. I will be back with the next car.',
        author: 'Mateusz P.',
        car: 'Porsche 911 / Paint Correction',
      },
    ],
  },

  lead: {
    label: 'GET A QUOTE',
    headline: ['Let’s see what', 'your car', 'actually needs.'],
    lead: 'Answer three short questions. We will come back to you with an indicative quote and a proposed scope of work.',
    reassurance: ['Free of charge', 'No obligation', 'Same-day reply'],
    form: {
      progressLabel: 'Form progress',
      step1: 'What do you drive?',
      step2: 'What would you like to improve?',
      step2Hint: 'You can select more than one.',
      step3: 'Where should we send the quote?',
      carModel: 'Make and model (optional)',
      carModelPlaceholder: 'e.g. BMW M340i',
      name: 'First name',
      phone: 'Phone',
      email: 'Email (optional)',
      consent: 'I agree to be contacted by phone or email about my enquiry.',
      back: 'Back',
      next: 'Next',
      submit: 'Request a quote',
      submitting: 'Sending…',
      successTitle: 'Thanks. Your car is one step closer to VANTA.',
      successBody: 'We will get back to you about the quote — usually the same working day.',
      carTypes: {
        sedan: 'Saloon / estate',
        suv: 'SUV',
        coupe: 'Coupe / sports',
        other: 'Other',
      },
      interests: {
        paint: 'Paint',
        interior: 'Interior',
        ceramic: 'Ceramic',
        scratches: 'Scratches',
        full: 'Full detail',
        advice: 'Not sure — advise me',
      },
    },
  },

  finalCta: {
    headline: ['Your car', 'could look', 'better.'],
    cta: 'Book a detail',
    imageAlt: 'BMW M3 with headlights on, on a dark foggy road',
  },

  footer: {
    studio: 'Studio',
    contact: 'Contact',
    social: 'Social',
    legal: 'Privacy policy · Cookies',
  },

  notFound: {
    label: 'ERROR 404',
    headline: 'This page isn’t here.',
    body: 'The address may be out of date. Head back to the home page — everything that matters is there.',
    cta: 'Back to the home page',
  },

  errorPage: {
    label: 'SOMETHING WENT WRONG',
    headline: 'We couldn’t load this section.',
    body: 'Please try again. If it keeps happening, give us a call and we will book you in over the phone.',
    cta: 'Try again',
  },

  validation: {
    carType: 'Select a car type.',
    interests: 'Select at least one option.',
    name: 'Enter your first name.',
    phone: 'Enter a phone number (9 digits).',
    email: 'Enter a valid email address.',
    consent: 'Consent is required to send the enquiry.',
    maxLength: 'Maximum {max} characters.',
    formInvalid: 'Please check the highlighted fields and try again.',
    deliveryFailed: 'We couldn’t send your enquiry. Please try again or give us a call.',
  },
}
