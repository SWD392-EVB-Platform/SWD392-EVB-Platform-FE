// features/batteries/services/BatteryService.ts
import { ApiService } from '@/lib/api';
import { Battery, BatterySearchParams, BatterySearchResponse } from '@/shared/types/battery';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class BatteryService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...ApiService.getAuthHeaders(),
    };
  }

  // === GET BY ID ===
  static async getBatteryById(id: string): Promise<Battery> {
    try {
      const response = await fetch(`${API_ENDPOINT}/batteries/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch battery');
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

  // === SEARCH ===
  static async searchBatteries(params: BatterySearchParams = {}): Promise<BatterySearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_ENDPOINT}/batteries?${queryParams.toString()}`, {
        headers: this.getHeaders(),
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

  // === CREATE BATTERY (MỚI THÊM) ===
  static async createBattery(data: {
    ownerId: string;
    brand: string;
    model: string;
    batteryCapacityKWh: string;
    batteryHealthPct?: string;
    cycleCount?: string;
    chemistry?: string;
    nominalVoltageV?: string;
    compatibilityNote?: string;
    status?: string; 

  }): Promise<Battery> {
    try {
      const payload = {
        ownerId: data.ownerId,
        brand: data.brand.trim(),
        model: data.model.trim(),
        batteryCapacityKWh: parseFloat(data.batteryCapacityKWh) || 0,
        batteryHealthPct: parseFloat(data.batteryHealthPct || '0') || 0,
        cycleCount: parseInt(data.cycleCount || '0') || 0,
        chemistry: data.chemistry?.trim() || '',
        nominalVoltageV: parseFloat(data.nominalVoltageV || '0') || 0,
        compatibilityNote: data.compatibilityNote?.trim() || '',
        status: 'available',
      };

      const response = await fetch(`${API_ENDPOINT}/batteries`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Không thể tạo pin');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Create battery error:', error);
      throw error;
    }
  }
}