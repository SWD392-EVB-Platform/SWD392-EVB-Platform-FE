import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="text-yellow-400 hover:text-yellow-500 font-medium transition-colors duration-200">
        View more →
      </button>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "🔋",
      title: "EV Batteries",
      description: "Explore high-quality EV batteries with advanced technology"
    },
    {
      icon: "🚗",
      title: "Electric Vehicles",
      description: "Find EVs that fit your needs and budget"
    },
    {
      icon: "🛠️",
      title: "Services",
      description: "Professional support and warranty by experienced technicians"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeaturesSection;
