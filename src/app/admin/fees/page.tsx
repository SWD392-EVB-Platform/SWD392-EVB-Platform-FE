// app/admin/fees/page.tsx
'use client';

import { Edit2, Plus, Trash2 } from 'lucide-react';

const tiers = [
  { min: 0, max: 1000, percent: 2.0, fixed: 0, label: 'Small Deals' },
  { min: 1000, max: 10000, percent: 1.8, fixed: 5, label: 'Medium Deals' },
  { min: 10000, max: 50000, percent: 1.5, fixed: 10, label: 'Large Deals' },
  { min: 50000, max: Infinity, percent: 1.0, fixed: 20, label: 'Enterprise' },
];

export default function FeesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Fees</h1>
            <p className="text-gray-600 mt-1">Current range: <strong>1.0% – 2.0%</strong> + fixed fee</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Tier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((t, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 p-6 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-900">{t.label}</h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Range:</span>
                <span className="font-medium">
                  ${t.min.toLocaleString()} → {t.max === Infinity ? '∞' : '$' + t.max.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Percent fee:</span>
                <span className="font-bold text-purple-600">{t.percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed fee:</span>
                <span className="font-semibold text-indigo-600">${t.fixed}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/30">
              <p className="text-xs text-gray-500">
                Example: $5,000 → Fee = 1.8% × 5,000 + $5 = <strong>$95</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl p-6 border border-white/30">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Fee Summary (This Month)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">$12,450</p>
            <p className="text-sm text-gray-600">Total fees collected</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">1,842</p>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">$6.76</p>
            <p className="text-sm text-gray-600">Avg fee per tx</p>
          </div>
        </div>
      </div>
    </div>
  );
}