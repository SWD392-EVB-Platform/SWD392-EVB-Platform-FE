// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import ReduxProvider from '@/store/ReduxProvider';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

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
        <ReduxProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}