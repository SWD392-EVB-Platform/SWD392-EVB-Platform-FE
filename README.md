# EVB Platform - Frontend

Nền tảng giao dịch xe điện và pin xe điện hàng đầu Việt Nam.

## Cấu trúc dự án

### Cấu trúc hiện tại (đang refactoring)
```
src/
├── app/                     # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Authentication pages
│   ├── register/
│   ├── profile/
│   └── post-listing/
├── components/              # TẤT CẢ components (cần tổ chức lại)
├── contexts/               # React contexts (AuthContext)
├── hooks/                  # Custom hooks
└── lib/                    # Utilities & APIs
    └── api.ts              # API service (tất cả API calls)
```

### Cấu trúc mới (đang triển khai)
```
src/
├── features/               # Tổ chức theo feature
│   ├── auth/              # Authentication feature
│   │   ├── components/
│   │   ├── services/
│   │   └── contexts/
│   ├── posts/             # Posts feature
│   │   ├── components/
│   │   └── services/
│   └── admin/             # Admin feature
│       ├── components/
│       └── services/
├── shared/                 # Code dùng chung
│   ├── components/        # UI components
│   ├── types/             # TypeScript types
│   ├── constants/         # Constants & configs
│   ├── utils/             # Utilities
│   └── hooks/             # Shared hooks
└── app/                   # Next.js App Router (giữ nguyên)
```

## Cấu trúc mới đã được thiết lập

✅ **Đã hoàn thành**:
- Cấu trúc thư mục `features/` và `shared/` 
- Types, constants, services riêng biệt theo feature
- Sẵn sàng để migrate components

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

- **Next.js** 15.5.5 (App Router)
- **React** 19.2.0
- **TypeScript** 5.x
- **Tailwind CSS** 4.1.14
- **Chart.js** 4.5.1 (Admin dashboard)
- **React Icons** 5.5.0

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
