// app/admin/fees/page.tsx
'use client';

import React, { useState } from 'react';

const AdminFeesPage: React.FC = () => {
  const [feePercentage, setFeePercentage] = useState(5); // Mock default 5%
  const [commissionPercentage, setCommissionPercentage] = useState(2); // Mock default 2%

  const saveSettings = () => {
    alert(`Đã lưu: Phí = ${feePercentage}%, Hoa hồng = ${commissionPercentage}%`);
    // Save to API here
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Phí & Hoa hồng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phí giao dịch (%)</label>
            <input
              type="number"
              value={feePercentage}
              onChange={(e) => setFeePercentage(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              min={0}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hoa hồng (%)</label>
            <input
              type="number"
              value={commissionPercentage}
              onChange={(e) => setCommissionPercentage(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              min={0}
              max={100}
            />
          </div>

          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFeesPage;