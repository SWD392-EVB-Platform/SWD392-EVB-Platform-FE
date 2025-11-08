// app/admin/users/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Edit, Trash2, Filter, Search, UserCheck, UserX, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiService } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiPayment {
  amountVnd?: number | null;
}

interface ApiOrder {
  payment?: ApiPayment | null;
}

interface ApiListing {
  id: string;
}

interface ApiUser {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string | null;
  listingSellers?: ApiListing[] | null;
  orders?: ApiOrder[] | null;
}

interface UserDetail {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface UsersResponse {
  items?: ApiUser[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateUserRequest {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role?: string;
  status?: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  passwordHash?: string;
  phone?: string;
  role?: string;
  status?: string;
}

const PAGE_SIZE = 5;

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '—';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = (amount?: number | null) => {
  if (!amount) {
    return '—';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    passwordHash: '',
    phone: '',
    role: '',
    status: 'Active',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page?: number) => {
    const pageToFetch = page ?? currentPage;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', pageToFetch.toString());
      params.set('pageSize', PAGE_SIZE.toString());

      // Add search filters if searchValue exists
      if (searchValue.trim()) {
        params.set('Name', searchValue.trim());
      }

      const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách người dùng');
      }

      const data: UsersResponse = await response.json();

      // Debug: log để kiểm tra cấu trúc dữ liệu
      if (data.items && data.items.length > 0) {
        console.log('Sample user data:', data.items[0]);
      }

      setUsers(data.items ?? []);
      setTotalCount(data.totalCount ?? data.items?.length ?? 0);
      setTotalPages(data.totalPages ?? Math.ceil((data.totalCount ?? 0) / PAGE_SIZE));
      setCurrentPage(data.page ?? pageToFetch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchValue]);

  useEffect(() => {
    fetchUsers(1);
  }, [searchValue]);

  // Separate effect for page changes (not triggered by search)
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || loading) return;
    setCurrentPage(page);
    fetchUsers(page);
  }, [totalPages, loading, fetchUsers]);

  // CRUD Functions
  const fetchUserDetail = useCallback(async (userId: string) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin người dùng');
      }

      const result: ApiResponse<UserDetail> = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi';
      setFormError(errorMessage);
      throw err;
    } finally {
      setFormLoading(false);
    }
  }, []);

  const handleViewUser = useCallback(async (userId: string) => {
    try {
      const userDetail = await fetchUserDetail(userId);
      setSelectedUser(userDetail);
      setViewModalOpen(true);
    } catch (err) {
      // Error already handled in fetchUserDetail
    }
  }, [fetchUserDetail]);

  const handleEditUser = useCallback(async (userId: string) => {
    try {
      const userDetail = await fetchUserDetail(userId);
      setSelectedUser(userDetail);
      setFormData({
        name: userDetail.name,
        email: userDetail.email,
        passwordHash: '', // Don't pre-fill password
        phone: userDetail.phone || '',
        role: userDetail.role || '',
        status: userDetail.status || 'Active',
      });
      setEditModalOpen(true);
    } catch (err) {
      // Error already handled in fetchUserDetail
    }
  }, [fetchUserDetail]);

  const handleDeleteUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedUserId) return;

    try {
      setFormLoading(true);
      setFormError(null);

      const response = await fetch(`${API_BASE_URL}/users/${selectedUserId}`, {
        method: 'DELETE',
        headers: {
          ...ApiService.getAuthHeaders(),
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể xóa người dùng');
      }

      const result: ApiResponse<boolean> = await response.json();
      
      if (result.success) {
        setDeleteModalOpen(false);
        setSelectedUserId(null);
        await fetchUsers(currentPage); // Refresh list
      } else {
        throw new Error(result.message || 'Xóa người dùng thất bại');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa');
    } finally {
      setFormLoading(false);
    }
  }, [selectedUserId, fetchUsers]);

  const handleCreateUser = useCallback(async () => {
    try {
      setFormLoading(true);
      setFormError(null);

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể tạo người dùng');
      }

      const result: ApiResponse<UserDetail> = await response.json();
      
      if (result.success) {
        setCreateModalOpen(false);
        setFormData({
          name: '',
          email: '',
          passwordHash: '',
          phone: '',
          role: '',
          status: 'Active',
        });
        await fetchUsers(1); // Refresh list, go to first page
      } else {
        throw new Error(result.message || 'Tạo người dùng thất bại');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo');
    } finally {
      setFormLoading(false);
    }
  }, [formData, fetchUsers]);

  const handleUpdateUser = useCallback(async () => {
    if (!selectedUser?.userId) return;

    try {
      setFormLoading(true);
      setFormError(null);

      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      };

      // Only include password if it's provided
      if (formData.passwordHash) {
        updateData.passwordHash = formData.passwordHash;
      }

      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.userId}`, {
        method: 'PUT',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể cập nhật người dùng');
      }

      const result: ApiResponse<boolean> = await response.json();
      
      if (result.success) {
        setEditModalOpen(false);
        setSelectedUser(null);
        setFormData({
          name: '',
          email: '',
          passwordHash: '',
          phone: '',
          role: '',
          status: 'Active',
        });
        await fetchUsers(currentPage); // Refresh list
      } else {
        throw new Error(result.message || 'Cập nhật người dùng thất bại');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật');
    } finally {
      setFormLoading(false);
    }
  }, [selectedUser, formData, fetchUsers]);

  // When searching, reset to page 1
  useEffect(() => {
    if (searchValue.trim()) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  // For client-side filtering (if needed as fallback)
  const filteredUsers = useMemo(() => {
    // If we're using server-side search, just return users
    // Otherwise, filter client-side
    if (searchValue.trim()) {
      // Server-side search is active, return users as-is
      return users;
    }
    return users;
  }, [users, searchValue]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Total: <strong>{totalCount}</strong> users
            </p>
          </div>
          <button 
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                passwordHash: '',
                phone: '',
                role: '',
                status: 'Active',
              });
              setFormError(null);
              setCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
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
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Đang tải dữ liệu người dùng...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="space-y-3">
                      <p className="text-sm text-red-500">{error}</p>
                      <button
                        onClick={() => fetchUsers(currentPage)}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        Thử lại
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.status?.toLowerCase() === 'active';
                  const role = user.role ?? 'member';
                  const userId = user.userId || user.id || 'N/A';

                  return (
                    <tr key={user.id || user.userId} className="hover:bg-white/40 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {userId}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{user.name ?? 'Unknown User'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{user.email ?? 'No email provided'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{user.phone ?? '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            role === 'premium'
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                              : role === 'moderator' || role === 'admin'
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                            <UserCheck className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                            <UserX className="w-3 h-3" /> {user.status ?? 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user.userId || user.id || '')}
                            className="p-2 hover:bg-blue-50 rounded-xl transition text-blue-600 hover:text-blue-700"
                            aria-label="View user details"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user.userId || user.id || '')}
                            className="p-2 hover:bg-yellow-50 rounded-xl transition text-yellow-600 hover:text-yellow-700"
                            aria-label="Edit user"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.userId || user.id || '')}
                            className="p-2 hover:bg-red-50 rounded-xl transition text-red-600 hover:text-red-700"
                            aria-label="Delete user"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-white/20">
          <div className="text-sm text-gray-600">
            Hiển thị <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong> - <strong>{Math.min(currentPage * PAGE_SIZE, totalCount)}</strong> trong tổng số <strong>{totalCount}</strong> người dùng
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Trang trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                
                if (totalPages <= 5) {
                  // Show all pages if total pages <= 5
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Show first 5 pages
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Show pages around current page
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Trang sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/30 p-8">
            <button
              onClick={() => {
                setViewModalOpen(false);
                setSelectedUser(null);
              }}
              className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết người dùng</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tên</label>
                <p className="mt-1 text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <p className="mt-1 text-gray-900">{selectedUser.phone || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Vai trò</label>
                <p className="mt-1 text-gray-900">{selectedUser.role || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="mt-1 text-gray-900">{selectedUser.status || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="mt-1 text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                <p className="mt-1 text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {(createModalOpen || editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/30 p-8">
            <button
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedUser(null);
                setFormError(null);
              }}
              className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editModalOpen ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editModalOpen) {
                  handleUpdateUser();
                } else {
                  handleCreateUser();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu {editModalOpen ? '(để trống nếu không đổi)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editModalOpen}
                  value={formData.passwordHash}
                  onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="premium">Premium</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl backdrop-blur-sm bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Đang xử lý...' : editModalOpen ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditModalOpen(false);
                    setSelectedUser(null);
                    setFormError(null);
                  }}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/30 p-8">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedUserId(null);
                setFormError(null);
              }}
              className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Xác nhận xóa</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={formLoading}
                className="flex-1 px-5 py-2.5 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {formLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedUserId(null);
                  setFormError(null);
                }}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
