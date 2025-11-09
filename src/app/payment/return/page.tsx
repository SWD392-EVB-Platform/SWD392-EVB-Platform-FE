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
  const orderId = searchParams.get('orderId');

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
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
    </div>
  );
}
