'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/shared/constants/routes';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image với overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <Image
          src="/images/hero-background.jpg"
          alt="Electric Vehicle Background"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
        {/* Overlay để text dễ đọc hơn - giảm độ mờ */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/15 to-green-900/20"></div>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20 max-w-5xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gray-900">Nền Tảng Giao Dịch</span>
          <br />
          <span className="text-blue-600">Xe Điện</span>
          <span className="text-gray-900"> & </span>
          <span className="text-green-600">Pin Qua Sử Dụng</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-900 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Mua bán xe điện và pin đã qua sử dụng một cách an toàn, minh bạch với{' '}
          <span className="font-bold text-blue-600">công nghệ AI hỗ trợ định giá</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Nút Khám phá ngay - Gradient xanh dương đến xanh lá */}
          <Link
            href={ROUTES.SEARCH}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-semibold rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Khám phá ngay
          </Link>

          {/* Nút Đăng tin bán - Nền trắng/xám nhạt */}
          <Link
            href={ROUTES.POST_LISTING}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 text-lg font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Đăng tin bán
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;
