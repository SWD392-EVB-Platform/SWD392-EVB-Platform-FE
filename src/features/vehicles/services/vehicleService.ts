import { ApiService } from '@/lib/api';
import { Vehicle, VehicleSearchParams, VehicleSearchResponse } from '@/shared/types/vehicle';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class VehicleService {
  static async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_ENDPOINT}/vehicles/${id}`, {
        headers: {
          ...ApiService.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }

  const data = await response.json();
  // Support either { data: {...} } or the object directly
  if (data && data.data) return data.data;
  return data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  static async searchVehicles(params: VehicleSearchParams = {}): Promise<VehicleSearchResponse> {
    try {
      // Convert params to query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_ENDPOINT}/vehicles?${queryParams.toString()}`, {
        headers: {
          ...ApiService.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách xe');
      }

      const data = await response.json();

      // Support multiple response shapes (with/without success flag)
      if (data && typeof data === 'object' && data.success === false) {
        throw new Error(data.message || 'Không thể tải danh sách xe');
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
      console.error('Error searching vehicles:', error);
      throw error;
    }
  }
}