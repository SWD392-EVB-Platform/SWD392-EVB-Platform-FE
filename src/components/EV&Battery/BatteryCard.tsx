import { Battery } from '@/shared/types/battery';
import Image from 'next/image';
import Link from 'next/link';

interface BatteryCardProps {
  battery: Battery;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({ battery }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={battery.avatarUrl || '/images/battery-placeholder.jpg'}
          alt={`${battery.brand} ${battery.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{battery.brand} {battery.model}</h3>
        <div className="text-xl font-bold text-blue-600 mb-3">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(battery.priceVnd)}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Dung lượng:</span>
            <span className="font-medium">{battery.batteryCapacityKwh} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Health:</span>
            <span className="font-medium">{battery.batteryHealthPct}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cycle Count:</span>
            <span className="font-medium">{battery.cycleCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chemistry:</span>
            <span className="font-medium">{battery.chemistry}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {battery.compatibilityNote}
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/battery/${battery.batteryId}`}>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};