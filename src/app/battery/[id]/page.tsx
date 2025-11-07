'use client';

import { useEffect, useState } from 'react';
import { Battery } from '@/shared/types/battery';
import { BatteryService } from '@/features/batteries/services/batteryService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BatteryDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [battery, setBattery] = useState<Battery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        setLoading(true);
        const data = await BatteryService.getBatteryById(params.id);
        setBattery(data);
      } catch (err) {
        setError('Failed to load battery details');
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [params.id]);

  const handlePurchase = () => {
    router.push(`/payment?type=battery&id=${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !battery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Battery not found'}
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
              src="/images/battery-placeholder.jpg"
              alt={`${battery.brand} ${battery.model}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {battery.brand} {battery.model}
              </h1>
              <p className="text-lg text-gray-500 mt-2">Battery ID: {battery.batteryId}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                  <p className="text-lg font-semibold">{battery.batteryCapacityKwh} kWh</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Health</h3>
                  <p className="text-lg font-semibold">{battery.batteryHealthPct}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cycle Count</h3>
                  <p className="text-lg font-semibold">{battery.cycleCount} cycles</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Chemistry</h3>
                  <p className="text-lg font-semibold">{battery.chemistry}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nominal Voltage</h3>
                  <p className="text-lg font-semibold">{battery.nominalVoltageV}V</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold capitalize">{battery.status.toLowerCase()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Compatibility Note</h3>
                <p className="mt-1 text-gray-900">{battery.compatibilityNote}</p>
              </div>

              {battery.status.toLowerCase() === 'available' && (
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