"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';
import ClientOnly from './ClientOnly';

const AdminSidebar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <aside className="bg-black h-screen fixed left-0 top-0 w-64">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 flex items-center">
          <Link href="/admin" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-200">
            EVB Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-4">
            <Link href="/admin/users" className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 py-2">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">UserManagement</span>
            </Link>
            <Link href="/admin/posts" className="flex items-center text-white hover:text-yellow-400 transition-colors duration-200 py-2">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4 0h4" />
              </svg>
              <span className="font-medium">PostManagement</span>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-700">
          <ClientOnly fallback={<div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />}>
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
            ) : isAuthenticated && (
              <UserDropdown />
            )}
          </ClientOnly>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
