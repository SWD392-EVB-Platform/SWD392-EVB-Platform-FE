'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserDropdown } from '@/components/auth';
import { ClientOnly } from '@/components/ui';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('Header: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-200">
          EVB Platform
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            Home
          </Link>
          <Link href="/batteries" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            EV Batteries
          </Link>
          <Link href="/vehicles" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            Electric Vehicles
          </Link>
          <Link href="/about" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons or User Dropdown */}
        <div className="hidden md:flex space-x-4">
          <ClientOnly fallback={
            <>
              <Link href="/login" className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors duration-200 font-medium">
                Sign in
              </Link>
              <Link href="/register" className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors duration-200 font-medium">
                Sign up
              </Link>
            </>
          }>
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors duration-200 font-medium">
                  Sign in
                </Link>
                <Link href="/register" className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors duration-200 font-medium">
                  Sign up
                </Link>
              </>
            )}
          </ClientOnly>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white hover:text-yellow-400 focus:outline-none transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <nav className="flex flex-col px-4 py-2 space-y-2">
            <Link href="/" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">
              Home
            </Link>
            <Link href="/batteries" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">
              EV Batteries
            </Link>
            <Link href="/vehicles" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">
              Electric Vehicles
            </Link>
            <Link href="/about" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">
              About
            </Link>
            <Link href="/contact" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">
              Contact
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <ClientOnly fallback={
              <>
                <Link href="/login" className="block px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-black transition-colors duration-200 font-medium">
                  Sign in
                </Link>
                <Link href="/register" className="block px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors duration-200 font-medium">
                  Sign up
                </Link>
              </>
            }>
              {isLoading ? (
                <div className="px-4 py-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="px-4 py-2">
                  <UserDropdown />
                </div>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-black transition-colors duration-200 font-medium">
                    Sign in
                  </Link>
                  <Link href="/register" className="block px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors duration-200 font-medium">
                    Sign up
                  </Link>
                </>
              )}
            </ClientOnly>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
