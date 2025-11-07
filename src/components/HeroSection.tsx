import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';

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
        <div className="flex flex-col items-center justify-center gap-6">
          <Link 
            href={ROUTES.SEARCH}
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black text-xl font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200"
          >
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            Start Shopping
          </Link>
          <p className="text-lg text-gray-700">
            Find your perfect electric vehicle or battery today
          </p>
          <div className="flex gap-4">
            <Link
              href={`${ROUTES.SEARCH}?type=xe`}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Browse EVs
            </Link>
            <Link
              href={`${ROUTES.SEARCH}?type=pin`} 
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Browse Batteries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
