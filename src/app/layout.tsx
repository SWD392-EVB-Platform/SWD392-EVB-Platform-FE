// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './globals.css';

// Metadata ở đây → Server Component → HỢP LỆ
export const metadata: Metadata = {
  title: 'EVB Platform – EV and Battery Marketplace',
  description: 'Leading marketplace for electric vehicles and batteries',
};

// Client wrapper component (sẽ được import)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}