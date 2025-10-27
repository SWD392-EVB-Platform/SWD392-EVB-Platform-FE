// app/admin/reports/page.tsx
'use client';

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
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
        label: 'Doanh thu (triệu VND)',
        data: MOCK_DATA.trends.data,
        backgroundColor: 'rgba(255, 193, 7, 0.6)',
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thống kê & Báo cáo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Số lượng giao dịch</h2>
          <p className="text-3xl font-bold text-yellow-600">{MOCK_DATA.transactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Doanh thu</h2>
          <p className="text-3xl font-bold text-green-600">{MOCK_DATA.revenue.toLocaleString()} VND</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Xu hướng thị trường</h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default AdminReportsPage;