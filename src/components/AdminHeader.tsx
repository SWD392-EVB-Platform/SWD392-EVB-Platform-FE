"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';
import ClientOnly from './ClientOnly';

const AdminHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);

  return (
    <header className="bg-black shadow">
  <div className="max-w-full w-full px-4 py-4 relative flex justify-between items-center">
        <Link href="/admin" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-200">
          EVB Admin
        </Link>

        <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2 z-10">
          <Link href="/admin/users" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            UserManagement
          </Link>
          <Link href="/admin/posts" className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium">
            PostManagement
          </Link>
        </nav>

        <div className="hidden md:flex space-x-4">
          <ClientOnly fallback={<div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" /> }>
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
            ) : isAuthenticated && (
              <UserDropdown />
            )  }
          </ClientOnly>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white hover:text-yellow-400 focus:outline-none transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <nav className="flex flex-col px-4 py-2 space-y-2">
            <Link href="/admin/users" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">UserManagement</Link>
            <Link href="/admin/posts" className="block text-white hover:text-yellow-400 transition-colors duration-200 py-1 font-medium">PostManagement</Link>
            <div className="border-t border-gray-700 my-2" />
            <ClientOnly fallback={<div className="px-4 py-2"><div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"/></div>}>
              {isLoading ? (
                <div className="px-4 py-2"><div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"/></div>
              ) : isAuthenticated && (
                <div className="px-4 py-2"><UserDropdown /></div>
              ) }
            </ClientOnly>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
