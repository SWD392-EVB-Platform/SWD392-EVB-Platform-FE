"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  type: string;
  price: number;
  status: string;
  createdAt: string;
}

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/admin/posts', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const removePost = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + `/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to delete post');
      await fetchPosts();
    } catch (err: any) {
      setError(err.message || 'Error deleting post');
    }
  };

  const togglePublish = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + `/admin/posts/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to update post');
      await fetchPosts();
    } catch (err: any) {
      setError(err.message || 'Error updating post');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quản lý tin đăng</h1>
        <div className="space-x-2">
          <Link href="/admin/posts/new" className="px-4 py-2 bg-yellow-400 rounded">Tạo tin mới</Link>
          <Link href="/admin" className="text-sm text-gray-600">Back</Link>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3">{p.price}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => togglePublish(p.id)} className="px-3 py-1 bg-yellow-400 rounded">Toggle</button>
                  <button onClick={() => removePost(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostsPage;
