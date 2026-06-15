import { HeroSectionWrapper } from '@/components/home/hero-wrapper';
import { ServicesOverview } from '@/components/home/services-overview';
import { ProductsShowcase } from '@/components/home/products-showcase';
import { StatsSection } from '@/components/home/stats-section';
import { TestimonialsSection } from '@/components/home/testimonials';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSectionWrapper />
      <ServicesOverview />
      <ProductsShowcase />
      <StatsSection />
      <TestimonialsSection />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
