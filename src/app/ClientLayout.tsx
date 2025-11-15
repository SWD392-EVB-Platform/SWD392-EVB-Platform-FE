// app/ClientLayout.tsx
'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {/* Header & Footer chỉ hiện ở trang người dùng */}
      {!isAdmin && <Header />}

      <main className="flex-1 bg-white min-h-[calc(100vh-200px)]">
        {children}
      </main>

      {!isAdmin && <Footer />}

      {/* Toast Container - hiển thị ở góc phải màn hình */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}