'use client';

import React, { useState } from 'react';
import { BatterySearchParams } from '@/shared/types/battery';

interface BatterySearchFormProps {
  onSearch: (filters: BatterySearchParams) => void;
}

const BatterySearchForm: React.FC<BatterySearchFormProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<BatterySearchParams>({
    brand: '',
    model: '',
    batteryCapacityKwh: undefined,
    batteryHealthPct: undefined,
    chemistry: '',
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
      [name]: value === '' ? undefined : name.includes('battery') || name === 'cycleCount' ? Number(value) : value
    }));
  };

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
            placeholder="e.g., CATL"
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
            placeholder="e.g., EVCell 70kWh"
          />
        </div>

        <div>
          <label htmlFor="batteryCapacityKwh" className="block text-sm font-medium text-gray-700 mb-1">
            Capacity (kWh)
          </label>
          <input
            type="number"
            id="batteryCapacityKwh"
            name="batteryCapacityKwh"
            value={filters.batteryCapacityKwh || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 70"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="batteryHealthPct" className="block text-sm font-medium text-gray-700 mb-1">
            Health (%)
          </label>
          <input
            type="number"
            id="batteryHealthPct"
            name="batteryHealthPct"
            value={filters.batteryHealthPct || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 88"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label htmlFor="chemistry" className="block text-sm font-medium text-gray-700 mb-1">
            Chemistry
          </label>
          <input
            type="text"
            id="chemistry"
            name="chemistry"
            value={filters.chemistry || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Lithium Iron Phosphate"
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

export default BatterySearchForm;