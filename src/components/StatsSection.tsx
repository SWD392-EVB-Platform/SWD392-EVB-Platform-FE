import React from 'react';

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-yellow-400 mb-2">{value}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { value: "1000+", label: "Happy customers" },
    { value: "500+", label: "Quality products" },
    { value: "24/7", label: "Customer support" }
  ];

  return (
    <div className="bg-gray-900 text-white rounded-lg p-8 mt-12">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Our impressive numbers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <StatItem key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
