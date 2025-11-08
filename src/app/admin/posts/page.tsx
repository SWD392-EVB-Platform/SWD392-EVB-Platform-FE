// app/admin/listings/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, Eye, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import { ApiService } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface Listing {
  listingId: string;
  sellerId: string;
  vehicleId?: string | null;
  batteryId?: string | null;
  title: string;
  description?: string | null;
  priceVnd: number;
  aiSuggestedPriceVnd?: number | null;
  status: string;
  approvedBy?: number | null;
  approvedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/listings`, {
        headers: {
          ...ApiService.getAuthHeaders(),
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách listings');
      }

      const data: Listing[] = await response.json();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'Active': 'Live',
      'Draft': 'Draft',
      'Pending': 'Pending',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
    };
    return statusMap[status] || status;
  };

  const isHot = (listing: Listing) => {
    // Consider a listing "hot" if it has AI suggested price and the difference is significant
    if (listing.aiSuggestedPriceVnd && listing.priceVnd) {
      const diff = Math.abs(listing.priceVnd - listing.aiSuggestedPriceVnd);
      const percentDiff = (diff / listing.priceVnd) * 100;
      return percentDiff < 10; // Within 10% of AI suggested price
    }
    return false;
  };
  return (
    <div className="space-y-6 p-6">
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Listings Management</h1>
            <p className="text-gray-600 mt-1">
              Total: <strong>{listings.length}</strong> listings
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
            + New Listing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-12 text-center">
          <p className="text-gray-500">Đang tải danh sách listings...</p>
        </div>
      ) : error ? (
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-12 text-center">
          <div className="space-y-3">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchListings}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-12 text-center">
          <p className="text-gray-500">Không tìm thấy listing nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const hot = isHot(listing);
            const statusLabel = getStatusLabel(listing.status);

            return (
              <div
                key={listing.listingId}
                className="relative backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:scale-[1.02] transition-all duration-300"
              >
                {hot && (
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
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Seller ID: <strong className="font-mono text-xs">{listing.sellerId.substring(0, 8)}...</strong>
                  </p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(listing.priceVnd)}</p>
                  
                  {listing.aiSuggestedPriceVnd && (
                    <p className="text-xs text-gray-500">
                      AI Suggested: {formatCurrency(listing.aiSuggestedPriceVnd)}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {listing.vehicleId && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Vehicle
                      </span>
                    )}
                    {listing.batteryId && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Battery
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(listing.createdAt)}
                    </span>
                    <button className="text-sm text-blue-600 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
