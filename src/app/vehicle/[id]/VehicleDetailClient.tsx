'use client';

import { Vehicle } from '@/shared/types/vehicle';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedVehicle } from '@/store/slices/productSlice';
import { toast } from 'react-toastify';

interface VehicleDetailClientProps {
  initialVehicleId: string;
}

export default function VehicleDetailClient({ initialVehicleId }: VehicleDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await VehicleService.getVehicleById(initialVehicleId);
        setVehicle(data);
        dispatch(setSelectedVehicle(data));
      } catch (err) {
        setError('Không thể tải thông tin xe. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [initialVehicleId, dispatch]);

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!vehicle?.priceVnd || vehicle.priceVnd <= 0) {
      toast.error('Không thể thanh toán: Sản phẩm chưa có giá');
      return;
    }

    router.push(`/payment/confirm?type=vehicle&id=${initialVehicleId}`);
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
          {error || 'Không tìm thấy xe'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-6xl text-green-500/30">🚗</div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-lg text-gray-500 mt-2">Mã xe: {vehicle.vehicleId}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Năm sản xuất</h3>
                  <p className="text-lg font-semibold">{vehicle.year}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Số km đã đi</h3>
                  <p className="text-lg font-semibold">{vehicle.odometerKm.toLocaleString('vi-VN')} km</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Giá</h3>
                  <p className="text-lg font-semibold">{vehicle.priceVnd.toLocaleString('vi-VN')} VND</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <p className="text-lg font-semibold capitalize">{vehicle.status.toLowerCase() === 'available' ? 'Có sẵn' : vehicle.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h3>
                <p className="mt-1 text-gray-900">{new Date(vehicle.updatedAt).toLocaleDateString('vi-VN')}</p>
              </div>

              {vehicle.status.toLowerCase() === 'available' && (
                <>
                  {typeof vehicle.priceVnd === 'number' && vehicle.priceVnd > 0 ? (
                    <div className="pt-6">
                      <button
                        onClick={handlePurchase}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Mua ngay
                      </button>
                    </div>
                  ) : (
                    <div className="pt-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Sản phẩm chưa có giá. Vui lòng liên hệ người bán để biết giá và đặt hàng.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}