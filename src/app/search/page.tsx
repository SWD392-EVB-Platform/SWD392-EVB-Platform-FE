'use client';

import React, { useState, useEffect } from 'react';
import BatterySearchForm from '@/components/EV&Battery/BatterySearchForm';
import VehicleSearchForm from '@/components/EV&Battery/VehicleSearchForm';
import { BatteryCard } from '@/components/EV&Battery/BatteryCard';
import { VehicleCard } from '@/components/EV&Battery/VehicleCard';
import { Battery, BatterySearchParams } from '@/shared/types/battery';
import { Vehicle, VehicleSearchParams } from '@/shared/types/vehicle';
import { BatteryService } from '@/features/batteries/services/batteryService';
import { VehicleService } from '@/features/vehicles/services/vehicleService';

const SearchPage: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'batteries' | 'vehicles'>('batteries');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [batteriesData, vehiclesData] = await Promise.all([
        BatteryService.searchBatteries({ page: 1, pageSize: 10 }),
        VehicleService.searchVehicles({ page: 1, pageSize: 10 })
      ]);

      setBatteries(batteriesData.items);
      setVehicles(vehiclesData.items);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: BatterySearchParams | VehicleSearchParams) => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'batteries') {
        const results = await BatteryService.searchBatteries({
          ...filters,
          page: 1,
          pageSize: 10
        });
        setBatteries(results.items);
      } else {
        const results = await VehicleService.searchVehicles({
          ...filters,
          page: 1,
          pageSize: 10
        });
        setVehicles(results.items);
      }
    } catch (err) {
      setError('Search failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('batteries')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'batteries'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Batteries
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Vehicles
          </button>
        </div>
      </div>

      {activeTab === 'batteries' ? (
        <BatterySearchForm onSearch={handleSearch} />
      ) : (
        <VehicleSearchForm onSearch={handleSearch} />
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {activeTab === 'batteries' ? (
            batteries.length > 0 ? (
              batteries.map((battery) => (
                <BatteryCard key={battery.batteryId} battery={battery} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No batteries found.</p>
            )
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No vehicles found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;