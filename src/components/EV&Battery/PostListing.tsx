'use client';

import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiTruck } from 'react-icons/fi'; 

interface FormData {
  itemType: 'vehicle' | 'battery';
  brand: string;
  model: string;
  year: string;
  condition: 'excellent' | 'good' | 'fair';
  mileage: string;
  batteryCapacity: string;
  price: string;
  description: string;
  location: string;
  images: File[];
}

const PostListing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    itemType: 'vehicle',
    brand: '',
    model: '',
    year: '',
    condition: 'good',
    mileage: '',
    batteryCapacity: '',
    price: '',
    description: '',
    location: '',
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Listing posted successfully!');
  };

  return (
    <div className="w-full min-h-screen">
      {/* Gradient Background + Blur */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50" />
      <div className="fixed inset-0 -z-10 backdrop-blur-sm" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md bg-white/30">
            <FiTruck className="w-8 h-8 text-white" /> {/* ĐÃ SỬA */}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Post a Listing</h1>
            <p className="text-sm text-gray-600">Sell your used EV or battery quickly and safely</p>
          </div>
        </div>

        {/* Glassmorphic Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 space-y-8">
          {/* Item Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiTruck className="w-5 h-5 mr-2 text-blue-600" /> {/* ĐÃ SỬA */}
                Item Type
              </label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none"
              >
                <option value="vehicle">Electric Vehicle</option>
                <option value="battery">Battery Pack</option>
              </select>
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Ho Chi Minh City"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g. Tesla"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g. Model 3"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Year & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiCalendar className="w-5 h-5 mr-2 text-orange-600" />
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2023"
                min={2000}
                max={2030}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all outline-none"
              />
            </div>

            <div className="group">
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all outline-none"
              >
                <option value="excellent">Excellent (95%+)</option>
                <option value="good">Good (80–94%)</option>
                <option value="fair">Fair (60–79%)</option>
              </select>
            </div>
          </div>

          {/* Mileage & Battery Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Mileage (km)</label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="e.g. 25,000"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Battery Capacity (kWh)</label>
              <input
                type="text"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleInputChange}
                placeholder="e.g. 60"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Price & Description */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Price (VND)</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 500000000"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Add details about the condition, history, modifications, etc."
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">Images</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="w-full text-sm text-gray-600"
            />
            {formData.images.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-600">
                    <span className="p-2 text-center">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Post Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostListing;