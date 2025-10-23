"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type PostStatus = 'pending' | 'published' | 'spam' | 'verified' | 'deleted';

type Post = {
  id: number;
  title: string;
  type: string;
  price: number;
  status: PostStatus;
  verified?: boolean;
  createdAt: string;
};

const MOCK_POSTS: Post[] = [
  { id: 101, title: 'VinFast Klara 2019', type: 'xe', price: 15000000, status: 'pending', verified: false, createdAt: new Date().toISOString() },
  { id: 102, title: 'Battery Pack 48V 20Ah', type: 'pin', price: 4500000, status: 'published', verified: true, createdAt: new Date(Date.now()-86400000).toISOString() },
  { id: 103, title: 'Used e-scooter', type: 'xe', price: 7000000, status: 'spam', verified: false, createdAt: new Date(Date.now()-3600000).toISOString() },
  { id: 104, title: 'New Battery 60V', type: 'pin', price: 6500000, status: 'pending', verified: false, createdAt: new Date(Date.now()-7200000).toISOString() },
  { id: 105, title: 'Service Offer', type: 'other', price: 0, status: 'published', verified: false, createdAt: new Date(Date.now()-172800000).toISOString() },
];

const FILTERS = ['all', 'pending', 'published', 'spam', 'verified'] as const;

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  useEffect(() => {
    // load mock
    setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 300);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return posts.filter(p => p.status !== 'deleted');
    if (filter === 'verified') return posts.filter(p => p.verified && p.status !== 'deleted');
    // other filters: pending, published, spam
    return posts.filter(p => p.status === filter);
  }, [posts, filter]);

  const approve = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
  };

  const markSpam = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'spam' } : p));
  };

  const verify = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
  };

  const remove = (id: number) => {
    if (!confirm('Xóa bài đăng này?')) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'deleted' } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý tin đăng (Mock)</h1>
        <div className="space-x-2">
          <Link href="/admin/posts/new" className="px-4 py-2 bg-yellow-400 rounded">Tạo tin mới</Link>
          <Link href="/admin" className="text-sm text-gray-600">Back</Link>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded ${filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
            {f === 'all' ? 'Tất cả' : f === 'verified' ? 'Đã kiểm định' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${p.status === 'published' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : p.status === 'spam' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.verified ? <span className="text-sm text-green-600 font-medium">Đã kiểm định</span> : '-'}</td>
                  <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 space-x-2">
                    {p.status === 'pending' && <button onClick={() => approve(p.id)} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>}
                    {p.status !== 'spam' && <button onClick={() => markSpam(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Mark Spam</button>}
                    {!p.verified && <button onClick={() => verify(p.id)} className="px-3 py-1 bg-blue-500 text-white rounded">Đã kiểm định</button>}
                    <button onClick={() => remove(p.id)} className="px-3 py-1 bg-gray-300 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">Không tìm thấy bài đăng.</td>
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
