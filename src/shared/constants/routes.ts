export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  POST_LISTING: '/post-listing',
  SEARCH: '/search',
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    TRANSACTIONS: '/admin/transactions',
    FEES: '/admin/fees',
    REPORTS: '/admin/reports',
  },
} as const;