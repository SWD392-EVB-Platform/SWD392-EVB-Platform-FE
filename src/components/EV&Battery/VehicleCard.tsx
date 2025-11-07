import { Vehicle } from '@/shared/types/vehicle';
import Image from 'next/image';
import Link from 'next/link';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{vehicle.brand} {vehicle.model}</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Year:</span>
            <span className="font-medium">{vehicle.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Odometer:</span>
            <span className="font-medium">{vehicle.odometerKm.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium capitalize">{vehicle.status.toLowerCase()}</span>
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/vehicle/${vehicle.vehicleId}`}>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};