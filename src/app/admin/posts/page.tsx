// app/admin/listings/page.tsx
'use client';

import { Clock, Eye, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';

const mockListings = [
  { id: 1, title: 'Tesla Model 3 SR+ 2021', seller: 'John Doe', price: '$35,000', views: 12340, likes: 892, comments: 45, status: 'active', date: '2025-11-03', hot: true },
  { id: 2, title: '60 kWh Lithium Battery (2020)', seller: 'Anna Smith', price: '$8,500', views: 8921, likes: 456, comments: 23, status: 'active', date: '2025-11-02', hot: false },
  { id: 3, title: '[Draft] VinFast VF e34 2023', seller: 'Mike Lee', price: '$22,000', views: 0, likes: 0, comments: 0, status: 'draft', date: '2025-11-04', hot: false },
  { id: 4, title: 'Wallbox 22 kW Charger', seller: 'Sarah Kim', price: '$1,200', views: 5678, likes: 312, comments: 18, status: 'active', date: '2025-10-30', hot: true },
];

export default function ListingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Listings Management</h1>
            <p className="text-gray-600 mt-1">
              Total: <strong>8,421</strong> listings
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
            + New Listing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockListings.map((l) => (
          <div
            key={l.id}
            className="relative backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:scale-[1.02] transition-all duration-300"
          >
            {l.hot && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Hot
                </span>
              </div>
            )}

            <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30">
                  {l.status === 'active' ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {l.title}
              </h3>
              <p className="text-sm text-gray-600">
                Seller: <strong>{l.seller}</strong>
              </p>
              <p className="text-xl font-bold text-green-600">{l.price}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {l.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> {l.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> {l.comments}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {l.date}
                </span>
                <button className="text-sm text-blue-600 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
