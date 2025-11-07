// features/vehicles/services/VehicleService.ts
import { ApiService } from '@/lib/api';
import { Vehicle, VehicleSearchParams, VehicleSearchResponse } from '@/shared/types/vehicle';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class VehicleService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...ApiService.getAuthHeaders(),
    };
  }

  // === GET BY ID ===
  static async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const response = await fetch(`${API_ENDPOINT}/vehicles/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch vehicle');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  // === SEARCH ===
  static async searchVehicles(params: VehicleSearchParams = {}): Promise<VehicleSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_ENDPOINT}/vehicles?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch vehicles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching vehicles:', error);
      throw error;
    }
  }

  // === CREATE VEHICLE (MỚI THÊM) ===
  static async createVehicle(data: {
    ownerId: string;
    brand: string;
    model: string;
    year: string;
    odometerKm?: string;
    status?: string; 

  }): Promise<Vehicle> {
    try {
      const payload = {
        ownerId: data.ownerId,
        brand: data.brand.trim(),
        model: data.model.trim(),
        year: parseInt(data.year) || 0,
        odometerKm: parseFloat(data.odometerKm || '0') || 0,
        status: 'available',
      };

      const response = await fetch(`${API_ENDPOINT}/vehicles`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Không thể tạo xe');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Create vehicle error:', error);
      throw error;
    }
  }
}