'use client';

import { Vehicle } from '@/shared/types/vehicle';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/features/orders/services/orderService';
import { PaymentService } from '@/features/payments/services/paymentService';
import { useEffect, useState } from 'react';

interface VehicleDetailClientProps {
  initialVehicleId: string;
}

export default function VehicleDetailClient({ initialVehicleId }: VehicleDetailClientProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await VehicleService.getVehicleById(initialVehicleId);
        setVehicle(data);
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [initialVehicleId]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!vehicle?.priceVnd || vehicle.priceVnd <= 0) {
      alert('Không thể thanh toán: Sản phẩm chưa có giá');
      return;
    }

    setProcessing(true);
    try {
      if (!user?.userId) {
        throw new Error('Thông tin người dùng không hợp lệ');
      }

      const orderPayload = {
        buyerId: user.userId,
        vehicleId: initialVehicleId,
        batteryId: null
      };
      
      console.log('Creating order with data:', orderPayload);
      const order = await OrderService.createOrder(orderPayload);
      console.log('Order response:', order);

      if (!order?.success) {
        throw new Error(order?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }

      if (!order.data?.id) {
        throw new Error('Mã đơn hàng không hợp lệ');
      }

      console.log('Creating payment for order:', order.data.id);
      const payment = await PaymentService.createVNPayForOrder(order.data.id);
      console.log('Payment response:', payment);

      if (!payment?.success) {
        throw new Error(payment?.message || 'Không thể tạo liên kết thanh toán');
      }

      if (!payment.data?.paymentUrl) {
        throw new Error('URL thanh toán không hợp lệ');
      }
      
      console.log('Redirecting to payment URL:', payment.data.paymentUrl);
      window.location.href = payment.data.paymentUrl;
    } catch (err: any) {
      console.error('Purchase failed', err);
      const errorMessage = err?.message || 'Có lỗi xảy ra trong quá trình thanh toán';
      alert(errorMessage);
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
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-6xl text-green-500/30">🚗</div>
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
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-lg font-semibold">{(vehicle.priceVnd / 1000000).toLocaleString()} triệu VNĐ</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg font-semibold capitalize">{vehicle.status.toLowerCase()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-gray-900">{new Date(vehicle.updatedAt).toLocaleDateString()}</p>
              </div>

              {vehicle.status.toLowerCase() === 'available' && (
                <>
                  {typeof vehicle.priceVnd === 'number' && vehicle.priceVnd > 0 ? (
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
                              Invalid order fail to create
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