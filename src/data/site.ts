export const site = {
  name: 'Sabrina The RMT',
  practitioner: 'Sabrina McMorran',
  email: 'massage@sabrinathermt.com',
  phone: '613-801-6160',
  phoneHref: 'tel:+16138016160',
  origin: 'https://sabrinathermt.com',
  logo: '/assets/sabrinathermt-logo-mulberry.png',
  registerUrl: 'https://cmto.ca.thentiacloud.net/webs/cmto/register/#/',
  booking: {
    main: 'https://sabrinathermt.janeapp.com/',
    gladstone: 'https://sabrinathermt.janeapp.com/locations/centretown-location/book',
    fourth: 'https://sabrinathermt.janeapp.com/locations/glebe-location/book',
  },
} as const;

export type Locale = 'en' | 'fr';

export const locations = [
  {
    id: 'gladstone',
    name: { en: 'Gladstone', fr: 'Gladstone' },
    area: { en: 'Centretown', fr: 'centre-ville d’Ottawa' },
    path: {
      en: '/locations/centretown-gladstone/',
      fr: '/fr/lieux/centre-ville-gladstone/',
    },
    address: 'Unit 1, 481 Gladstone Avenue, Ottawa, ON K1R 5N7',
    addressFr: 'Unité 1, 481, avenue Gladstone, Ottawa (Ontario) K1R 5N7',
    bookingUrl: site.booking.gladstone,
    image: {
      src: '/assets/locations/gladstone-entrance.jpg',
      alt: {
        en: 'Sabrina standing outside the 481 Gladstone Avenue entrance with a Sabrina The RMT sign.',
        fr: 'Sabrina devant l’entrée du 481, avenue Gladstone, avec une enseigne Sabrina The RMT.',
      },
    },
    mapUrl:
      'https://www.google.com/maps?q=Unit%201%2C%20481%20Gladstone%20Avenue%2C%20Ottawa%2C%20ON%20K1R%205N7&output=embed',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Unit%201%2C%20481%20Gladstone%20Avenue%2C%20Ottawa%2C%20ON%20K1R%205N7',
    seo: {
      en: {
        eyebrow: 'Centretown massage therapy',
        title: 'Registered Massage Therapist in Centretown Ottawa',
        heading: 'Massage therapy on Gladstone Avenue',
        description:
          'Book individualized massage therapy with Sabrina McMorran, RMT, at 481 Gladstone Avenue in Ottawa’s Centretown neighbourhood.',
        intro:
          'Sabrina sees clients at Unit 1, 481 Gladstone Avenue in Centretown. Choose the Gladstone location if central Ottawa is convenient for you, then use Jane to view current appointments, fees and policies.',
      },
      fr: {
        eyebrow: 'Massothérapie au centre-ville d’Ottawa',
        title: 'Massothérapeute inscrite au centre-ville d’Ottawa',
        heading: 'Massothérapie sur l’avenue Gladstone',
        description:
          'Prenez rendez-vous en massothérapie individualisée avec Sabrina McMorran, MTI, au 481, avenue Gladstone, au centre-ville d’Ottawa.',
        intro:
          'Sabrina reçoit ses clients à l’unité 1 du 481, avenue Gladstone, au centre-ville d’Ottawa. Choisissez le lieu Gladstone si le centre d’Ottawa vous convient, puis consultez Jane pour voir les rendez-vous, les tarifs et les politiques à jour.',
      },
    },
    hours: {
      en: [
        ['Sunday', 'By request only'],
        ['Monday', '8 a.m.–4 p.m.'],
        ['Wednesday', '8 a.m.–4 p.m.'],
      ],
      fr: [
        ['Dimanche', 'Sur demande seulement'],
        ['Lundi', '8 h–16 h'],
        ['Mercredi', '8 h–16 h'],
      ],
    },
    notes: {
      en: 'A designated waiting area is available. Free two-hour street parking is available on Gladstone Avenue and nearby side streets.',
      fr: 'Une aire d’attente désignée est disponible. Le stationnement sur rue est gratuit pendant deux heures sur l’avenue Gladstone et les rues avoisinantes.',
    },
  },
  {
    id: 'fourth',
    name: { en: 'Fourth', fr: 'Fourth' },
    area: { en: 'the Glebe', fr: 'le Glebe' },
    path: { en: '/locations/glebe-fourth/', fr: '/fr/lieux/glebe-fourth/' },
    venue: 'The Movement Co.',
    address: '101 Fourth Avenue, 2nd Floor, Ottawa, ON K1S 2L1',
    addressFr: '101, avenue Fourth, 2e étage, Ottawa (Ontario) K1S 2L1',
    bookingUrl: site.booking.fourth,
    image: {
      src: '/assets/locations/fourth-entrance.jpg',
      alt: {
        en: 'Sabrina at The Movement Co. entrance on Fourth Avenue with a Sabrina The RMT sign.',
        fr: 'Sabrina à l’entrée de The Movement Co. sur l’avenue Fourth avec une enseigne Sabrina The RMT.',
      },
    },
    mapUrl:
      'https://www.google.com/maps?q=The%20Movement%20Co.%2C%20101%20Fourth%20Avenue%2C%20Ottawa%2C%20ON%20K1S%202L1&output=embed',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=The%20Movement%20Co.%2C%20101%20Fourth%20Avenue%2C%20Ottawa%2C%20ON%20K1S%202L1',
    seo: {
      en: {
        eyebrow: 'Glebe massage therapy',
        title: 'Registered Massage Therapist in the Glebe, Ottawa',
        heading: 'Massage therapy on Fourth Avenue',
        description:
          'Book individualized massage therapy with Sabrina McMorran, RMT, at The Movement Co. on Fourth Avenue in Ottawa’s Glebe neighbourhood.',
        intro:
          'Sabrina sees clients on the second floor of The Movement Co. at 101 Fourth Avenue in the Glebe. Choose the Fourth location if the Glebe is convenient for you, then use Jane to view current appointments, fees and policies.',
      },
      fr: {
        eyebrow: 'Massothérapie dans le Glebe',
        title: 'Massothérapeute inscrite dans le Glebe à Ottawa',
        heading: 'Massothérapie sur l’avenue Fourth',
        description:
          'Prenez rendez-vous en massothérapie individualisée avec Sabrina McMorran, MTI, chez The Movement Co. sur l’avenue Fourth, dans le Glebe à Ottawa.',
        intro:
          'Sabrina reçoit ses clients au deuxième étage de The Movement Co., au 101, avenue Fourth, dans le Glebe. Choisissez le lieu Fourth si le Glebe vous convient, puis consultez Jane pour voir les rendez-vous, les tarifs et les politiques à jour.',
      },
    },
    hours: {
      en: [
        ['Tuesday', '8 a.m.–4 p.m.'],
        ['Thursday', '12 p.m.–8 p.m.'],
        ['Friday', 'By request only'],
      ],
      fr: [
        ['Mardi', '8 h–16 h'],
        ['Jeudi', '12 h–20 h'],
        ['Vendredi', 'Sur demande seulement'],
      ],
    },
    notes: {
      en: 'A waiting area is available. Parking in the area can be limited, so please allow extra time before your appointment.',
      fr: 'Une aire d’attente est disponible. Le stationnement dans le secteur peut être limité; prévoyez donc un peu plus de temps avant votre rendez-vous.',
    },
  },
] as const;

export const nav = {
  en: [
    { href: '/', label: 'Home' },
    { href: '/#locations', label: 'Locations' },
    { href: '/meet-sabrina/', label: 'Meet Sabrina' },
    { href: '/faq/', label: 'FAQ' },
  ],
  fr: [
    { href: '/fr/', label: 'Accueil' },
    { href: '/fr/#locations', label: 'Lieux' },
    { href: '/fr/rencontrez-sabrina/', label: 'Rencontrez Sabrina' },
    { href: '/fr/faq/', label: 'FAQ' },
  ],
} as const;

export const routePairs: Record<string, string> = {
  '/': '/fr/',
  '/meet-sabrina/': '/fr/rencontrez-sabrina/',
  '/faq/': '/fr/faq/',
  '/privacy/': '/fr/confidentialite/',
  '/locations/centretown-gladstone/': '/fr/lieux/centre-ville-gladstone/',
  '/locations/glebe-fourth/': '/fr/lieux/glebe-fourth/',
  '/fr/': '/',
  '/fr/rencontrez-sabrina/': '/meet-sabrina/',
  '/fr/faq/': '/faq/',
  '/fr/confidentialite/': '/privacy/',
  '/fr/lieux/centre-ville-gladstone/': '/locations/centretown-gladstone/',
  '/fr/lieux/glebe-fourth/': '/locations/glebe-fourth/',
};
