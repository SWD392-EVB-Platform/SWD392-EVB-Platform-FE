'use client';

import React, { useState } from 'react';
import { FiAlertCircle, FiCalendar, FiCheck, FiMapPin, FiTruck, FiUpload, FiX } from 'react-icons/fi';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 5) : [];
    setFormData(prev => ({ ...prev, images: files }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      setError('Vui lòng tải lên ít nhất 1 hình ảnh');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Bước 1: Upload ảnh trước (giả sử có API riêng)
      const imageUrls = await uploadImages(formData.images);

      // Bước 2: Tạo listing
      const payload = {
        sellerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // TODO: Lấy từ auth
        vehicleId: formData.itemType === 'vehicle' ? '3fa85f64-5717-4562-b3fc-2c963f66afa6' : null,
        batteryId: formData.itemType === 'battery' ? '3fa85f64-5717-4562-b3fc-2c963f66afa6' : null,
        title: `${formData.brand} ${formData.model} ${formData.year}`,
        description: `${formData.description}\n\nLocation: ${formData.location}\nMileage: ${formData.mileage} km\nBattery: ${formData.batteryCapacity} kWh`,
        priceVnd: parseFloat(formData.price.replace(/[^0-9.-]+/g, '')),
        status: 'pending',
        // approvedBy: 0 → backend tự set
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Không thể đăng tin');
      }

      const result = await response.json();
      console.log('Listing created:', result);

      setSuccess(true);
      alert('Đăng tin thành công! Đang chờ duyệt.');

      // Reset form
      setFormData({
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
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Giả lập hàm upload ảnh (thay bằng API thật)
  const uploadImages = async (files: File[]): Promise<string[]> => {
    // TODO: Gọi API upload ảnh, ví dụ: POST /api/upload
    // Trả về mảng URL
    return files.map((_, i) => `/uploads/placeholder-${i + 1}.jpg`);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50" />
      <div className="fixed inset-0 -z-10 backdrop-blur-sm" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md bg-white/30">
            <FiTruck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Đăng Tin Bán</h1>
            <p className="text-sm text-gray-600">Bán xe điện hoặc pin cũ nhanh chóng & an toàn</p>
          </div>
        </div>

        {/* Thông báo */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
            <FiCheck className="w-5 h-5 mr-2" />
            Đăng tin thành công! Tin đang chờ duyệt.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12 space-y-8">
          {/* Item Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiTruck className="w-5 h-5 mr-2 text-blue-600" />
                Loại tin
              </label>
              <select
                name="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all outline-none"
                required
              >
                <option value="vehicle">Xe điện (EV)</option>
                <option value="battery">Pin (Battery Pack)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
                Vị trí
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="VD: TP. Hồ Chí Minh"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Hãng xe</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="VD: Tesla"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Dòng xe</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="VD: Model 3"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Year & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <FiCalendar className="w-5 h-5 mr-2 text-orange-600" />
                Năm sản xuất
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2023"
                min={2000}
                max={new Date().getFullYear() + 1}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tình trạng
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all outline-none"
              >
                <option value="excellent">Xuất sắc (95%+)</option>
                <option value="good">Tốt (80–94%)</option>
                <option value="fair">Khá (60–79%)</option>
              </select>
            </div>
          </div>

          {/* Mileage & Battery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Số km đã đi</label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="VD: 25,000"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-3 block">Dung lượng pin (kWh)</label>
              <input
                type="text"
                name="batteryCapacity"
                value={formData.batteryCapacity}
                onChange={handleInputChange}
                placeholder="VD: 60"
                className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">Giá bán (VND)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="VD: 500,000,000"
              className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20 transition-all outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Mô tả tình trạng, lịch sử bảo dưỡng, phụ kiện đi kèm..."
              className="w-full px-5 py-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 transition-all outline-none resize-none"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-bold text-gray-700 mb-3 block flex items-center">
              <FiUpload className="w-5 h-5 mr-2 text-purple-600" />
              Hình ảnh (tối đa 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg flex items-center space-x-2 transform transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Đang đăng...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-6 h-6" />
                  <span>Đăng tin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostListing;