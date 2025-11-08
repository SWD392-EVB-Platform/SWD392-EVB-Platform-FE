'use client';

import { Battery } from '@/shared/types/battery';
import { BatteryService } from '@/features/batteries/services/batteryService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/features/orders/services/orderService';
import { PaymentService } from '@/features/payments/services/paymentService';
import { useEffect, useState } from 'react';

interface BatteryDetailClientProps {
  initialBatteryId: string;
}

export default function BatteryDetailClient({ initialBatteryId }: BatteryDetailClientProps) {
  const router = useRouter();
  const [battery, setBattery] = useState<Battery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        setLoading(true);
        const data = await BatteryService.getBatteryById(initialBatteryId);
        setBattery(data);
      } catch (err: any) {
        setError(err?.message || 'Không thể tải thông tin pin. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [initialBatteryId]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!battery) {
      alert('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      return;
    }

    // Validate price before proceeding
    if (!battery.priceVnd || battery.priceVnd <= 0) {
      alert('Không thể thanh toán: Sản phẩm chưa có giá hoặc giá không hợp lệ. Vui lòng liên hệ người bán để biết giá.');
      return;
    }

    setProcessing(true);
    try {
      if (!user?.userId) {
        throw new Error('Thông tin người dùng không hợp lệ');
      }

      // Create order with minimal data
      const orderPayload = {
        buyerId: user.userId,
        batteryId: initialBatteryId,
        vehicleId: null
      };
      console.log('Creating order:', orderPayload);
      
      const order = await OrderService.createOrder(orderPayload);
      console.log('Order response:', order);

      if (!order?.success || !order.data?.id) {
        throw new Error(order?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }

      // Create payment - backend will use the listing price
      console.log('Creating payment for order:', order.data.id);
      const payment = await PaymentService.createVNPayForOrder(order.data.id);
      console.log('Payment response:', payment);

      if (!payment?.success) {
        throw new Error(payment?.message || 'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
      }

      if (!payment.data?.paymentUrl) {
        throw new Error('Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
      }

      window.location.href = payment.data.paymentUrl;
    } catch (err: any) {
      console.error('Purchase failed:', err);
      alert(err?.message || 'Không thể hoàn tất giao dịch. Vui lòng thử lại sau.');
    } finally {
      setProcessing(false);
    }
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
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-6xl text-green-500/30">🔋</div>
          </div>

          {/* Right column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{battery.brand && battery.model ? `${battery.brand} ${battery.model}` : 'CATL EVC'}</h1>
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
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-lg font-semibold">
                    {battery.priceVnd && battery.priceVnd > 0 
                      ? `${(battery.priceVnd / 1000000).toLocaleString()} triệu VNĐ`
                      : 'Liên hệ để biết giá'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold capitalize">{battery.status.toLowerCase()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-gray-900">
                  {new Date(battery.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {battery.status.toLowerCase() === 'available' && (
                <>
                  {typeof battery.priceVnd === 'number' && battery.priceVnd > 0 ? (
                    <div className="pt-6">
                      <button
                        onClick={handlePurchase}
                        disabled={processing}
                        className={`w-full ${
                          processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {processing ? 'Processing...' : 'Purchase Now'}
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