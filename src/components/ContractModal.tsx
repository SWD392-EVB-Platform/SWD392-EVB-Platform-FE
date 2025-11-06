import React, { useState } from 'react';
import { Contract } from '@/shared/types/search';
import { SearchService } from '@/features/search/services/searchService';

interface ContractModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ postId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateContract = async () => {
    try {
      setLoading(true);
      setError(null);
      const newContract = await SearchService.createContract(postId);
      setContract(newContract);
    } catch (err) {
      setError('Không thể tạo hợp đồng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError(null);
      const updatedContract = await SearchService.signContract(contract.id);
      setContract(updatedContract);
    } catch (err) {
      setError('Không thể ký hợp đồng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Hợp đồng mua bán</h3>
          <div className="mt-2 px-7 py-3">
            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}

            {!contract ? (
              <button
                onClick={handleCreateContract}
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Tạo hợp đồng'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Trạng thái: {contract.status}</p>
                  <p className="text-sm text-gray-600">Giá: {contract.price.toLocaleString()} VND</p>
                  <p className="text-sm text-gray-600">
                    Người bán đã ký: {contract.signedBySeller ? 'Có' : 'Chưa'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Người mua đã ký: {contract.signedByBuyer ? 'Có' : 'Chưa'}
                  </p>
                </div>

                {contract.status === 'pending' && (
                  <button
                    onClick={handleSignContract}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'Ký hợp đồng'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="items-center px-4 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;