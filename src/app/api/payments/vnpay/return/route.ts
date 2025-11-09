import { NextRequest, NextResponse } from 'next/server';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Route handler để xử lý VNPay return URL
 * 
 * Nếu VNPay redirect về frontend (localhost:3000/api/payments/vnpay/return),
 * route này sẽ gọi backend API và redirect về trang /payment/return
 * 
 * Nếu VNPay redirect về backend (localhost:8080/api/payments/vnpay/return),
 * backend sẽ xử lý và có thể redirect về frontend
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy tất cả query parameters từ VNPay
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string để gửi đến backend
    const qs = new URLSearchParams();
    searchParams.forEach((value, key) => {
      qs.append(key, value);
    });

    // Gọi backend API để lấy kết quả
    const backendUrl = `${API_ENDPOINT}/payments/vnpay/return${qs.toString() ? '?' + qs.toString() : ''}`;
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Không cần auth headers vì đây là public endpoint từ VNPay
      });

      // Tạo URL frontend với tất cả query params
      const frontendUrl = new URL('/payment/return', request.nextUrl.origin);
      searchParams.forEach((value, key) => {
        frontendUrl.searchParams.append(key, value);
      });

      // Redirect về trang frontend để hiển thị kết quả
      return NextResponse.redirect(frontendUrl);
    } catch (backendError) {
      console.error('Error calling backend API:', backendError);
      // Nếu không gọi được backend, vẫn redirect về frontend với params
      const frontendUrl = new URL('/payment/return', request.nextUrl.origin);
      searchParams.forEach((value, key) => {
        frontendUrl.searchParams.append(key, value);
      });
      return NextResponse.redirect(frontendUrl);
    }
  } catch (error) {
    console.error('Error handling VNPay return:', error);
    // Nếu có lỗi, redirect về trang payment return với thông báo lỗi
    const errorUrl = new URL('/payment/return', request.nextUrl.origin);
    errorUrl.searchParams.append('error', 'redirect_failed');
    return NextResponse.redirect(errorUrl);
  }
}

