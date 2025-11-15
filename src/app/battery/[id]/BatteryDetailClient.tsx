'use client';

import { Battery } from '@/shared/types/battery';
import { BatteryService } from '@/features/batteries/services/batteryService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedBattery } from '@/store/slices/productSlice';
import { toast } from 'react-toastify';

interface BatteryDetailClientProps {
  initialBatteryId: string;
}

export default function BatteryDetailClient({ initialBatteryId }: BatteryDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [battery, setBattery] = useState<Battery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        setLoading(true);
        const data = await BatteryService.getBatteryById(initialBatteryId);
        setBattery(data);
        dispatch(setSelectedBattery(data));
      } catch (err: any) {
        setError(err?.message || 'Không thể tải thông tin pin. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [initialBatteryId, dispatch]);

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!battery) {
      toast.error('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      return;
    }

    if (!battery.priceVnd || battery.priceVnd <= 0) {
      toast.error('Không thể thanh toán: Sản phẩm chưa có giá hoặc giá không hợp lệ. Vui lòng liên hệ người bán để biết giá.');
      return;
    }

    router.push(`/payment/confirm?type=battery&id=${initialBatteryId}`);
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
          {error || 'Không tìm thấy pin'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-6xl text-green-500/30">🔋</div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{battery.brand && battery.model ? `${battery.brand} ${battery.model}` : 'CATL EVC'}</h1>
              <p className="text-lg text-gray-500 mt-2">Mã pin: {battery.batteryId}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dung lượng</h3>
                  <p className="text-lg font-semibold">{battery.batteryCapacityKwh} kWh</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tình trạng pin</h3>
                  <p className="text-lg font-semibold">{battery.batteryHealthPct}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Số chu kỳ</h3>
                  <p className="text-lg font-semibold">{battery.cycleCount} chu kỳ</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Giá</h3>
                  <p className="text-lg font-semibold">
                    {battery.priceVnd && battery.priceVnd > 0 
                      ? `${battery.priceVnd.toLocaleString('vi-VN')} VND`
                      : 'Liên hệ để biết giá'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <p className="text-lg font-semibold capitalize">{battery.status.toLowerCase() === 'available' ? 'Có sẵn' : battery.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Cập nhật lần cuối</h3>
                <p className="mt-1 text-gray-900">
                  {new Date(battery.updatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {battery.status.toLowerCase() === 'available' && (
                <>
                  {typeof battery.priceVnd === 'number' && battery.priceVnd > 0 ? (
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