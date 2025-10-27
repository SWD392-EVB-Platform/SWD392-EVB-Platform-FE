// app/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

type UserStatus = 'pending' | 'active' | 'locked';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
};

const MOCK_USERS: User[] = [
  { id: 1, name: 'Nguyen Van A', email: 'a@example.com', role: 'user', status: 'pending' },
  { id: 2, name: 'Tran Thi B', email: 'b@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: 4, name: 'Le Van C', email: 'c@example.com', role: 'user', status: 'locked' },
];

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 400);
  }, []);

  const approveUser = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
  };

  const toggleLock = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'locked' ? 'active' : 'locked' } : u));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.status === 'active' ? 'bg-green-100 text-green-800' :
                      u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {u.status === 'pending' && (
                      <button onClick={() => approveUser(u.id)} className="text-green-600 hover:text-green-900">Phê duyệt</button>
                    )}
                    {u.role !== 'admin' && (
                      <button onClick={() => toggleLock(u.id)} className="text-red-600 hover:text-red-900">
                        {u.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;