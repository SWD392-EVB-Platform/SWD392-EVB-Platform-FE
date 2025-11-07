'use client';

import { useEffect, useState } from 'react';
import { Vehicle } from '@/shared/types/vehicle';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VehicleDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await VehicleService.getVehicleById(params.id);
        setVehicle(data);
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id]);

  const handlePurchase = () => {
    router.push(`/payment?type=vehicle&id=${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Vehicle not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left column - Image */}
          <div className="relative h-96 bg-gray-100 rounded-lg">
            <Image
              src="/images/vehicle-placeholder.jpg"
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-500 mt-2">Vehicle ID: {vehicle.vehicleId}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Year</h3>
                  <p className="text-lg font-semibold">{vehicle.year}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Odometer</h3>
                  <p className="text-lg font-semibold">{vehicle.odometerKm.toLocaleString()} km</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold capitalize">{vehicle.status.toLowerCase()}</p>
                </div>
              </div>

              {vehicle.status.toLowerCase() === 'available' && (
                <div className="pt-6">
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Purchase Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}