'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ApiService, LoginRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, user } = useAuth(); // Dùng login từ context

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Xóa lỗi khi nhập
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await ApiService.login(formData);

      if (response.success && response.data?.user) {
        const loggedInUser = response.data.user;

        // Cập nhật Auth Context
        login(loggedInUser);

        // Hiển thị thông báo thành công
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');

        // **Chuyển hướng theo role**
        setTimeout(() => {
          if (loggedInUser.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1500);
      }
    } catch (error: any) {
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';

      if (error.message) {
        const msg = error.message.toLowerCase();

        if (
          msg.includes('tài khoản hoặc mật khẩu không chính xác') ||
          msg.includes('invalid') ||
          msg.includes('unauthorized')
        ) {
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
        } else if (msg.includes('không tồn tại') || msg.includes('not found')) {
          errorMessage = 'Tài khoản không tồn tại';
        } else if (msg.includes('bị khóa') || msg.includes('locked')) {
          errorMessage = 'Tài khoản đã bị khóa';
        } else if (msg.includes('máy chủ') || msg.includes('server')) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau';
        } else if (msg.includes('kết nối') || msg.includes('network')) {
          errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra mạng';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Ngăn submit khi đang loading
  useEffect(() => {
    if (isLoading) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') e.preventDefault();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
            errors.email ? 'border-red-400 ring-red-400' : 'border-gray-300'
          }`}
          placeholder="Nhập email của bạn"
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
              errors.password ? 'border-red-400 ring-red-400' : 'border-gray-300'
            }`}
            placeholder="Nhập mật khẩu"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            disabled={isLoading}
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-yellow-500 bg-transparent border-gray-400 rounded focus:ring-yellow-500 focus:ring-2"
            disabled={isLoading}
          />
          <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
        </label>
        <a href="/forgot-password" className="text-yellow-500 hover:text-yellow-600 transition-colors">
          Quên mật khẩu?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full glass-button text-black font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
            Đang đăng nhập...
          </>
        ) : (
          'Đăng nhập'
        )}
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="glass-transparent border border-green-400/30 rounded-lg p-3 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-400 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="glass-transparent border border-red-400/30 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;