// app/admin/listings/page.tsx
'use client';

import { Calendar, Clock, DollarSign, Eye, MessageSquare, Package, Tag, ThumbsUp, TrendingUp, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

const mockListings = [
  { id: 1, title: 'Tesla Model 3 SR+ 2021', seller: 'John Doe', price: '$35,000', views: 12340, likes: 892, comments: 45, status: 'active', date: '2025-11-03', hot: true },
  { id: 2, title: '60 kWh Lithium Battery (2020)', seller: 'Anna Smith', price: '$8,500', views: 8921, likes: 456, comments: 23, status: 'active', date: '2025-11-02', hot: false },
  { id: 3, title: '[Draft] VinFast VF e34 2023', seller: 'Mike Lee', price: '$22,000', views: 0, likes: 0, comments: 0, status: 'draft', date: '2025-11-04', hot: false },
  { id: 4, title: 'Wallbox 22 kW Charger', seller: 'Sarah Kim', price: '$1,200', views: 5678, likes: 312, comments: 18, status: 'active', date: '2025-10-30', hot: true },
];

export default function ListingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'ev',
    title: '',
    price: '',
    year: '',
    condition: 'used',
    description: '',
    images: [] as File[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, images: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('New listing created! (Mock)');
    setIsModalOpen(false);
    // Reset form
    setForm({
      type: 'ev',
      title: '',
      price: '',
      year: '',
      condition: 'used',
      description: '',
      images: [],
    });
    setImagePreviews([]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Listings Management</h1>
            <p className="text-gray-600 mt-1">Total: <strong>8,421</strong> listings</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            + New Listing
          </button>
        </div>
      </div>

      {/* Listings Grid */}
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
              <p className="text-sm text-gray-600">Seller: <strong>{l.seller}</strong></p>
              <p className="text-xl font-bold text-green-600">{l.price}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {l.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {l.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {l.comments}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {l.date}
                </span>
                <button className="text-sm text-blue-600 hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NEW LISTING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/30 p-8">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selector */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="ev"
                    checked={form.type === 'ev'}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-4 h-4 text-green-600"
                  />
                  <Package className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Electric Vehicle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="battery"
                    checked={form.type === 'battery'}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Battery Pack</span>
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="inline-block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Tesla Model 3 SR+ 2021"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Price & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="inline-flex text-sm font-medium text-gray-700 mb-2 items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Price
                  </label>
                  <input
                    type="text"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="$35,000"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="inline-flex text-sm font-medium text-gray-700 mb-2 items-center gap-1">
                    <Calendar className="w-4 h-4" /> Year
                  </label>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2021"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="inline-flex text-sm font-medium text-gray-700 mb-2 items-center gap-1">
                  <Tag className="w-4 h-4" /> Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="used">Used</option>
                  <option value="like-new">Like New</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="inline-block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Include mileage, battery health, accessories..."
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="inline-flex text-sm font-medium text-gray-700 mb-2 items-center gap-1">
                  <Upload className="w-4 h-4" /> Photos (up to 5)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={src}
                        alt={`Preview ${i + 1}`}
                        width={320}
                        height={128}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
                          setForm((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i),
                          }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/50 rounded-xl cursor-pointer hover:border-green-500 transition bg-white/30 backdrop-blur-sm">
                      <Upload className="w-6 h-6 text-gray-500 mb-1" />
                      <span className="text-xs text-gray-600">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/70 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}