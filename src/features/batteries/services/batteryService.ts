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
      return data.data;
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
        throw new Error('Failed to fetch batteries');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching batteries:', error);
      throw error;
    }
  }
}