import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "EVB Platform - EV and Battery Marketplace",
  description: "Leading marketplace for electric vehicles and batteries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <Header />
          <main className="flex-1 bg-white">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
