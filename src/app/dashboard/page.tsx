'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiService, User } from '@/lib/api';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!ApiService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get current user data
    const currentUser = ApiService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await ApiService.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-300">Chào mừng trở lại, {user.name}!</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ tên</label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <p className="mt-1 text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <p className="mt-1 text-gray-900">{user.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
              <p className="mt-1 text-gray-900">{user.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
              <p className="mt-1 text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">🔋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý pin</h3>
            <p className="text-gray-600 mb-4">Xem và quản lý pin xe điện của bạn</p>
            <button className="text-yellow-400 hover:text-yellow-500 font-medium">
              Xem chi tiết →
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý xe</h3>
            <p className="text-gray-600 mb-4">Xem và quản lý xe điện của bạn</p>
            <button className="text-yellow-400 hover:text-yellow-500 font-medium">
              Xem chi tiết →
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cài đặt</h3>
            <p className="text-gray-600 mb-4">Cập nhật thông tin tài khoản</p>
            <button className="text-yellow-400 hover:text-yellow-500 font-medium">
              Cài đặt →
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
