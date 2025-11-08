import { Vehicle } from '@/shared/types/vehicle';
import Image from 'next/image';
import Link from 'next/link';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={vehicle.avatarUrl || '/images/vehicle-placeholder.jpg'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{vehicle.brand} {vehicle.model}</h3>
        <div className="text-xl font-bold text-blue-600 mb-3">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vehicle.priceVnd)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Năm sản xuất:</span>
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