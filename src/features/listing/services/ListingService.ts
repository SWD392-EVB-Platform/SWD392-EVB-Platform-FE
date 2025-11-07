// features/listings/services/ListingService.ts
import { ApiService } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ListingService {
  private static async makeRequest<T>(endpoint: string, method: string, data?: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = ApiService.getAuthHeaders();

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    let result: any;
    try {
      result = await response.json();
    } catch {
      result = { message: 'Phản hồi không hợp lệ' };
    }

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;
  }

  static async createListing(data: any) {
    // Loại bỏ null
    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null)
    );
    return this.makeRequest('/listings', 'POST', payload);
  }
}

export default ListingService;