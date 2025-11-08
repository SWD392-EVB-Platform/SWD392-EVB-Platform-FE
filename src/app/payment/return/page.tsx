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
        setMessage('Verifying payment with backend...');
        const vnpParams = Object.fromEntries(searchParams.entries());
        const result = await PaymentService.verifyVNPayReturn(vnpParams);
        
        if (result.success && result.data?.success) {
          setStatus('success');
          setMessage(result.data.message || 'Thanh toán thành công');
          if (result.data.orderId) {
            try {
              const contract = await ContractService.getContractByOrder(result.data.orderId);
              setContractPreview(contract);
            } catch (err) {
              // Contract might not be available yet, that's okay
            }
          }
        } else {
          setStatus('failed');
          setMessage(result?.message || result?.data?.message || 'Thanh toán thất bại');
        }
      } catch (err: any) {
        setStatus('failed');
        setMessage(err?.message || 'Error while verifying payment');
      }
    };

    verify();
  }, [searchParams, orderId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Result</h1>
        <p className={`mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>

        {status === 'success' ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Your payment was successful. You can download the contract PDF or return to the homepage.</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  const oid = (contractPreview && (contractPreview.orderId || contractPreview.itemId)) || orderId;
                  if (oid) {
                    window.location.href = `${window.location.origin}/api/orders/${encodeURIComponent(oid)}/contracts/download`;
                  } else {
                    alert('Order ID not available to download PDF');
                  }
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Download PDF
              </button>

              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600">If the contract is available it will show here. You can also check your dashboard later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
