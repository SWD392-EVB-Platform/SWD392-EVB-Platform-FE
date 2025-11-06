// API service for authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: {
      accessToken: string;
      accessTokenExpires: string;
      refreshToken: string;
    };
    user: User;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiService {
  static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
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
      if (data.success && data.data?.token?.accessToken) {
        localStorage.setItem('accessToken', data.data.token.accessToken);
        localStorage.setItem('refreshToken', data.data.token.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('tokenExpiry', data.data.token.accessTokenExpires);
      }

      return data;
    } catch (error) {
      // Don't log to console.error to avoid Next.js error overlay
      console.log('Login error:', error);
      throw error;
    }
  }

  static async register(payload: RegisterRequest): Promise<AuthResponse> {
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
      if (data.success && data.data?.token?.accessToken) {
        localStorage.setItem('accessToken', data.data.token.accessToken);
        localStorage.setItem('refreshToken', data.data.token.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('tokenExpiry', data.data.token.accessTokenExpires);
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        // No token found, just clear storage
        this.clearAuthData();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/authentication/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // No need to send refresh token in body if using Bearer token
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Successful logout
            this.clearAuthData();
            return;
          }
        }
        
        // If we get here, something went wrong with the API call
        console.warn('Logout API returned error:', response.status, response.statusText);
      } catch (error) {
        // Network error or other API issues
        console.warn('Failed to call logout API:', error);
      }

      // Always clear local data even if API call fails
      this.clearAuthData();
    } catch (error) {
      // Catch any other errors and ensure we clear local data
      console.error('Unexpected error during logout:', error);
      this.clearAuthData();
    }
  }

  private static clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
