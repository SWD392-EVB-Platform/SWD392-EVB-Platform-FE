import React, { useState } from 'react';
import { SearchFilters } from '@/shared/types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void | Promise<void>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'xe',
    brand: '',
    model: '',
    minPrice: undefined,
    maxPrice: undefined,
    batteryCapacity: undefined,
    batteryHealth: undefined,
    mileage: undefined,
    manufactureYear: undefined,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Loại</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as 'xe' | 'pin' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="xe">Xe điện</option>
            <option value="pin">Pin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hãng</label>
          <input
            type="text"
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá từ</label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá đến</label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dung lượng pin (kWh)</label>
          <input
            type="number"
            value={filters.batteryCapacity || ''}
            onChange={(e) => setFilters({ ...filters, batteryCapacity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tình trạng pin (%)</label>
          <input
            type="number"
            value={filters.batteryHealth || ''}
            onChange={(e) => setFilters({ ...filters, batteryHealth: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Số km</label>
          <input
            type="number"
            value={filters.mileage || ''}
            onChange={(e) => setFilters({ ...filters, mileage: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
          <input
            type="number"
            value={filters.manufactureYear || ''}
            onChange={(e) => setFilters({ ...filters, manufactureYear: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sắp xếp theo</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'price' | 'date' | 'relevance' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="date">Ngày đăng</option>
            <option value="price">Giá</option>
            <option value="relevance">Độ phù hợp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thứ tự</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchForm;