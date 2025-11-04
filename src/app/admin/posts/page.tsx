// app/admin/posts/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiAlertTriangle, FiShield, FiTrash2 } from 'react-icons/fi';

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
  { id: 101, title: 'VinFast Klara 2019', type: 'vehicle', price: 15000000, status: 'pending', verified: false, createdAt: new Date().toISOString() },
  { id: 102, title: 'Battery Pack 48V 20Ah', type: 'pin', price: 4500000, status: 'published', verified: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 103, title: 'Used e-scooter', type: 'vehicle', price: 7000000, status: 'spam', verified: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
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
        <h1 className="text-2xl font-bold text-gray-800">Post Management</h1>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value as typeof FILTERS[number])}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        >
          {FILTERS.map(f => (
            <option key={f} value={f}>
              {f === 'all' ? 'All' : f === 'verified' ? 'Tested' : f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verify</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creation Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.verified ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {p.status === 'pending' && (
                      <button
                        onClick={() => approvePost(p.id)}
                        className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 rounded p-2 transition-colors"
                        title="Duyệt"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                    )}
                    {p.status !== 'spam' && (
                      <button
                        onClick={() => markSpam(p.id)}
                        className="bg-red-100 text-red-800 hover:bg-red-200 border border-red-300 rounded p-2 transition-colors"
                        title="Spam"
                      >
                        <FiAlertTriangle className="w-5 h-5" />
                      </button>
                    )}
                    {!p.verified && (
                      <button
                        onClick={() => verifyPost(p.id)}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 rounded p-2 transition-colors"
                        title="Kiểm định"
                      >
                        <FiShield className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deletePost(p.id)}
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 rounded p-2 transition-colors"
                      title="Xóa"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
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