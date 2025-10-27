// app/admin/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: 'DashboardIcon' },
    { label: 'Users', href: '/admin/users', icon: 'UsersIcon' },
    { label: 'Posts', href: '/admin/posts', icon: 'DocumentTextIcon' },
    { label: 'Transactions', href: '/admin/transactions', icon: 'CurrencyDollarIcon' },
    { label: 'Fees', href: '/admin/fees', icon: 'CreditCardIcon' },
    { label: 'Reports', href: '/admin/reports', icon: 'ChartBarIcon' },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      DashboardIcon: `
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      `,
      UsersIcon: `
        <path d="M12 4.354a4 4 0 110 5.292M15 21H9a4 4 0 01-4-4v-1m10 0v1a4 4 0 01-4 4m4-4v1m-4-5a4 4 0 110-8 4 4 0 010 8z" />
      `,
      DocumentTextIcon: `
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      `,
      CurrencyDollarIcon: `
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      `,
      CreditCardIcon: `
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      `,
      ChartBarIcon: `
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      `,
    };
    return icons[iconName] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">EVB Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-yellow-400"
          >
            Close
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: getIcon(item.icon) }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-black text-white shadow-md z-40">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white hover:text-yellow-400"
            >
              Menu
            </button>

            <div className="flex-1 md:hidden" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 hover:bg-gray-900 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden md:block text-sm">{user.name || 'Admin'}</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold">
                        {user.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name || 'Admin'}</p>
                        <p className="text-xs opacity-90">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {user.role?.toUpperCase()}
                      </span>
                    </p>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </main>

        {/* Floating Action Button */}
        <button className="fixed bottom-20 right-6 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-900 transition transform hover:scale-110 z-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}