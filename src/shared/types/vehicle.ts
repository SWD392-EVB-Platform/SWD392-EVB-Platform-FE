export interface Vehicle {
  vehicleId: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  odometerKm: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSearchParams {
  vehicleId?: string;
  ownerId?: string;
  brand?: string;
  model?: string;
  year?: number;
  odometerKm?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface VehicleSearchResponse {
  items: Vehicle[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}