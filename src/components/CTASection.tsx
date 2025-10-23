import React from 'react';

const CTASection: React.FC = () => {
  return (
    <div className="text-center mt-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">
        Ready to get started?
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Join the EVB Platform community today
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200">
          Sign up now
        </button>
        <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors duration-200">
          Contact sales
        </button>
      </div>
    </div>
  );
}; 
export default CTASection;
