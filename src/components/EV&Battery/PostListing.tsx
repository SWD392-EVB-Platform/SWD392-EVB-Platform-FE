'use client';

import { ApiService } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBattery,
  FiCheck,
  FiRefreshCw,
  FiTruck,
} from 'react-icons/fi';

import { BatteryService } from '@/features/batteries/services/batteryService';
import ListingService from '@/features/listing/services/ListingService';
import { VehicleService } from '@/features/vehicles/services/vehicleService';
import type { User } from '@/lib/api';

interface PostListingProps {
  onSuccess?: () => void;
}

export default function PostListing({ onSuccess }: PostListingProps) {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<'choose' | 'create' | 'listing'>('choose');
  const [itemType, setItemType] = useState<'vehicle' | 'battery'>('vehicle');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    year: '',
    odometerKm: '',
  });

  const [batteryForm, setBatteryForm] = useState({
    brand: '',
    model: '',
    batteryCapacityKWh: '',
    batteryHealthPct: '',
    cycleCount: '',
  });

  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    priceVnd: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const currentUser = ApiService.getCurrentUser();
    if (currentUser?.userId) {
      setUser(currentUser);
    } else {
      setError('Vui lòng đăng nhập');
    }
  }, []);

  const resetForms = () => {
    setVehicleForm({ brand: '', model: '', year: '', odometerKm: '' });
    setBatteryForm({
      brand: '',
      model: '',
      batteryCapacityKWh: '',
      batteryHealthPct: '',
      cycleCount: '',
    });
    setListingForm({ title: '', description: '', priceVnd: '' });
    setCreatedId(null);
    setError(null);
    setSuccess(false);
  };

  const handleCreateItem = async () => {
    if (!user?.userId) {
      setError('Không tìm thấy người dùng');
      return;
    }

    const required = itemType === 'vehicle'
      ? ['brand', 'model', 'year']
      : ['brand', 'model', 'batteryCapacityKWh'];
    const formData = itemType === 'vehicle' ? vehicleForm : batteryForm;

    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Vui lòng nhập ${field === 'batteryCapacityKWh' ? 'dung lượng pin' : field}`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let result: any;

      if (itemType === 'vehicle') {
        result = await VehicleService.createVehicle({
          ownerId: user.userId,
          brand: vehicleForm.brand.trim(),
          model: vehicleForm.model.trim(),
          year: vehicleForm.year,
          odometerKm: vehicleForm.odometerKm || '0',
          status: 'active',
        });
      } else {
        result = await BatteryService.createBattery({
          ownerId: user.userId,
          brand: batteryForm.brand.trim(),
          model: batteryForm.model.trim(),
          batteryCapacityKWh: batteryForm.batteryCapacityKWh,
          batteryHealthPct: batteryForm.batteryHealthPct || '0',
          cycleCount: batteryForm.cycleCount || '0',
          status: 'active',
        });
      }

      // LẤY ID TỪ NHIỀU VỊ TRÍ
      const id = result?.data?.id || result?.id || result?.vehicleId || result?.batteryId;
      
      console.log('[DEBUG] Create item response:', result);
      console.log('[DEBUG] Extracted ID:', id);

      if (!id) {
        throw new Error('Tạo thất bại: Không nhận được ID từ server');
      }

      setCreatedId(String(id));
      setStep('listing');
    } catch (err: any) {
      console.error('Create item error:', err);
      setError(err.message || 'Không thể tạo. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
  if (!user?.userId || !createdId) {
    setError('Thiếu thông tin');
    return;
  }

  if (!listingForm.title || !listingForm.description || !listingForm.priceVnd) {
    setError('Vui lòng điền đầy đủ');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const price = parseFloat(listingForm.priceVnd.replace(/[^0-9.-]+/g, ''));
    if (isNaN(price) || price <= 0) throw new Error('Giá phải lớn hơn 0');

    // Tạo payload sạch
    const payload: any = {
      sellerId: user.userId,
      title: listingForm.title.trim(),
      description: listingForm.description.trim(),
      priceVnd: price,
      status: 'active',
    };

    // Chỉ thêm đúng ID
    if (itemType === 'vehicle') {
      payload.vehicleId = createdId;
    } else {
      payload.batteryId = createdId;
    }

    console.log('[DEBUG] Final payload:', payload);

    const response = await ListingService.createListing(payload);

    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      setStep('choose');
      resetForms();
    }, 1200);
  } catch (err: any) {
    console.error('Create listing error:', err);
    setError(err.message || 'Lỗi server');
  } finally {
    setLoading(false);
  }
};

  if (!user) {
    return (
      <div className="p-8 text-center">
        <FiAlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-700">Vui lòng đăng nhập</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {step === 'choose' && (
        <div>
          <h3 className="text-xl font-bold text-center mb-6">Bạn muốn bán gì?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setItemType('vehicle'); setStep('create'); }}
              className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl shadow hover:scale-105 transition-all"
            >
              <FiTruck className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold">Xe điện</p>
            </button>
            <button
              onClick={() => { setItemType('battery'); setStep('create'); }}
              className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow hover:scale-105 transition-all"
            >
              <FiBattery className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold">Pin cũ</p>
            </button>
          </div>
        </div>
      )}

      {step === 'create' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              Tạo {itemType === 'vehicle' ? 'xe' : 'pin'}
            </h3>
            <button
              onClick={() => { setStep('choose'); resetForms(); }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Thay đổi
            </button>
          </div>

          {itemType === 'vehicle' ? (
            <div className="space-y-4">
              <input placeholder="Hãng xe *" value={vehicleForm.brand} onChange={e => setVehicleForm({...vehicleForm, brand: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input placeholder="Dòng xe *" value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="number" placeholder="Năm sản xuất *" value={vehicleForm.year} onChange={e => setVehicleForm({...vehicleForm, year: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="number" placeholder="Số km" value={vehicleForm.odometerKm} onChange={e => setVehicleForm({...vehicleForm, odometerKm: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <input placeholder="Hãng pin *" value={batteryForm.brand} onChange={e => setBatteryForm({...batteryForm, brand: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input placeholder="Model pin *" value={batteryForm.model} onChange={e => setBatteryForm({...batteryForm, model: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="number" placeholder="Dung lượng (kWh) *" value={batteryForm.batteryCapacityKWh} onChange={e => setBatteryForm({...batteryForm, batteryCapacityKWh: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="number" placeholder="Sức khỏe (%)" value={batteryForm.batteryHealthPct} onChange={e => setBatteryForm({...batteryForm, batteryHealthPct: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="number" placeholder="Số chu kỳ" value={batteryForm.cycleCount} onChange={e => setBatteryForm({...batteryForm, cycleCount: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
            </div>
          )}

          <button
            onClick={handleCreateItem}
            disabled={loading}
            className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <>Đang tạo... <FiRefreshCw className="animate-spin" /></> : <>Tiếp tục <FiArrowRight /></>}
          </button>
        </div>
      )}

      {step === 'listing' && createdId && (
        <div>
          <h3 className="text-xl font-bold text-center mb-4">Hoàn tất tin đăng</h3>
          <p className="text-sm text-green-600 text-center mb-4">
            Đã tạo {itemType === 'vehicle' ? 'xe' : 'pin'} thành công!
          </p>

          <input placeholder="Tiêu đề *" value={listingForm.title} onChange={e => setListingForm({...listingForm, title: e.target.value})} className="w-full px-4 py-3 border rounded-lg mb-4" />
          <textarea placeholder="Mô tả *" value={listingForm.description} onChange={e => setListingForm({...listingForm, description: e.target.value})} rows={3} className="w-full px-4 py-3 border rounded-lg resize-none mb-4" />
          <input type="text" placeholder="Giá (VND) *" value={listingForm.priceVnd} onChange={e => setListingForm({...listingForm, priceVnd: e.target.value})} className="w-full px-4 py-3 border rounded-lg mb-6" />

          <button
            onClick={handleCreateListing}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <>Đang đăng... <FiRefreshCw className="animate-spin" /></> : <>Đăng tin <FiCheck /></>}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <FiAlertCircle /> {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm">
          <FiCheck /> Đăng tin thành công!
        </div>
      )}
    </div>
  );
}