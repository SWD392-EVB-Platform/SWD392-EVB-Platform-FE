/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Giúp tránh hydration mismatch với React 19
    optimizePackageImports: ['@tailwindcss/postcss'],
  },
  // Cải thiện hiệu suất build
  outputFileTracingRoot: undefined,
}

module.exports = nextConfig
