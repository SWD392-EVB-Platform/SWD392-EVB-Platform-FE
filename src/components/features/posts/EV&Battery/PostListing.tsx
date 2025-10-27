'use client'

import Head from 'next/head';
import { useState } from 'react';

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
  images: File[];
}

const suggestPrice = (
  itemType: string,
  brand: string,
  year: number,
  condition: string,
  mileage: number,
  batteryCapacity: number
): number => {
  let basePrice = itemType === 'vehicle' ? 15000 : 2000;
  if (brand.toLowerCase() === 'tesla') basePrice *= 1.5;
  if (year >= 2020) basePrice *= 1.2;
  if (condition === 'excellent') basePrice *= 1.1;
  if (mileage < 50000) basePrice *= 1.1;
  if (batteryCapacity > 50) basePrice *= 1.2;
  return Math.round(basePrice);
};

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
    images: [],
  });
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData({ ...formData, images: files });
  };

  const handleSuggestPrice = () => {
    const price = suggestPrice(
      formData.itemType,
      formData.brand,
      parseInt(formData.year) || 0,
      formData.condition,
      parseInt(formData.mileage) || 0,
      parseInt(formData.batteryCapacity) || 0
    );
    setSuggestedPrice(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Listing posted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Head>
        <title>Post EV/Battery Listing</title>
        <meta name="description" content="Post a listing for selling used EVs or batteries" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Post a Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Type</label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="vehicle">Vehicle</option>
              <option value="battery">Battery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Tesla, Nissan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Model 3, Leaf"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
          {formData.itemType === 'vehicle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 50000"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Battery Capacity (kWh)</label>
            <input
              type="number"
              name="batteryCapacity"
              value={formData.batteryCapacity}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 75"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your price"
            />
            <button
              type="button"
              onClick={handleSuggestPrice}
              className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Get AI Suggested Price
            </button>
            {suggestedPrice && (
              <p className="mt-2 text-sm text-gray-600">
                AI Suggested Price: ${suggestedPrice}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Describe the item..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostListing;