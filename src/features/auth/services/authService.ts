import { API_BASE_URL } from '@/shared/constants';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
} from '@/shared/types';

class AuthService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Parse response data first
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Lỗi kết nối. Vui lòng thử lại');
      }

      // Check if response is successful
      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          throw new Error('Tài khoản hoặc mật khẩu không chính xác');
        } else if (response.status === 404) {
          throw new Error('Tài khoản không tồn tại');
        } else if (response.status === 403) {
          throw new Error('Tài khoản đã bị khóa');
        } else if (response.status >= 500) {
          throw new Error('Lỗi máy chủ. Vui lòng thử lại sau');
        } else {
          // Use the error message from API response if available
          const errorMessage = data?.message || data?.error || 'Đăng nhập thất bại';
          throw new Error(errorMessage);
        }
      }

      // Check if the response data indicates success
      if (!data.success) {
        const errorMessage = data.message || data.error || 'Đăng nhập thất bại';
        throw new Error(errorMessage);
      }

      // Store token and user data
      if (data.success && data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('tokenExpiry', data.data.expiresAtUtc);
      }

      return data;
    } catch (error) {
      // Don't log to console.error to avoid Next.js error overlay
      console.log('Login error:', error);
      throw error;
    }
  }

  static async register(payload: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/authentication/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      // Optionally auto-login after register if token is returned
      if (data.success && data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('tokenExpiry', data.data.expiresAtUtc);
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return false;
    
    // Check if token is expired
    const now = new Date();
    const expiryDate = new Date(expiry);
    
    return now < expiryDate;
  }
}

export default AuthService;

