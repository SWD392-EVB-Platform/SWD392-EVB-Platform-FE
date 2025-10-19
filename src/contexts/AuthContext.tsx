'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    console.log('AuthContext: Login called with user:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    ApiService.logout();
    setUser(null);
  };

  const checkAuth = () => {
    console.log('AuthContext: Checking auth...');
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const userData = ApiService.getCurrentUser();
      
      console.log('AuthContext: Token exists:', !!token);
      console.log('AuthContext: User data:', userData);
      console.log('AuthContext: Is authenticated:', ApiService.isAuthenticated());
      
      if (token && userData && ApiService.isAuthenticated()) {
        console.log('AuthContext: Setting user:', userData);
        setUser(userData);
      } else {
        console.log('AuthContext: Not authenticated, clearing user');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
