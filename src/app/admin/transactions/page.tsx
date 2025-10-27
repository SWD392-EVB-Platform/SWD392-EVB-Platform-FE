// app/admin/transactions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

type TransactionStatus = 'pending' | 'completed' | 'disputed' | 'resolved';

type Transaction = {
  id: number;
  buyer: string;
  seller: string;
  postTitle: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 201, buyer: 'Nguyen Van A', seller: 'Tran Thi B', postTitle: 'VinFast Klara', amount: 15000000, status: 'pending', createdAt: new Date().toISOString() },
  { id: 202, buyer: 'Le Van C', seller: 'Admin User', postTitle: 'Battery Pack', amount: 4500000, status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 203, buyer: 'Tran Thi B', seller: 'Nguyen Van A', postTitle: 'Used e-scooter', amount: 7000000, status: 'disputed', createdAt: new Date(Date.now() - 3600000).toISOString() },
];

const AdminTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 400);
  }, []);

  const resolveDispute = (id: number) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">TransactionManagement</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người mua</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người bán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.seller}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.postTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      t.status === 'completed' ? 'bg-green-100 text-green-800' :
                      t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      t.status === 'disputed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {t.status === 'disputed' && (
                      <button
                        onClick={() => resolveDispute(t.id)}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 rounded px-3 py-1 transition-colors"
                      >
                        Xử lý khiếu nại
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Không tìm thấy giao dịch.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;