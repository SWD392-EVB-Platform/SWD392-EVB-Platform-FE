export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  POST_LISTING: '/post-listing',
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    TRANSACTIONS: '/admin/transactions',
    FEES: '/admin/fees',
    REPORTS: '/admin/reports',
  },
} as const;

