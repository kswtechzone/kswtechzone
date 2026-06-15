'use client';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KSW TechZone',
    url: 'https://kswtechzone.com',
    logo: 'https://kswtechzone.com/Logo.png',
    description: 'KSW TechZone is a Nepal-based technology company specializing in custom software development, web applications, mobile apps, SaaS, AI solutions, and digital marketing.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-1-4XXXXXX',
      contactType: 'customer service',
      email: 'info@kswtechzone.com',
    },
    sameAs: [
      'https://www.facebook.com/kswtechzone',
      'https://www.linkedin.com/company/kswtechzone',
      'https://twitter.com/kswtechzone',
      'https://www.instagram.com/kswtechzone',
    ],
    offers: [
      { '@type': 'Service', name: 'Web Development', description: 'Custom web applications and websites' },
      { '@type': 'Service', name: 'Mobile App Development', description: 'iOS and Android mobile applications' },
      { '@type': 'Service', name: 'SaaS Development', description: 'Scalable SaaS platform development' },
      { '@type': 'Service', name: 'Digital Marketing', description: 'SEO, SEM, and social media marketing' },
      { '@type': 'Service', name: 'AI Solutions', description: 'AI and machine learning solutions' },
      { '@type': 'Service', name: 'Cloud Solutions', description: 'Cloud infrastructure and DevOps' },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
