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
      return data.data;
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
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching vehicles:', error);
      throw error;
    }
  }
}