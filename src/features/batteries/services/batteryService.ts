import { ApiService } from '@/lib/api';
import { Battery, BatterySearchParams, BatterySearchResponse } from '@/shared/types/battery';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class BatteryService {
  static async getBatteryById(id: string): Promise<Battery> {
    try {
      const response = await fetch(`${API_ENDPOINT}/batteries/${id}`, {
        headers: {
          ...ApiService.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch battery');
      }

  const data = await response.json();
  // Some backends return { data: { ... } }, others return the object directly
  if (data && data.data) return data.data;
  return data;
    } catch (error) {
      console.error('Error fetching battery:', error);
      throw error;
    }
  }

  static async searchBatteries(params: BatterySearchParams = {}): Promise<BatterySearchResponse> {
    try {
      // Convert params to query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_ENDPOINT}/batteries?${queryParams.toString()}`, {
        headers: {
          ...ApiService.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách pin');
      }

      const data = await response.json();

      // Some APIs return { success: true, data: { items: [...] } }
      // Others return { items: [...] } directly. Handle both.
      if (data && typeof data === 'object' && data.success === false) {
        throw new Error(data.message || 'Không thể tải danh sách pin');
      }

      const items = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.data?.items)
        ? data.data.items
        : Array.isArray(data.data)
        ? data.data
        : [];

      const totalCount = data.totalCount ?? data.data?.totalCount ?? items.length;
      const totalPages = data.totalPages ?? data.data?.totalPages ?? Math.ceil((totalCount || 0) / (parseInt(queryParams.get('pageSize') || '10')));

      return {
        items,
        totalCount,
        page: parseInt(queryParams.get('page') || '1'),
        pageSize: parseInt(queryParams.get('pageSize') || '10'),
        totalPages,
      };
    } catch (error) {
      console.error('Error searching batteries:', error);
      throw error;
    }
  }
}