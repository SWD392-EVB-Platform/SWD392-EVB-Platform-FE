import type { Metadata } from "next";
import AdminHeader from '@/components/AdminHeader';

export const metadata: Metadata = {
  title: "EVB Platform - EV and Battery Marketplace",
  description: "Leading marketplace for electric vehicles and batteries",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white max-w-full w-full">
      <AdminHeader />
      <main className="flex-1 bg-white">
        <div className="max-w-full mx-auto px-12 py-6">
          <section className="w-full">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
