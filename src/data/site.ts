export const site = {
  name: 'Sabrina The RMT',
  practitioner: 'Sabrina McMorran',
  email: 'sabrinathermt@gmail.com',
  origin: 'https://sabrinathermt.com',
  registerUrl: 'https://cmto.ca.thentiacloud.net/webs/cmto/register/#/',
  booking: {
    main: 'https://sabrinathermt.janeapp.com/',
    gladstone: 'https://sabrinathermt.janeapp.com/locations/gladstone-location/book',
    fourth: 'https://sabrinathermt.janeapp.com/locations/fourth-location/book',
  },
} as const;

export type Locale = 'en' | 'fr';

export const locations = [
  {
    id: 'gladstone',
    name: { en: 'Gladstone', fr: 'Gladstone' },
    address: 'Unit 1, 481 Gladstone Avenue, Ottawa, ON K1R 5N7',
    addressFr: 'Unité 1, 481, avenue Gladstone, Ottawa (Ontario) K1R 5N7',
    bookingUrl: site.booking.gladstone,
    mapUrl:
      'https://www.google.com/maps?q=Unit%201%2C%20481%20Gladstone%20Avenue%2C%20Ottawa%2C%20ON%20K1R%205N7&output=embed',
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
    venue: 'The Movement Co.',
    address: '101 Fourth Avenue, 2nd Floor, Ottawa, ON K1S 2L1',
    addressFr: '101, avenue Fourth, 2e étage, Ottawa (Ontario) K1S 2L1',
    bookingUrl: site.booking.fourth,
    mapUrl:
      'https://www.google.com/maps?q=The%20Movement%20Co.%2C%20101%20Fourth%20Avenue%2C%20Ottawa%2C%20ON%20K1S%202L1&output=embed',
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
    { href: '/meet-sabrina/', label: 'Meet Sabrina' },
    { href: '/faq/', label: 'FAQ' },
  ],
  fr: [
    { href: '/fr/', label: 'Accueil' },
    { href: '/fr/rencontrez-sabrina/', label: 'Rencontrez Sabrina' },
    { href: '/fr/faq/', label: 'FAQ' },
  ],
} as const;

export const routePairs: Record<string, string> = {
  '/': '/fr/',
  '/meet-sabrina/': '/fr/rencontrez-sabrina/',
  '/faq/': '/fr/faq/',
  '/privacy/': '/fr/confidentialite/',
  '/fr/': '/',
  '/fr/rencontrez-sabrina/': '/meet-sabrina/',
  '/fr/faq/': '/faq/',
  '/fr/confidentialite/': '/privacy/',
};
