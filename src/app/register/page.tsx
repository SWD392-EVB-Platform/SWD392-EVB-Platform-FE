'use client';

import React from 'react';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 fixed inset-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles with light theme */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-yellow-300/30 to-orange-300/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/25 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-gradient-to-r from-blue-300/30 to-cyan-300/25 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gradient-to-r from-green-300/25 to-teal-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Light grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Light glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      </div>

      {/* Simple Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-yellow-500 transition-colors duration-200">
            EVB Platform
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
          >
            ← Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create a new account
          </h1>
          <p className="text-gray-600">Join EVB Platform today</p>
        </div>

        {/* Form Container */}
        <div className="glass-transparent rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Please fill in your details to sign up
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-500/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-1 h-1 bg-blue-400/50 rounded-full animate-ping delay-700"></div>
      <div className="absolute top-1/2 left-10 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>
    </div>
  );
};

export default RegisterPage;


