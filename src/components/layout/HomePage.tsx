import React from 'react';
import { HeroSection, CTASection } from '@/components/features/hero';
import { FeaturesSection } from '@/components/features/features';
import { StatsSection } from '@/components/features/stats';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </div>
    </div>
  );
};

export default HomePage;
