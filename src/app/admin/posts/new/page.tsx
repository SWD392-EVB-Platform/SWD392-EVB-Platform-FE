"use client";

import React from 'react';
import PostForm from '@/components/PostForm';
import Link from 'next/link';

const NewPostPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tạo tin đăng mới</h1>
        <Link href="/admin/posts" className="text-sm text-gray-600">Back to posts</Link>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <PostForm />
      </div>
    </div>
  );
};

export default NewPostPage;
