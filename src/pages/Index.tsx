import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FeaturedJobsSection } from '@/components/landing/FeaturedJobsSection';
import { CompaniesSection } from '@/components/landing/CompaniesSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedJobsSection />
        <CompaniesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
