// app/admin/posts/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

type PostStatus = 'pending' | 'published' | 'spam' | 'deleted';

type Post = {
  id: number;
  title: string;
  type: string;
  price: number;
  status: PostStatus;
  verified: boolean;
  createdAt: string;
};

const MOCK_POSTS: Post[] = [
  { id: 101, title: 'VinFast Klara 2019', type: 'xe', price: 15000000, status: 'pending', verified: false, createdAt: new Date().toISOString() },
  { id: 102, title: 'Battery Pack 48V 20Ah', type: 'pin', price: 4500000, status: 'published', verified: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 103, title: 'Used e-scooter', type: 'xe', price: 7000000, status: 'spam', verified: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 104, title: 'New Battery 60V', type: 'pin', price: 6500000, status: 'pending', verified: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 105, title: 'Service Offer', type: 'other', price: 0, status: 'published', verified: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const FILTERS = ['all', 'pending', 'published', 'spam', 'verified'] as const;

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 300);
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(p => p.status !== 'deleted');
    if (filter === 'pending') filtered = filtered.filter(p => p.status === 'pending');
    if (filter === 'published') filtered = filtered.filter(p => p.status === 'published');
    if (filter === 'spam') filtered = filtered.filter(p => p.status === 'spam');
    if (filter === 'verified') filtered = filtered.filter(p => p.verified);
    return filtered;
  }, [posts, filter]);

  const approvePost = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
  };

  const markSpam = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'spam' } : p));
  };

  const verifyPost = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
  };

  const deletePost = (id: number) => {
    if (!confirm('Xóa tin đăng này?')) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'deleted' } : p));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tin đăng</h1>
      </div>

      <div className="mb-4 flex space-x-2 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === f ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f === 'all' ? 'Tất cả' : f === 'verified' ? 'Đã kiểm định' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiểm định</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === 'published' ? 'bg-green-100 text-green-800' :
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      p.status === 'spam' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.verified ? 'Có' : 'Không'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {p.status === 'pending' && <button onClick={() => approvePost(p.id)} className="text-green-600 hover:text-green-900">Duyệt</button>}
                    {p.status !== 'spam' && <button onClick={() => markSpam(p.id)} className="text-red-600 hover:text-red-900">Spam</button>}
                    {!p.verified && <button onClick={() => verifyPost(p.id)} className="text-blue-600 hover:text-blue-900">Kiểm định</button>}
                    <button onClick={() => deletePost(p.id)} className="text-gray-600 hover:text-gray-900">Xóa</button>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Không tìm thấy tin đăng.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPostsPage;