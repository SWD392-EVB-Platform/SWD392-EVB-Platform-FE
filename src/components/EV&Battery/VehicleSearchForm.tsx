'use client';

import React, { useState } from 'react';
import { VehicleSearchParams } from '@/shared/types/vehicle';

interface VehicleSearchFormProps {
  onSearch: (filters: VehicleSearchParams) => void;
}

const VehicleSearchForm: React.FC<VehicleSearchFormProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<VehicleSearchParams>({
    brand: '',
    model: '',
    year: undefined,
    odometerKm: undefined,
    status: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : name === 'year' || name === 'odometerKm' ? Number(value) : value
    }));
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={filters.brand || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Tesla"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={filters.model || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Model 3"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            id="year"
            name="year"
            value={filters.year || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="odometerKm" className="block text-sm font-medium text-gray-700 mb-1">
            Odometer (km)
          </label>
          <input
            type="number"
            id="odometerKm"
            name="odometerKm"
            value={filters.odometerKm || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 12000"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setFilters({})}
          className="mr-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default VehicleSearchForm;