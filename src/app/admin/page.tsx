// app/admin/page.tsx
'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Tổng quan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Người dùng mới</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">45</p>
          <p className="text-xs text-gray-500 mt-1">+12% so với tháng trước</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Tin đăng mới</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">120</p>
          <p className="text-xs text-gray-500 mt-1">+8 bài hôm nay</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Giao dịch</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹ 2.4Cr</p>
          <p className="text-xs text-gray-500 mt-1">+₹ 450K hôm nay</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Doanh thu</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">₹ 48L</p>
          <p className="text-xs text-gray-500 mt-1">+5% so với tuần trước</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong>user123</strong> vừa đăng tin <strong>VinFast VF e34</strong></p>
          <p><strong>admin</strong> đã duyệt 12 bài đăng</p>
          <p>Giao dịch <strong>#T789</strong> đã hoàn tất</p>
        </div>
      </div>
    </div>
  );
}