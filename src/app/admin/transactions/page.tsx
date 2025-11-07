// app/admin/transactions/page.tsx
'use client';

import { Download, Filter, Search } from 'lucide-react';

const mockTx = [
  { id: 'TXN001', buyer: 'John Doe', seller: 'Anna Smith', item: '60 kWh Battery (2020)', price: '$8,500', fee: '$170', status: 'completed', date: '2025-11-03 14:30' },
  { id: 'TXN002', buyer: 'Mike Lee', seller: 'Sarah Kim', item: 'VinFast VF e34 (2023)', price: '$22,000', fee: '$440', status: 'pending', date: '2025-11-04 09:15' },
  { id: 'TXN003', buyer: 'Tom Brown', seller: 'John Doe', item: 'Wallbox 22 kW', price: '$1,200', fee: '$24', status: 'completed', date: '2025-11-02 18:45' },
  { id: 'TXN004', buyer: 'Anna Smith', seller: 'Mike Lee', item: '48V 100Ah LFP', price: '$3,200', fee: '$64', status: 'refunded', date: '2025-11-01 11:20' },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-600 mt-1">Total: <strong>1,842</strong> this month</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID, buyer, item..."
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 flex items-center gap-2 hover:bg-white/70 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {mockTx.map((t) => (
                <tr key={t.id} className="hover:bg-white/40 transition-all duration-200">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600 font-semibold">{t.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{t.item}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {t.buyer.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700">{t.buyer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {t.seller.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700">{t.seller}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{t.price}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{t.fee}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                        t.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-white/20">
          <p className="text-sm text-gray-600">Showing 1-4 of 1,842</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  p === 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'bg-white/50 backdrop-blur-sm hover:bg-white/70'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}