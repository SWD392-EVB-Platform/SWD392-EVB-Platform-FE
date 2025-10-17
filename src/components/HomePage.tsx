import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';

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
