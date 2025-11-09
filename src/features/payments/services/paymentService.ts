import { ApiService } from '@/lib/api';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface VNPayCreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
  } | null;
}

export interface VNPayReturnResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    orderId?: string;
    amount?: string;
    transactionNo?: string;
    responseCode?: string;
    transactionStatus?: string;
  };
}

export interface VNPayCallbackResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    orderId: string;
    amount: string;
    transactionNo: string;
    responseCode: string;
    transactionStatus: string;
  };
}

export class PaymentService {
  // Create VNPay payment for an existing order
  static async createVNPayForOrder(orderId: string): Promise<VNPayCreatePaymentResponse> {
    try {
      const url = `${API_ENDPOINT}/payments/orders/${encodeURIComponent(orderId)}/payments/vnpay`;
      console.log('Creating VNPay payment for order:', orderId);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log('Payment API response:', result);

      // API may return 200 OK but with success: false for business logic errors
      if (!response.ok || !result.success) {
        const errorMsg = result.message || 'Failed to create VNPay payment for order';
        console.error('Payment creation failed:', errorMsg);
        return {
          success: false,
          message: errorMsg,
          data: null
        };
      }

      // Return the API response directly
      return result;
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create VNPay payment',
        data: null
      }
    }
  }


  /**
   * Gọi backend endpoint /api/payments/vnpay/return để lấy kết quả thanh toán
   * Backend sẽ trả về thông báo thành công/thất bại
   * GET /api/payments/vnpay/return
   */
  static async getVNPayReturnResult(vnpParams: Record<string, any>): Promise<VNPayReturnResponse> {
    try {
      // Build query string from vnpParams
      const qs = new URLSearchParams();
      Object.entries(vnpParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      });

      const url = `${API_ENDPOINT}/payments/vnpay/return${qs.toString() ? '?' + qs.toString() : ''}`;
      console.log('Calling VNPay return endpoint:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('getVNPayReturnResult failed:', response.status, text);
        throw new Error('Failed to get VNPay return result');
      }

      const result = await response.json();
      console.log('VNPay return response:', result);
      return result;
    } catch (error) {
      console.error('Error getting VNPay return result:', error);
      throw error;
    }
  }

  /**
   * Gọi backend IPN callback endpoint (VNPay gọi server để xác nhận)
   * GET /api/payments/vnpay/callback
   */
  static async verifyVNPayReturn(vnpParams: Record<string, any>): Promise<VNPayCallbackResponse> {
    try {
      // Build query string from vnpParams
      const qs = new URLSearchParams();
      Object.entries(vnpParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      });

      const url = `${API_ENDPOINT}/payments/vnpay/callback${qs.toString() ? '?' + qs.toString() : ''}`;
      console.log('Calling VNPay callback:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('verifyVNPayReturn failed:', response.status, text);
        throw new Error('Failed to verify VNPay return');
      }

      const result = await response.json();
      console.log('VNPay callback response:', result);
      return result;
    } catch (error) {
      console.error('Error verifying VNPay return:', error);
      throw error;
    }
  }

}