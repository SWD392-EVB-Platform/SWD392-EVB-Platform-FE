'use client';

import { ApiService, User } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // 🟢 LOGIN: Lưu user vào state và localStorage
  const login = (userData: User) => {
    console.log('AuthContext: Login called with user:', userData);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // 🔴 LOGOUT: Xoá token, user, cookie và redirect về Home
  const logout = () => {
    console.log('AuthContext: Logout called');

    // Xoá token trong localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
    }

    // Xoá cookie (nếu có)
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'user=; Max-Age=0; path=/;';
    document.cookie = 'tokenExpiry=; Max-Age=0; path=/;';

    // Gọi API logout (nếu backend có endpoint này)
    try {
      ApiService.logout();
    } catch (err) {
      console.warn('Logout API call failed:', err);
    }

    setUser(null);

    // 🧭 Redirect về Home page
    router.push('/');
  };

  // 🟡 CHECK AUTH: kiểm tra xem token & user có còn hợp lệ không
  const checkAuth = () => {
    console.log('AuthContext: Checking auth...');
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    const userStr = localStorage.getItem('user');
    const now = new Date();

    if (!token || !expiry || now > new Date(expiry)) {
      console.log('AuthContext: Token expired or missing');
      logout();
      setIsLoading(false);
      return;
    }

    try {
      const userData = userStr ? JSON.parse(userStr) : ApiService.getCurrentUser();
      if (userData && ApiService.isAuthenticated()) {
        console.log('AuthContext: Authenticated user:', userData);
        setUser(userData);
      } else {
        console.log('AuthContext: Not authenticated');
        setUser(null);
      }
    } catch (err) {
      console.error('AuthContext: Error parsing user data', err);
      setUser(null);
    }

    setIsLoading(false);
  };

  // 🔵 Tự động check khi app khởi chạy
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
