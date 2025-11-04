'use client';

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MOCK_DATA = {
  transactions: 150,
  revenue: 500000000,
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [65, 59, 80, 81, 56, 55],
  },
};

const AdminReportsPage = () => {
  const chartData = {
    labels: MOCK_DATA.trends.labels,
    datasets: [
      {
        label: 'Revenue (M VND)',
        data: MOCK_DATA.trends.data,
        backgroundColor: 'rgba(255, 193, 7, 0.7)',
        borderColor: 'rgb(255, 193, 7)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Track performance and market trends</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-md border border-yellow-200">
          <h2 className="text-sm font-semibold text-gray-700">Total Transactions</h2>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{MOCK_DATA.transactions}</p>
          <p className="text-xs text-gray-600 mt-1">+18% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-md border border-green-200">
          <h2 className="text-sm font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{(MOCK_DATA.revenue / 1000000).toFixed(1)}M VND</p>
          <p className="text-xs text-gray-600 mt-1">+12% from last week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Revenue Trend (6 Months)</h2>
        <div className="h-80">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;