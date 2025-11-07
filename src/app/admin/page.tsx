// app/admin/page.tsx
'use client';

import { Activity, DollarSign, Package, TrendingUp, Users } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '12,345', icon: Users, change: '+12.5%', gradient: 'from-blue-500 to-cyan-500' },
  { label: 'Active Listings', value: '8,421', icon: Package, change: '+5.3%', gradient: 'from-purple-500 to-pink-500' },
  { label: 'Revenue', value: '$245,800', icon: DollarSign, change: '+23.1%', gradient: 'from-green-500 to-emerald-500' },
  { label: 'Growth', value: '28.4%', icon: TrendingUp, change: '+2.1%', gradient: 'from-orange-500 to-red-500' },
];

const recent = [
  { user: 'John Doe', action: 'Listed Tesla Model 3', time: '2 min ago', avatar: 'J' },
  { user: 'Anna Smith', action: 'Bought 60 kWh Battery', time: '15 min ago', avatar: 'A' },
  { user: 'Mike Lee', action: 'Updated profile', time: '1 hr ago', avatar: 'M' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview – updated Nov 04, 2025</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-3xl shadow-xl backdrop-blur-xl bg-white/60 border border-white/30 group hover:scale-[1.02] transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
            <div className="relative p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
                <p className="text-xs font-semibold text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {s.change}
                </p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg`}>
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5" />
            Revenue (30 days)
          </h3>
          <div className="h-72 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl flex items-center justify-center">
            <p className="text-gray-600">Line / Area chart (Recharts)</p>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recent.map((a, i) => (
              <div key={i} className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md">
                    {a.avatar}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{a.user}</p>
                  <p className="text-xs text-gray-600">{a.action}</p>
                </div>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}