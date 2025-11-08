import { ApiService } from '@/lib/api';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface CreateOrderRequest {
  buyerId: string;
  batteryId: string | null;
  vehicleId: string | null;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    buyerId: string;
    batteryId: string | null;
    vehicleId: string | null;
    orderDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export class OrderService {
  static async createOrder(payload: CreateOrderRequest): Promise<OrderResponse> {
    try {
      console.log('Sending order request:', payload);
      
      const response = await fetch(`${API_ENDPOINT}/orders/create-order`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to create order';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        console.error('Order creation failed:', response.status, errorMessage);
        return {
          success: false,
          message: errorMessage,
          data: null
        };
      }

      const result = await response.json();
      console.log('Order API response:', result);

      // Return the API response directly since it matches our interface
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
        data: null
      };
    }
  }

  static async getOrder(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/${encodeURIComponent(orderId)}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
