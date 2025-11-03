/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to EVB Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Vietnam's leading marketplace for electric vehicles and batteries
      </p>
      
      {/* Hero CTA */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Why choose EVB Platform?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          We provide end-to-end solutions for your EV and battery needs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200">
            Explore now
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors duration-200">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
