'use client';

import React, { useState, useEffect } from 'react';
import { Contract } from '@/shared/types/contract';
import { ContractService } from '@/features/contracts/services/contractService';
import { PaymentService } from '@/features/payments/services/paymentService';
import SignaturePad from 'react-signature-canvas';

interface ContractSigningProps {
  contract: Contract;
  onClose: () => void;
  onSuccess: () => void;
  party: 'seller' | 'buyer';
}

const ContractSigning: React.FC<ContractSigningProps> = ({
  contract,
  onClose,
  onSuccess,
  party,
}) => {
  const [signaturePad, setSignaturePad] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
    }
  };

  const handleSign = async () => {
    if (!signaturePad || signaturePad.isEmpty()) {
      setError('Please provide your signature');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sign the contract
      const signature = signaturePad.toDataURL();
      await ContractService.signContract({
        contractId: contract.contractId,
        signature,
        party,
      });

      onSuccess();
    } catch (err) {
      setError('Failed to sign contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Contract Signing</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Contract Details</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="mb-2">Contract ID: {contract.contractId}</p>
            <p className="mb-2">Item Type: {contract.itemType}</p>
            <p className="mb-2">Price: {contract.price.toLocaleString()} VND</p>
            {/* Add more contract details as needed */}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Terms and Conditions</h3>
          <div className="bg-gray-50 p-4 rounded max-h-40 overflow-y-auto">
            <p className="whitespace-pre-wrap">{contract.termsAndConditions}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Your Signature</h3>
          <div className="border rounded">
            <SignaturePad
              ref={(ref) => setSignaturePad(ref)}
              canvasProps={{
                className: 'w-full h-40',
              }}
            />
          </div>
          <button
            onClick={clearSignature}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Clear Signature
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSign}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing...' : 'Sign Contract'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractSigning;