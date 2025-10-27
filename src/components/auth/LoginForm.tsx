'use client';

import React, { useState, useEffect } from 'react';
import { ApiService, LoginRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Debug effect to track errors state changes
  useEffect(() => {
    if (errors.submit) {
      console.log('Error message to display:', errors.submit);
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const response = await ApiService.login(formData);
      
      if (response.success) {
        // Update auth context with user data
        login(response.data.user);
        
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Redirect to home page after a short delay to show success message
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (error.message) {
        // Check for specific error patterns
        const message = error.message.toLowerCase();
        
        if (message.includes('tài khoản hoặc mật khẩu không chính xác') ||
            message.includes('invalid email or password') || 
            message.includes('invalid credentials') || 
            message.includes('unauthorized') ||
            message.includes('invalid') ||
            message.includes('incorrect') ||
            message.includes('wrong')) {
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
        } else if (message.includes('tài khoản không tồn tại') ||
                   message.includes('user not found') || 
                   message.includes('account not found')) {
          errorMessage = 'Tài khoản không tồn tại';
        } else if (message.includes('tài khoản đã bị khóa') ||
                   message.includes('account disabled') || 
                   message.includes('account locked') ||
                   message.includes('bị khóa')) {
          errorMessage = 'Tài khoản đã bị khóa';
        } else if (message.includes('lỗi máy chủ') ||
                   message.includes('server error') || 
                   message.includes('internal error')) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau';
        } else if (message.includes('lỗi kết nối') ||
                   message.includes('network') || 
                   message.includes('connection')) {
          errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại';
        } else {
          // Use the original error message if it's already in Vietnamese or clear
          errorMessage = error.message;
        }
      }
      
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
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
          className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none ${
            errors.email ? 'border-red-400' : ''
          }`}
          placeholder="Nhập email của bạn"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none pr-12 ${
              errors.password ? 'border-red-400' : ''
            }`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-yellow-500 bg-transparent border-gray-400 rounded focus:ring-yellow-500 focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600 transition-colors duration-200">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full glass-button text-black font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
            Signing in...
          </div>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="glass-transparent border border-green-400/30 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="glass-transparent border border-red-400/30 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors duration-200">
            Sign up now
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
