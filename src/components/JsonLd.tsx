'use client';

import { usePathname } from 'next/navigation';

export function JsonLd() {
  const pathname = usePathname();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://kswtechzone.com/#website',
        url: 'https://kswtechzone.com',
        name: 'KSW TechZone',
        alternateName: 'KSW TechZone Nepal',
        description:
          'KSW TechZone is a Nepal-based technology company specializing in custom software development, web applications, mobile apps, SaaS, AI solutions, and digital marketing.',
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://kswtechzone.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://kswtechzone.com/#organization',
        name: 'KSW TechZone',
        url: 'https://kswtechzone.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://kswtechzone.com/logo.png',
          width: 512,
          height: 512,
        },
        description:
          'A Nepal-based technology company delivering enterprise-grade software solutions including web development, mobile apps, SaaS, and AI for businesses worldwide.',
        foundingDate: '2020',
        foundingLocation: {
          '@type': 'Place',
          name: 'Kathmandu, Nepal',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kathmandu',
          addressLocality: 'Kathmandu',
          addressRegion: 'Bagmati',
          postalCode: '44600',
          addressCountry: 'NP',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+977-9863198323',
            contactType: 'customer service',
            email: 'kswtechzone@gmail.com',
            availableLanguage: ['English', 'Nepali'],
          },
          {
            '@type': 'ContactPoint',
            telephone: '+977-9863198323',
            contactType: 'sales',
            email: 'kswtechzone@gmail.com',
            availableLanguage: ['English', 'Nepali'],
          },
        ],
        sameAs: [
          'https://www.facebook.com/kswtechzone',
          'https://www.linkedin.com/company/kswtechzone',
          'https://twitter.com/kswtechzone',
          'https://www.instagram.com/kswtechzone',
          'https://www.youtube.com/@kswtechzone',
          'https://github.com/kswtechzone',
        ],
        keywords: [
          'KSW TechZone',
          'best software company in Nepal',
          'web development Nepal',
          'mobile app development Kathmandu',
          'SaaS development Nepal',
          'digital marketing agency Nepal',
          'AI solutions Nepal',
          'cloud computing Kathmandu',
          'custom software development Nepal',
          'IT services Nepal',
          'software company Kathmandu',
          'tech services Nepal',
          'KSW TechZone services',
          'affordable web development Nepal',
          'enterprise software Nepal',
        ],
        offers: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SaaS Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Solutions' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud Solutions' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI UX Design' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Consulting' } },
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://kswtechzone.com/#localbusiness',
        name: 'KSW TechZone',
        image: 'https://kswtechzone.com/logo.png',
        url: 'https://kswtechzone.com',
        telephone: '+977-9863198323',
        email: 'kswtechzone@gmail.com',
        priceRange: '$$',
        openingHours: 'Mo-Fr 09:00-18:00',
        currenciesAccepted: 'NPR, USD',
        paymentAccepted: ['Cash', 'Bank Transfer', 'eSewa', 'Khalti'],
        areaServed: ['Nepal', 'United States', 'Australia', 'United Kingdom', 'Canada'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Digital Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
