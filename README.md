# EVB Platform - Frontend

Nền tảng giao dịch xe điện và pin xe điện hàng đầu Việt Nam.

## Cấu trúc dự án

```
src/
├── app/
│   ├── globals.css          # CSS toàn cục với theme đen-trắng-vàng và glass effect
│   ├── layout.tsx           # Layout chính với Header, Main, Footer
│   ├── page.tsx             # Trang chủ sử dụng HomePage component
│   ├── login/
│   │   └── page.tsx         # Trang đăng nhập với glass effect
│   └── dashboard/
│       └── page.tsx         # Trang dashboard sau khi đăng nhập
├── components/
│   ├── Header.tsx           # Header với background đen, hover vàng
│   ├── Footer.tsx           # Footer component
│   ├── HomePage.tsx         # Trang chủ chính
│   ├── HeroSection.tsx      # Section hero với CTA
│   ├── FeaturesSection.tsx  # Section tính năng chính
│   ├── StatsSection.tsx     # Section thống kê
│   ├── CTASection.tsx       # Section call-to-action
│   └── LoginForm.tsx        # Form đăng nhập với validation
└── lib/
    └── api.ts               # API service cho authentication
```

## Màu sắc chính

- **Header**: Background đen (#000000)
- **Main**: Background trắng (#ffffff)
- **Accent**: Vàng (#fbbf24) - hover effect
- **Text**: Đen trên trắng, trắng trên đen

## Hiệu ứng hover

- **Text đen**: Hover thành vàng
- **Text vàng**: Hover thành đen
- **Buttons**: Smooth transition với màu sắc phù hợp

## Glass Effect

- **Login Page**: Sử dụng glass effect với backdrop-filter
- **Glass Input**: Input fields với hiệu ứng trong suốt
- **Glass Button**: Buttons với hiệu ứng glass và hover
- **Background**: Gradient từ đen đến xám với các elements động

## Công nghệ sử dụng

- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

## Chạy dự án

```bash
npm install
npm run dev
```

Dự án sẽ chạy tại http://localhost:3000

## API Authentication

### Login API
- **Endpoint**: `POST /api/authentication/login`
- **Request Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "string",
    "data": {
      "accessToken": "string",
      "expiresAtUtc": "2025-10-17T08:21:54.877Z",
      "user": {
        "userId": 0,
        "name": "string",
        "email": "string",
        "phone": "string",
        "role": "string",
        "status": "string",
        "createdAt": "2025-10-17T08:21:54.877Z",
        "updatedAt": "2025-10-17T08:21:54.877Z"
      }
    }
  }
  ```

## Trang Login

- **URL**: `/login`
- **Features**: 
  - Glass effect design phù hợp với theme
  - Form validation
  - Show/hide password
  - Remember me checkbox
  - Social login options (Google, Facebook)
  - Responsive design
  - Loading states
  - Error handling
