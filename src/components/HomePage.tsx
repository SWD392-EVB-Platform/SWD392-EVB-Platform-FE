import React from 'react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section - Full width */}
      <HeroSection />
      
      {/* Other Sections */}
      <div className="container mx-auto px-4 py-8">
        <StatsSection />
        <CTASection />
      </div>
    </div>
  );
};

export default HomePage;
