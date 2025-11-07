import { ApiService } from '@/lib/api';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface VNPayCreatePaymentRequest {
  amount: number;
  orderInfo: string;
  returnUrl: string;
}

export interface VNPayResponse {
  paymentUrl: string;
}

export class PaymentService {
  // Create VNPay payment for an existing order (backend expects orderId in the path)
  static async createVNPayForOrder(orderId: string, returnUrl?: string): Promise<VNPayResponse> {
    try {
      const url = `${API_ENDPOINT}/payments/orders/${encodeURIComponent(orderId)}/payments/vnpay`;
      const body = returnUrl ? { returnUrl } : undefined;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('createVNPayForOrder failed:', response.status, text);
        throw new Error('Failed to create VNPay payment for order');
      }

      const result = await response.json();
      // expected result.data.paymentUrl
      return result.data;
    } catch (error) {
      console.error('Error creating VNPay payment for order:', error);
      throw error;
    }
  }

  // Verify VNPay return / callback. Different backends implement this differently:
  // - some expose a GET callback endpoint called by VNPay (no params) and store result server-side;
  // - others expect the frontend to POST VNPay query params back for verification.
  // Here we provide a generic POST-based verification (frontend sends VNPay params to backend)
  static async verifyVNPayReturn(vnpParams: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINT}/payments/payments/vnpay/callback`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vnpParams),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('verifyVNPayReturn failed:', response.status, text);
        throw new Error('Failed to verify VNPay return');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error verifying VNPay return:', error);
      throw error;
    }
  }
}