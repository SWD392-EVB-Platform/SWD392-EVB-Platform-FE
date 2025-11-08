export interface Battery {
  batteryId: string;
  ownerId: string;
  brand: string;
  model: string;
  batteryCapacityKwh: number;
  batteryHealthPct: number;
  cycleCount: number;
  chemistry: string;
  nominalVoltageV: number;
  compatibilityNote: string;
  avatarUrl: string | null;
  priceVnd: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatterySearchParams {
  batteryId?: string;
  ownerId?: string;
  brand?: string;
  model?: string;
  batteryCapacityKwh?: number;
  batteryHealthPct?: number;
  cycleCount?: number;
  chemistry?: string;
  nominalVoltageV?: number;
  compatibilityNote?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface BatterySearchResponse {
  items: Battery[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}