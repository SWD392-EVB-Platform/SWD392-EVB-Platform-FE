'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Battery } from '@/shared/types/battery';
import { Vehicle } from '@/shared/types/vehicle';
import { BatteryService } from '@/features/batteries/services/batteryService';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/features/orders/services/orderService';
import { PaymentService } from '@/features/payments/services/paymentService';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearSelectedProduct } from '@/store/slices/productSlice';

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  const { selectedBattery, selectedVehicle, productType } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  
  const [item, setItem] = useState<Battery | Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!type || !id) {
      setError('Thông tin không hợp lệ. Vui lòng quay lại trang sản phẩm.');
      setLoading(false);
      return;
    }

    if (type === 'battery' && productType === 'battery' && selectedBattery && selectedBattery.batteryId === id) {
      setItem(selectedBattery);
      setLoading(false);
      return;
    }

    if (type === 'vehicle' && productType === 'vehicle' && selectedVehicle && selectedVehicle.vehicleId === id) {
      setItem(selectedVehicle);
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        if (type === 'battery') {
          const data = await BatteryService.getBatteryById(id);
          setItem(data);
        } else if (type === 'vehicle') {
          const data = await VehicleService.getVehicleById(id);
          setItem(data);
        } else {
          setError('Loại sản phẩm không hợp lệ');
        }
      } catch (err: any) {
        setError(err?.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, id, user, router, selectedBattery, selectedVehicle, productType]);

  const handleConfirmPayment = async () => {
    if (!user || !item) {
      alert('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    // Validate price
    if (!item.priceVnd || item.priceVnd <= 0) {
      alert('Sản phẩm chưa có giá hoặc giá không hợp lệ. Vui lòng liên hệ người bán.');
      return;
    }

    setProcessing(true);
    try {
      if (!user?.userId) {
        throw new Error('Thông tin người dùng không hợp lệ');
      }

      const orderPayload = type === 'battery'
        ? {
            buyerId: user.userId,
            batteryId: id,
            vehicleId: null
          }
        : {
            buyerId: user.userId,
            vehicleId: id,
            batteryId: null
          };

      const order = await OrderService.createOrder(orderPayload);

      if (!order?.success || !order.data?.id) {
        throw new Error(order?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
      }

      const payment = await PaymentService.createVNPayForOrder(order.data.id);

      if (!payment?.success) {
        throw new Error(payment?.message || 'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
      }

      if (!payment.data?.paymentUrl) {
        throw new Error('Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
      }

      dispatch(clearSelectedProduct());
      window.location.href = payment.data.paymentUrl;
    } catch (err: any) {
      alert(err?.message || 'Không thể hoàn tất giao dịch. Vui lòng thử lại sau.');
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedProduct());
    
    if (type === 'battery') {
      router.push(`/battery/${id}`);
    } else if (type === 'vehicle') {
      router.push(`/vehicle/${id}`);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Không tìm thấy sản phẩm'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const price = item.priceVnd;
  const formattedPrice = price > 0 
    ? `${price.toLocaleString('vi-VN')} VND`
    : 'Liên hệ để biết giá';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Xác nhận thanh toán</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Thông tin sản phẩm</h2>
              
              <div className="space-y-4">
                {type === 'battery' ? (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Loại sản phẩm</h3>
                      <p className="text-lg font-semibold">Pin điện</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Thương hiệu & Model</h3>
                      <p className="text-lg font-semibold">
                        {(item as Battery).brand && (item as Battery).model 
                          ? `${(item as Battery).brand} ${(item as Battery).model}`
                          : 'CATL EVC'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mã pin</h3>
                      <p className="text-lg">{(item as Battery).batteryId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Dung lượng</h3>
                      <p className="text-lg">{(item as Battery).batteryCapacityKwh} kWh</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tình trạng pin</h3>
                      <p className="text-lg">{(item as Battery).batteryHealthPct}%</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Số chu kỳ</h3>
                      <p className="text-lg">{(item as Battery).cycleCount} chu kỳ</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Loại sản phẩm</h3>
                      <p className="text-lg font-semibold">Xe điện</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Thương hiệu & Model</h3>
                      <p className="text-lg font-semibold">
                        {(item as Vehicle).brand} {(item as Vehicle).model}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mã xe</h3>
                      <p className="text-lg">{(item as Vehicle).vehicleId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Năm sản xuất</h3>
                      <p className="text-lg">{(item as Vehicle).year}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Số km đã đi</h3>
                      <p className="text-lg">{(item as Vehicle).odometerKm.toLocaleString('vi-VN')} km</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Thông tin thanh toán</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Người mua</h3>
                  <p className="text-lg font-semibold">{user?.name || user?.email || 'N/A'}</p>
                  {user?.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                  {user?.phone && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Giá sản phẩm</h3>
                    <p className="text-lg font-semibold">{formattedPrice}</p>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Phí giao dịch</h3>
                    <p className="text-lg font-semibold">0 VNĐ</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <h3 className="text-lg font-bold">Tổng thanh toán</h3>
                    <p className="text-2xl font-bold text-blue-600">{formattedPrice}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Sau khi xác nhận, bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t p-6 bg-gray-50">
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancel}
                disabled={processing}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-semibold disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={processing || !price || price <= 0}
                className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                  processing || !price || price <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

