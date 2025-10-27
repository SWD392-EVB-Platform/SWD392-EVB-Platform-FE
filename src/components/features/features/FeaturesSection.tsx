import Link from 'next/link';
import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🔋',
      title: 'EV Batteries',
      description: 'Explore high-quality EV batteries with advanced technology',
      href: '/post-listing', // Link to PostListing for EV Batteries
    },
    {
      icon: '🚗',
      title: 'Electric Vehicles',
      description: 'Find EVs that fit your needs and budget',
      href: '/electric-vehicles', // Placeholder for another route
    },
    {
      icon: '🛠️',
      title: 'Services',
      description: 'Professional support and warranty by experienced technicians',
      href: '/services', // Placeholder for another route
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link
                href={feature.href}
                className="text-yellow-400 hover:text-yellow-500 font-medium transition-colors duration-200"
              >
                View more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;