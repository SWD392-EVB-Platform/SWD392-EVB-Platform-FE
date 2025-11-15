'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaymentService } from '@/features/payments/services/paymentService';
import { ContractService } from '@/features/contracts/services/contractService';
import { OrderService } from '@/features/orders/services/orderService';
import { BatteryService } from '@/features/batteries/services/batteryService';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import { useAuth } from '@/contexts/AuthContext';
import { Battery } from '@/shared/types/battery';
import { Vehicle } from '@/shared/types/vehicle';
import { useAppSelector } from '@/store/hooks';
import { ApiService } from '@/lib/api';

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { selectedBattery, selectedVehicle, productType } = useAppSelector((state) => state.product);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState<string>('Verifying payment...');
  const [contractPreview, setContractPreview] = useState<any | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [buyerAgreed, setBuyerAgreed] = useState(false);
  const [isAgreeing, setIsAgreeing] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [item, setItem] = useState<Battery | Vehicle | null>(null);
  const [itemType, setItemType] = useState<'battery' | 'vehicle' | null>(null);
  const [seller, setSeller] = useState<any | null>(null);
  const orderId = searchParams.get('orderId');

  // Chữ ký bên bán đã ký sẵn (mẫu fix cứng)
  const sellerSignature = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCA0MEMyMCAzMCAzMCAyMCA0MCAyMEM1MCAyMCA2MCAzMCA2MCA0MEM2MCA1MCA1MCA2MCA0MCA2MEMzMCA2MCAyMCA1MCAyMCA0MFoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNODAgNDBDODAgMzAgOTAgMjAgMTAwIDIwQzExMCAyMCAxMjAgMzAgMTIwIDQwQzEyMCA1MCAxMTAgNjAgMTAwIDYwQzkwIDYwIDgwIDUwIDgwIDQwWiIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0xNDAgNDBDMTQwIDMwIDE1MCAyMCAxNjAgMjBDMTcwIDIwIDE4MCAzMCAxODAgNDBDMTgwIDUwIDE3MCA2MCAxNjAgNjBDMTUwIDYwIDE0MCA1MCAxNDAgNDBaIiBmaWxsPSIjMzMzIi8+PC9zdmc+';

  // Lấy thông tin sản phẩm: ưu tiên từ Redux, nếu không có thì lấy từ order
  useEffect(() => {
    // Ưu tiên lấy từ Redux nếu có
    if (productType === 'battery' && selectedBattery) {
      setItem(selectedBattery);
      setItemType('battery');
      return;
    }
    
    if (productType === 'vehicle' && selectedVehicle) {
      setItem(selectedVehicle);
      setItemType('vehicle');
      return;
    }

    // Nếu không có trong Redux, lấy từ order
    const fetchOrderAndItem = async () => {
      // Lấy orderId từ URL (có thể từ vnp_OrderInfo hoặc orderId param)
      const vnpOrderInfo = searchParams.get('vnp_OrderInfo');
      const currentOrderId = orderId || vnpOrderInfo;
      
      if (!currentOrderId) return;

      try {
        // Lấy thông tin order
        const orderData = await OrderService.getOrder(currentOrderId);
        setOrder(orderData);

        // Lấy thông tin sản phẩm từ order
        if (orderData?.batteryId) {
          setItemType('battery');
          const battery = await BatteryService.getBatteryById(orderData.batteryId);
          setItem(battery);
        } else if (orderData?.vehicleId) {
          setItemType('vehicle');
          const vehicle = await VehicleService.getVehicleById(orderData.vehicleId);
          setItem(vehicle);
        }
      } catch (error) {
        console.error('Error fetching order/item:', error);
      }
    };

    // Fetch ngay khi có orderId, không cần đợi status === 'success'
    fetchOrderAndItem();
  }, [orderId, searchParams, productType, selectedBattery, selectedVehicle]);

  // Lấy thông tin người bán từ ownerId của sản phẩm
  useEffect(() => {
    const fetchSeller = async () => {
      if (!item) {
        console.log('[Contract] No item to fetch seller');
        return;
      }

      const ownerId = String((item as Battery).ownerId || (item as Vehicle).ownerId || '');
      if (!ownerId || ownerId === 'undefined' || ownerId === 'null') {
        console.log('[Contract] No ownerId found in item:', item);
        return;
      }

      console.log('[Contract] Fetching seller info for ownerId:', ownerId);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const response = await fetch(`${API_BASE_URL}/users/${ownerId}`, {
          headers: {
            ...ApiService.getAuthHeaders(),
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          console.error('[Contract] Failed to fetch seller:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('[Contract] Error response:', errorText);
          return;
        }

        const result = await response.json();
        console.log('[Contract] Seller API response:', result);
        
        // Xử lý nhiều format response có thể có
        const sellerData = result.data || result.user || result;
        
        if (sellerData && (sellerData.name || sellerData.email)) {
          setSeller(sellerData);
          console.log('[Contract] Seller info set successfully:', {
            name: sellerData.name,
            email: sellerData.email,
            phone: sellerData.phone
          });
        } else {
          console.warn('[Contract] Invalid seller data format:', sellerData);
        }
      } catch (error) {
        console.error('[Contract] Error fetching seller info:', error);
      }
    };

    fetchSeller();
  }, [item]);

  // Tạo hợp đồng với thông tin thực tế
  const getContractData = () => {
    const buyerName = user?.name || user?.email || 'N/A';
    const buyerEmail = user?.email || '';
    const buyerPhone = user?.phone || '';
    const buyerAddress = 'Chưa cập nhật';

    const sellerName = seller?.name || 'Người bán';
    const sellerEmail = seller?.email || 'Theo thông tin đăng ký';
    const sellerPhone = seller?.phone || 'Theo thông tin đăng ký';
    const sellerAddress = seller?.address || 'Theo thông tin đăng ký';

    const itemName = itemType === 'battery' && item
      ? `${(item as Battery).brand} ${(item as Battery).model}`
      : itemType === 'vehicle' && item
      ? `${(item as Vehicle).brand} ${(item as Vehicle).model} ${(item as Vehicle).year}`
      : 'N/A';

    const itemTypeName = itemType === 'battery' ? 'Pin điện' : itemType === 'vehicle' ? 'Xe điện' : 'N/A';
    const price = item?.priceVnd || 0;

    // Thông tin sản phẩm chi tiết
    let itemDetails = '';
    if (itemType === 'battery' && item) {
      const battery = item as Battery;
      itemDetails = `
   - Dung lượng: ${battery.batteryCapacityKwh} kWh
   - Tình trạng pin: ${battery.batteryHealthPct}%
   - Số chu kỳ: ${battery.cycleCount} chu kỳ
   - Mã pin: ${battery.batteryId}`;
    } else if (itemType === 'vehicle' && item) {
      const vehicle = item as Vehicle;
      itemDetails = `
   - Năm sản xuất: ${vehicle.year}
   - Số km đã đi: ${vehicle.odometerKm.toLocaleString('vi-VN')} km
   - Mã xe: ${vehicle.vehicleId}`;
    }

    return {
      contractId: contractPreview?.contractId || 'CT-' + Date.now(),
      orderId: orderId || 'ORD-001',
      sellerName: sellerName,
      sellerEmail: sellerEmail,
      sellerPhone: sellerPhone,
      sellerAddress: sellerAddress,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      buyerAddress: buyerAddress,
      itemType: itemTypeName,
      itemName: itemName,
      itemDetails: itemDetails,
      price: price,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      termsAndConditions: `
ĐIỀU KHOẢN HỢP ĐỒNG MUA BÁN

1. THÔNG TIN BÊN BÁN:
   - Tên: ${sellerName}
   - Địa chỉ: ${sellerAddress}
   - SĐT: ${sellerPhone}
   - Email: ${sellerEmail}

2. THÔNG TIN BÊN MUA:
   - Tên: ${buyerName}
   - Địa chỉ: ${buyerAddress}
   - SĐT: ${buyerPhone || 'Chưa cập nhật'}
   - Email: ${buyerEmail || 'Chưa cập nhật'}

3. THÔNG TIN SẢN PHẨM:
   - Loại: ${itemTypeName}
   - Tên sản phẩm: ${itemName}${itemDetails}

4. ĐIỀU KHOẢN GIAO HÀNG:
   - Bên bán có trách nhiệm giao hàng trong vòng 7 ngày kể từ ngày thanh toán
   - Địa điểm giao hàng: Theo thỏa thuận giữa hai bên
   - Chi phí vận chuyển: Bên mua chịu trách nhiệm

5. BẢO HÀNH:
   - Thời gian bảo hành: 3 tháng kể từ ngày giao hàng
   - Phạm vi bảo hành: Các lỗi kỹ thuật do nhà sản xuất

6. TRÁCH NHIỆM CỦA CÁC BÊN:
   - Bên bán cam kết sản phẩm đúng như mô tả
   - Bên mua có trách nhiệm kiểm tra sản phẩm trước khi nhận
   - Mọi tranh chấp sẽ được giải quyết thông qua thương lượng

7. ĐIỀU KHOẢN KHÁC:
   - Hợp đồng này có hiệu lực kể từ ngày ký
   - Mọi thay đổi phải được sự đồng ý của cả hai bên
   - Hợp đồng được lập thành 2 bản, mỗi bên giữ 1 bản

Ngày lập: ${new Date().toLocaleDateString('vi-VN')}
      `.trim()
    };
  };

  const contractData = getContractData();

  useEffect(() => {
    const verify = async () => {
      try {
        setMessage('Đang xác thực thanh toán...');
        
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');
        const vnpOrderInfo = searchParams.get('vnp_OrderInfo');
        
        const isSuccess = vnpResponseCode === '00' && vnpTransactionStatus === '00';
        
        if (isSuccess) {
          setStatus('success');
          setMessage('Thanh toán thành công!');
          
          const orderIdFromParams = vnpOrderInfo || orderId;
          if (orderIdFromParams) {
            const contract = await ContractService.getContractByOrder(orderIdFromParams);
            if (contract) {
              setContractPreview(contract);
            }
          }
        } else {
          setStatus('failed');
          const errorMessage = searchParams.get('vnp_ResponseCode') 
            ? `Thanh toán thất bại. Mã lỗi: ${vnpResponseCode}`
            : 'Thanh toán thất bại';
          setMessage(errorMessage);
        }
      } catch (err: any) {
        setStatus('failed');
        setMessage(err?.message || 'Có lỗi xảy ra khi xác thực thanh toán');
      }
    };

    verify();
  }, [searchParams, orderId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
        <p className={`mb-4 text-lg ${status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-gray-600'}`}>
          {message}
        </p>

        {status === 'success' ? (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Thanh toán của bạn đã thành công! 
              {contractPreview ? (
                ' Bạn có thể tải hợp đồng PDF hoặc quay về trang chủ.'
              ) : (
                <span className="block mt-2 text-yellow-600">
                  ⏳ Hợp đồng đang được tạo tự động. Vui lòng đợi vài giây hoặc quay lại sau để tải hợp đồng.
                </span>
              )}
            </p>
            <div className="mt-4 flex gap-3">
              {contractPreview && (
                <button
                  onClick={() => {
                    const oid = (contractPreview && (contractPreview.orderId || contractPreview.itemId)) || orderId;
                    if (oid) {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                      window.location.href = `${apiUrl}/orders/${encodeURIComponent(oid)}/contracts/download`;
                    } else {
                      alert('Không tìm thấy mã đơn hàng để tải PDF');
                    }
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Tải hợp đồng PDF
                </button>
              )}

              <button
                onClick={() => setShowContract(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Xem hợp đồng
              </button>

              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        ) : status === 'failed' ? (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>

      {/* Modal hiển thị hợp đồng */}
      {showContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">HỢP ĐỒNG MUA BÁN</h2>
              <button
                onClick={() => setShowContract(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 text-center border-b pb-4">
                <h1 className="text-2xl font-bold mb-2">HỢP ĐỒNG MUA BÁN {contractData.itemType.toUpperCase()}</h1>
                <p className="text-gray-600">Số hợp đồng: {contractData.contractId}</p>
                <p className="text-gray-600">Ngày lập: {contractData.createdAt}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">1. THÔNG TIN BÊN BÁN:</h3>
                  <p>• Tên: {contractData.sellerName}</p>
                  <p>• Địa chỉ: {contractData.sellerAddress}</p>
                  <p>• SĐT: {contractData.sellerPhone}</p>
                  <p>• Email: {contractData.sellerEmail}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">2. THÔNG TIN BÊN MUA:</h3>
                  <p>• Tên: {contractData.buyerName}</p>
                  <p>• Địa chỉ: {contractData.buyerAddress}</p>
                  <p>• SĐT: {contractData.buyerPhone || 'Chưa cập nhật'}</p>
                  <p>• Email: {contractData.buyerEmail || 'Chưa cập nhật'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">3. THÔNG TIN SẢN PHẨM:</h3>
                  <p>• Loại: {contractData.itemType}</p>
                  <p>• Tên sản phẩm: {contractData.itemName}</p>
                  {itemType === 'battery' && item && (
                    <>
                      <p>• Dung lượng: {(item as Battery).batteryCapacityKwh} kWh</p>
                      <p>• Tình trạng pin: {(item as Battery).batteryHealthPct}%</p>
                      <p>• Số chu kỳ: {(item as Battery).cycleCount} chu kỳ</p>
                      <p>• Mã pin: {(item as Battery).batteryId}</p>
                    </>
                  )}
                  {itemType === 'vehicle' && item && (
                    <>
                      <p>• Năm sản xuất: {(item as Vehicle).year}</p>
                      <p>• Số km đã đi: {(item as Vehicle).odometerKm.toLocaleString('vi-VN')} km</p>
                      <p>• Mã xe: {(item as Vehicle).vehicleId}</p>
                    </>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">4. ĐIỀU KHOẢN GIAO HÀNG:</h3>
                  <p>• Bên bán có trách nhiệm giao hàng trong vòng 7 ngày kể từ ngày thanh toán</p>
                  <p>• Địa điểm giao hàng: Theo thỏa thuận giữa hai bên</p>
                  <p>• Chi phí vận chuyển: Bên mua chịu trách nhiệm</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">5. BẢO HÀNH:</h3>
                  <p>• Thời gian bảo hành: 3 tháng kể từ ngày giao hàng</p>
                  <p>• Phạm vi bảo hành: Các lỗi kỹ thuật do nhà sản xuất</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">6. TRÁCH NHIỆM CỦA CÁC BÊN:</h3>
                  <p>• Bên bán cam kết sản phẩm đúng như mô tả</p>
                  <p>• Bên mua có trách nhiệm kiểm tra sản phẩm trước khi nhận</p>
                  <p>• Mọi tranh chấp sẽ được giải quyết thông qua thương lượng</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">7. ĐIỀU KHOẢN KHÁC:</h3>
                  <p>• Hợp đồng này có hiệu lực kể từ ngày ký</p>
                  <p>• Mọi thay đổi phải được sự đồng ý của cả hai bên</p>
                  <p>• Hợp đồng được lập thành 2 bản, mỗi bên giữ 1 bản</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-8">
                  {/* Bên bán - Đã ký sẵn */}
                  <div className="text-center">
                    <p className="font-semibold mb-2">BÊN BÁN</p>
                    <div className="border-2 border-green-300 rounded-lg p-4 min-h-[150px] flex flex-col items-center justify-center bg-green-50">
                      <img 
                        src={sellerSignature} 
                        alt="Chữ ký bên bán" 
                        className="max-w-full max-h-24 object-contain mb-2"
                      />
                      <p className="text-sm font-semibold text-green-600">✓ Đã ký</p>
                      <p className="text-xs text-gray-500 mt-1">{contractData.sellerName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(Date.now() - 86400000).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Bên mua - Đồng ý điều khoản */}
                  <div className="text-center">
                    <p className="font-semibold mb-2">BÊN MUA</p>
                    <div className={`border-2 rounded-lg p-4 min-h-[150px] flex flex-col items-center justify-center ${
                      buyerAgreed 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                      {buyerAgreed ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-2">
                            <span className="text-white text-2xl font-bold">✓</span>
                          </div>
                          <p className="text-sm font-semibold text-green-600">✓ Đã đồng ý</p>
                          <p className="text-xs text-gray-500 mt-1">{contractData.buyerName}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleDateString('vi-VN')}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="border-dashed border-2 border-gray-300 rounded p-4 w-full h-24 flex items-center justify-center mb-2">
                            <p className="text-gray-400 text-xs">Chưa đồng ý</p>
                          </div>
                          <p className="text-sm">{contractData.buyerName}</p>
                          <p className="text-xs text-gray-500 mt-1">(Chờ xác nhận)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nút đồng ý điều khoản */}
                {!buyerAgreed && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAgreementModal(true)}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold shadow-lg"
                    >
                      Đồng ý điều khoản hợp đồng
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Vui lòng đọc và đồng ý với các điều khoản để hoàn tất giao dịch
                    </p>
                  </div>
                )}

                {/* Trạng thái hợp đồng */}
                {buyerAgreed && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-700 font-semibold">✓ Hợp đồng đã được xác nhận đầy đủ</p>
                    <p className="text-sm text-green-600 mt-1">Hợp đồng có hiệu lực từ ngày {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowContract(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đồng ý điều khoản */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Xác nhận đồng ý điều khoản hợp đồng</h2>
              <button
                onClick={() => {
                  setShowAgreementModal(false);
                  setIsAgreeing(false);
                }}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Lưu ý quan trọng:</strong> Vui lòng đọc kỹ tất cả các điều khoản trong hợp đồng trước khi đồng ý. 
                  Việc đồng ý có nghĩa là bạn đã hiểu và chấp nhận tất cả các điều khoản được nêu trong hợp đồng này.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-3">Tóm tắt điều khoản chính:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Bên bán đã ký hợp đồng và cam kết giao hàng đúng như mô tả</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Bên mua có trách nhiệm thanh toán đầy đủ và kiểm tra sản phẩm khi nhận hàng</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Thời gian giao hàng: 7 ngày kể từ ngày thanh toán</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Bảo hành: 3 tháng kể từ ngày giao hàng</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>Mọi tranh chấp sẽ được giải quyết thông qua thương lượng</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  Bằng việc click "Đồng ý và xác nhận", bạn xác nhận rằng:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                  <li>Bạn đã đọc và hiểu rõ tất cả các điều khoản trong hợp đồng</li>
                  <li>Bạn đồng ý với các điều khoản về giá cả, giao hàng và bảo hành</li>
                  <li>Bạn cam kết thực hiện đúng các nghĩa vụ của bên mua</li>
                  <li>Bạn hiểu rằng hợp đồng này có giá trị pháp lý</li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgreeing}
                    onChange={(e) => setIsAgreeing(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Tôi xác nhận:</strong> Tôi đã đọc kỹ và hiểu rõ tất cả các điều khoản trong hợp đồng. 
                    Tôi đồng ý với các điều khoản về giá cả, phương thức thanh toán, giao hàng, bảo hành và các điều khoản khác. 
                    Tôi cam kết thực hiện đúng các nghĩa vụ của mình theo hợp đồng này.
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowAgreementModal(false);
                  setIsAgreeing(false);
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!isAgreeing) {
                    alert('Vui lòng đọc và đồng ý với các điều khoản hợp đồng');
                    return;
                  }

                  // Xác nhận đồng ý
                  setBuyerAgreed(true);
                  alert('Bạn đã đồng ý với các điều khoản hợp đồng thành công!');
                  setShowAgreementModal(false);
                  setIsAgreeing(false);

                  // TODO: Gửi xác nhận lên backend
                  // await ContractService.acceptContract(orderId);
                }}
                disabled={!isAgreeing}
                className={`px-6 py-2 rounded-lg transition-colors font-semibold ${
                  isAgreeing
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Đồng ý và xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
