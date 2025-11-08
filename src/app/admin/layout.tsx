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
      DashboardIcon: `<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`,
      UsersIcon: `<path d="M12 4.354a4 4 0 110 5.292M15 21H9a4 4 0 01-4-4v-1m10 0v1a4 4 0 01-4 4m4-4v1m-4-5a4 4 0 110-8 4 4 0 010 8z" />`,
      DocumentTextIcon: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
      CurrencyDollarIcon: `<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />`,
      CreditCardIcon: `<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />`,
      ChartBarIcon: `<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
    };
    return icons[iconName] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar - Gradient + Bo tròn góc phải */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } rounded-r-3xl shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center justify-between p-5 border-b border-blue-800">
          <h1 className="text-2xl font-bold tracking-tight">EVB Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-yellow-300 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-xl transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white hover:shadow-sm'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: getIcon(item.icon) }}
              />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Profile Dropdown - Bo tròn + Shadow đẹp */}
        <div className="flex justify-end items-center px-6 pt-6">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 hover:bg-white/70 px-4 py-2 rounded-2xl transition-all duration-200 shadow-sm bg-white/50 backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-inner">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-sm font-semibold text-gray-800">{user.name || 'Admin'}</div>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${showProfile ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Card - Bo tròn góc + Gradient header */}
            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                      {user.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user.name || 'Admin'}</p>
                      <p className="text-sm opacity-90">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Role</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      {user.role?.toUpperCase() || 'ADMIN'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 pb-24 md:pb-8 overflow-y-auto">{children}</main>

        {/* Floating Action Button - Bo tròn + Hiệu ứng */}
        <button className="fixed bottom-20 right-6 md:bottom-8 md:right-8 bg-gradient-to-br from-black to-gray-900 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-110 z-30 border border-white/10">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}