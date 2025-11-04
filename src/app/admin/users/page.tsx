// app/admin/users/page.tsx
'use client';

import { Filter, MoreVertical, Search, UserCheck, UserX } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active', joined: '2025-01-15', listings: 5, revenue: '$1,200' },
  { id: 2, name: 'Anna Smith', email: 'anna@example.com', role: 'seller', status: 'active', joined: '2025-02-20', listings: 12, revenue: '$8,500' },
  { id: 3, name: 'Mike Lee', email: 'mike@example.com', role: 'buyer', status: 'banned', joined: '2025-03-10', listings: 0, revenue: '$0' },
  { id: 4, name: 'Sarah Kim', email: 'sarah@example.com', role: 'premium', status: 'active', joined: '2025-01-05', listings: 89, revenue: '$45,000' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'moderator', status: 'active', joined: '2024-12-01', listings: 156, revenue: '$0' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Total: <strong>12,345</strong> active users</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
            + Add User
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 flex items-center gap-2 hover:bg-white/70 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Listings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/40 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md">
                          {u.name.charAt(0)}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-60" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.role === 'premium'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                          : u.role === 'moderator'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.status === 'active' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <UserCheck className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <UserX className="w-3 h-3" /> Banned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{u.listings}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{u.revenue}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white/50 rounded-xl transition">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}