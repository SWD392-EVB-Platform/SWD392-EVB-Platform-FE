'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';
import ClientOnly from './ClientOnly';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) return null;
  const isAdmin = !!user && typeof user.role === 'string' && user.role.toLowerCase() === 'admin';

  return (
    <header className="bg-black shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-200">
          EVB Platform
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6">
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
        <div className="flex space-x-4">
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
      </div>
    </header>
  );
};

export default Header;
