import { headers } from 'next/headers';
import { getCountryName } from '@/lib/countries';
import { HeroSection } from './hero';

export function HeroSectionWrapper() {
  const headersList = headers();
  const countryCode = headersList.get('x-geo-country');
  const countryName = getCountryName(countryCode ?? null);

  return <HeroSection countryName={countryName} />;
}
