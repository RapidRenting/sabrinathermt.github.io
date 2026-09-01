import { locations, site, type Locale } from './site';

type Location = (typeof locations)[number];

const businessId = `${site.origin}/#business`;
const personId = `${site.origin}/#sabrina-mcmorran`;

function absolute(path: string) {
  return new URL(path, site.origin).href;
}

function postalAddress(location: Location) {
  return {
    '@type': 'PostalAddress',
    streetAddress: location.address.split(', Ottawa')[0],
    addressLocality: 'Ottawa',
    addressRegion: 'ON',
    postalCode: location.address.slice(-7),
    addressCountry: 'CA',
  };
}

function person() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.practitioner,
    jobTitle: 'Registered Massage Therapist',
    url: `${site.origin}/meet-sabrina/`,
    email: site.email,
    telephone: '+16138016160',
    knowsLanguage: ['en', 'fr'],
    worksFor: { '@id': businessId },
  };
}

function organization() {
  return {
    '@type': 'Organization',
    '@id': businessId,
    name: site.name,
    url: site.origin,
    logo: absolute(site.logo),
    email: site.email,
    telephone: '+16138016160',
    employee: { '@id': personId },
  };
}

function locationBusiness(location: Location, locale: Locale) {
  return {
    '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
    '@id': `${absolute(location.path.en)}#business`,
    name: `${site.name} — ${location.name[locale]}`,
    url: absolute(location.path[locale]),
    image: absolute(location.image.src),
    email: site.email,
    telephone: '+16138016160',
    address: postalAddress(location),
    hasMap: location.directionsUrl,
    parentOrganization: { '@id': businessId },
    employee: { '@id': personId },
  };
}

export function homeStructuredData(locale: Locale) {
  const path = locale === 'en' ? '/' : '/fr/';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.origin}/#website`,
        name: site.name,
        url: site.origin,
        inLanguage: locale === 'en' ? 'en-CA' : 'fr-CA',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${absolute(path)}#webpage`,
        url: absolute(path),
        name:
          locale === 'en'
            ? 'Registered Massage Therapist in Ottawa'
            : 'Massothérapeute inscrite à Ottawa',
        inLanguage: locale === 'en' ? 'en-CA' : 'fr-CA',
        isPartOf: { '@id': `${site.origin}/#website` },
        about: { '@id': businessId },
      },
      organization(),
      person(),
      ...locations.map((location) => locationBusiness(location, locale)),
    ],
  };
}

export function locationStructuredData(location: Location, locale: Locale) {
  const pageUrl = absolute(location.path[locale]);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: location.seo[locale].title,
        description: location.seo[locale].description,
        inLanguage: locale === 'en' ? 'en-CA' : 'fr-CA',
        mainEntity: { '@id': `${absolute(location.path.en)}#business` },
      },
      organization(),
      person(),
      locationBusiness(location, locale),
    ],
  };
}
