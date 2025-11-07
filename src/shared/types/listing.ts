// features/shared/types.ts
export interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  odometerKm: number;
  status: string;
  createdAt?: string;
}

export interface Battery {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  batteryCapacityKWh: number;
  batteryHealthPct: number;
  cycleCount: number;
  chemistry: string;
  nominalVoltageV: number;
  compatibilityNote: string;
  status: string;
  createdAt?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  vehicleId: string | null;
  batteryId: string | null;
  title: string;
  description: string;
  priceVnd: number;
  status: string;
  createdAt?: string;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: string;
  odometerKm: string;
}

export interface BatteryFormData {
  brand: string;
  model: string;
  batteryCapacityKWh: string;
  batteryHealthPct: string;
  cycleCount: string;
  chemistry: string;
  nominalVoltageV: string;
  compatibilityNote: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  priceVnd: string;
  status: string;
}