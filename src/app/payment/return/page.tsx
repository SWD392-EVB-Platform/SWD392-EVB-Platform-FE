'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaymentService } from '@/features/payments/services/paymentService';
import { ContractService } from '@/features/contracts/services/contractService';

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState<string>('Verifying payment...');
  const [contractPreview, setContractPreview] = useState<any | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [buyerAgreed, setBuyerAgreed] = useState(false);
  const [isAgreeing, setIsAgreeing] = useState(false);
  const orderId = searchParams.get('orderId');

  // Chữ ký bên bán đã ký sẵn (mẫu fix cứng)
  const sellerSignature = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCA0MEMyMCAzMCAzMCAyMCA0MCAyMEM1MCAyMCA2MCAzMCA2MCA0MEM2MCA1MCA1MCA2MCA0MCA2MEMzMCA2MCAyMCA1MCAyMCA0MFoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNODAgNDBDODAgMzAgOTAgMjAgMTAwIDIwQzExMCAyMCAxMjAgMzAgMTIwIDQwQzEyMCA1MCAxMTAgNjAgMTAwIDYwQzkwIDYwIDgwIDUwIDgwIDQwWiIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0xNDAgNDBDMTQwIDMwIDE1MCAyMCAxNjAgMjBDMTcwIDIwIDE4MCAzMCAxODAgNDBDMTgwIDUwIDE3MCA2MCAxNjAgNjBDMTUwIDYwIDE0MCA1MCAxNDAgNDBaIiBmaWxsPSIjMzMzIi8+PC9zdmc+';

  // Hợp đồng mẫu fix cứng tạm thời
  const hardcodedContract = {
    contractId: 'CT-' + Date.now(),
    orderId: orderId || 'ORD-001',
    sellerName: 'Nguyễn Văn A',
    buyerName: 'Lê Đức Em',
    itemType: 'Xe điện',
    itemName: 'VinFast Klara 2020',
    price: 12000000,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    termsAndConditions: `
ĐIỀU KHOẢN HỢP ĐỒNG MUA BÁN

1. THÔNG TIN BÊN BÁN:
   - Tên: Nguyễn Văn A
   - Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
   - SĐT: 0901234567
   - Email: nguyenvana@example.com

2. THÔNG TIN BÊN MUA:
   - Tên: Lê Đức Em
   - Địa chỉ: 456 Đường DEF, Quận UVW, TP.HCM
   - SĐT: 0987654321
   - Email: leducem@example.com

3. THÔNG TIN SẢN PHẨM:
   - Loại: Xe điện
   - Tên sản phẩm: VinFast Klara 2020
   - Tình trạng: Đã qua sử dụng
   - Số km đã đi: 15,000 km

4. GIÁ CẢ VÀ PHƯƠNG THỨC THANH TOÁN:
   - Tổng giá trị: 12,000,000 VNĐ
   - Đã thanh toán: 12,000,000 VNĐ (100%)
   - Phương thức: VNPay
   - Ngày thanh toán: ${new Date().toLocaleDateString('vi-VN')}

5. ĐIỀU KHOẢN GIAO HÀNG:
   - Bên bán có trách nhiệm giao hàng trong vòng 7 ngày kể từ ngày thanh toán
   - Địa điểm giao hàng: Theo thỏa thuận giữa hai bên
   - Chi phí vận chuyển: Bên mua chịu trách nhiệm

6. BẢO HÀNH:
   - Thời gian bảo hành: 3 tháng kể từ ngày giao hàng
   - Phạm vi bảo hành: Các lỗi kỹ thuật do nhà sản xuất

7. TRÁCH NHIỆM CỦA CÁC BÊN:
   - Bên bán cam kết sản phẩm đúng như mô tả
   - Bên mua có trách nhiệm kiểm tra sản phẩm trước khi nhận
   - Mọi tranh chấp sẽ được giải quyết thông qua thương lượng

8. ĐIỀU KHOẢN KHÁC:
   - Hợp đồng này có hiệu lực kể từ ngày ký
   - Mọi thay đổi phải được sự đồng ý của cả hai bên
   - Hợp đồng được lập thành 2 bản, mỗi bên giữ 1 bản

Ngày lập: ${new Date().toLocaleDateString('vi-VN')}
    `.trim()
  };

  useEffect(() => {
    const verify = async () => {
      try {
        setMessage('Đang xác thực thanh toán...');
        
        // Lấy query params từ VNPay
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');
        const vnpOrderInfo = searchParams.get('vnp_OrderInfo'); // Chứa orderId
        
        // Xác định kết quả dựa vào response code từ VNPay
        // vnp_ResponseCode = '00' và vnp_TransactionStatus = '00' => thành công
        const isSuccess = vnpResponseCode === '00' && vnpTransactionStatus === '00';
        
        if (isSuccess) {
          setStatus('success');
          setMessage('Thanh toán thành công!');
          
          // Lấy orderId từ vnp_OrderInfo
          const orderIdFromParams = vnpOrderInfo || orderId;
          if (orderIdFromParams) {
            // Thử lấy contract, nhưng không bắt buộc phải có ngay
            // Contract sẽ được tạo bởi IPN callback sau khi thanh toán
            const contract = await ContractService.getContractByOrder(orderIdFromParams);
            if (contract) {
              setContractPreview(contract);
            } else {
              // Contract chưa có sẵn (IPN callback chưa chạy), không sao
              // User vẫn có thể xem sau khi IPN callback hoàn thành
              console.log('Contract not available yet (will be created by IPN callback)');
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
        console.error('Payment verification error:', err);
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
                <h1 className="text-2xl font-bold mb-2">HỢP ĐỒNG MUA BÁN XE ĐIỆN</h1>
                <p className="text-gray-600">Số hợp đồng: {hardcodedContract.contractId}</p>
                <p className="text-gray-600">Ngày lập: {hardcodedContract.createdAt}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">1. THÔNG TIN BÊN BÁN:</h3>
                  <p>• Tên: {hardcodedContract.sellerName}</p>
                  <p>• Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                  <p>• SĐT: 0901234567</p>
                  <p>• Email: nguyenvana@example.com</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">2. THÔNG TIN BÊN MUA:</h3>
                  <p>• Tên: {hardcodedContract.buyerName}</p>
                  <p>• Địa chỉ: 456 Đường DEF, Quận UVW, TP.HCM</p>
                  <p>• SĐT: 0987654321</p>
                  <p>• Email: leducem@example.com</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">3. THÔNG TIN SẢN PHẨM:</h3>
                  <p>• Loại: {hardcodedContract.itemType}</p>
                  <p>• Tên sản phẩm: {hardcodedContract.itemName}</p>
                  <p>• Tình trạng: Đã qua sử dụng</p>
                  <p>• Số km đã đi: 15,000 km</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">4. GIÁ CẢ VÀ PHƯƠNG THỨC THANH TOÁN:</h3>
                  <p>• Tổng giá trị: <span className="font-bold text-blue-600">{hardcodedContract.price.toLocaleString('vi-VN')} VNĐ</span></p>
                  <p>• Đã thanh toán: 12,000,000 VNĐ (100%)</p>
                  <p>• Phương thức: VNPay</p>
                  <p>• Ngày thanh toán: {hardcodedContract.createdAt}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">5. ĐIỀU KHOẢN GIAO HÀNG:</h3>
                  <p>• Bên bán có trách nhiệm giao hàng trong vòng 7 ngày kể từ ngày thanh toán</p>
                  <p>• Địa điểm giao hàng: Theo thỏa thuận giữa hai bên</p>
                  <p>• Chi phí vận chuyển: Bên mua chịu trách nhiệm</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">6. BẢO HÀNH:</h3>
                  <p>• Thời gian bảo hành: 3 tháng kể từ ngày giao hàng</p>
                  <p>• Phạm vi bảo hành: Các lỗi kỹ thuật do nhà sản xuất</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">7. TRÁCH NHIỆM CỦA CÁC BÊN:</h3>
                  <p>• Bên bán cam kết sản phẩm đúng như mô tả</p>
                  <p>• Bên mua có trách nhiệm kiểm tra sản phẩm trước khi nhận</p>
                  <p>• Mọi tranh chấp sẽ được giải quyết thông qua thương lượng</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">8. ĐIỀU KHOẢN KHÁC:</h3>
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
                      <p className="text-xs text-gray-500 mt-1">{hardcodedContract.sellerName}</p>
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
                          <p className="text-xs text-gray-500 mt-1">{hardcodedContract.buyerName}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleDateString('vi-VN')}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="border-dashed border-2 border-gray-300 rounded p-4 w-full h-24 flex items-center justify-center mb-2">
                            <p className="text-gray-400 text-xs">Chưa đồng ý</p>
                          </div>
                          <p className="text-sm">{hardcodedContract.buyerName}</p>
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
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
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
