import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Battery } from '@/shared/types/battery';
import { Vehicle } from '@/shared/types/vehicle';

interface ProductState {
  selectedBattery: Battery | null;
  selectedVehicle: Vehicle | null;
  productType: 'battery' | 'vehicle' | null;
}

const initialState: ProductState = {
  selectedBattery: null,
  selectedVehicle: null,
  productType: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedBattery: (state, action: PayloadAction<Battery>) => {
      state.selectedBattery = action.payload;
      state.selectedVehicle = null;
      state.productType = 'battery';
    },
    setSelectedVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.selectedVehicle = action.payload;
      state.selectedBattery = null;
      state.productType = 'vehicle';
    },
    clearSelectedProduct: (state) => {
      state.selectedBattery = null;
      state.selectedVehicle = null;
      state.productType = null;
    },
  },
});

export const { setSelectedBattery, setSelectedVehicle, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

