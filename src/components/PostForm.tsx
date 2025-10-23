"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/lib/api";

type VehicleType = "xe" | "pin";

interface TechSpec {
  key: string;
  value: string;
}

const PostForm: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<VehicleType>("xe");
  const [price, setPrice] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [specs, setSpecs] = useState<TechSpec[]>([{ key: "", value: "" }]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!title.trim()) e.title = "Tiêu đề là bắt buộc";
    if (!type) e.type = "Chọn loại (xe hoặc pin)";
    if (!price.trim()) e.price = "Giá là bắt buộc";
    else if (!/^\d{1,15}(?:\.\d{1,2})?$/.test(price.replace(/,/g, "")))
      e.price = "Giá không hợp lệ";
    if (!location.trim()) e.location = "Vị trí là bắt buộc";
    if (specs.some((s) => !s.key.trim() || !s.value.trim()))
      e.specs = "Vui lòng điền đầy đủ thông số kỹ thuật hoặc xóa hàng trống";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddSpec = () => setSpecs((s) => [...s, { key: "", value: "" }]);
  const handleRemoveSpec = (idx: number) =>
    setSpecs((s) => s.filter((_, i) => i !== idx));
  const handleSpecChange = (idx: number, field: keyof TechSpec, value: string) =>
    setSpecs((s) => s.map((sp, i) => (i === idx ? { ...sp, [field]: value } : sp)));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) continue;
      newFiles.push(f);
      newPreviews.push(URL.createObjectURL(f));
    }

    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    // reset input value to allow re-uploading same file if removed later
    e.currentTarget.value = "";
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => {
      const url = prev[idx];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("type", type);
      form.append("price", price.trim());
      form.append("location", location.trim());
      form.append("description", description.trim());
      form.append("specs", JSON.stringify(specs.filter((s) => s.key && s.value)));

      images.forEach((file, idx) => {
        form.append("images", file, file.name || `image-${idx}`);
      });

      // Use fetch directly to send multipart because ApiService.login/register use JSON
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/posts";

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Lỗi server: ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      // on success, redirect to dashboard or post
      router.push("/dashboard");
    } catch (err: any) {
      setErrors({ submit: err?.message || "Gửi bài thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none ${errors.title ? 'border-red-400' : ''}`}
          placeholder="Tiêu đề đăng bán (ví dụ: VinFast Klara 2020 - cũ, chạy ít)"
          disabled={isLoading}
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as VehicleType)}
            className="w-full px-4 py-3 glass-input rounded-lg focus:outline-none"
            disabled={isLoading}
          >
            <option value="xe">Xe</option>
            <option value="pin">Pin</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-400">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none ${errors.price ? 'border-red-400' : ''}`}
            placeholder="Ví dụ: 12000000"
            disabled={isLoading}
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={`w-full px-4 py-3 glass-input rounded-lg focus:outline-none ${errors.location ? 'border-red-400' : ''}`}
          placeholder="Tỉnh/Thành - Quận/Huyện"
          disabled={isLoading}
        />
        {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 glass-input rounded-lg focus:outline-none min-h-[120px]"
          placeholder="Mô tả chi tiết về tình trạng xe/pin, lịch sử, giấy tờ, liên hệ,..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thông số kỹ thuật</label>
        <div className="space-y-2">
          {specs.map((s, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={s.key}
                onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                className="flex-1 px-3 py-2 glass-input rounded-lg focus:outline-none"
                placeholder="Tên (ví dụ: Dung lượng pin, Công suất)"
                disabled={isLoading}
              />
              <input
                value={s.value}
                onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                className="flex-1 px-3 py-2 glass-input rounded-lg focus:outline-none"
                placeholder="Giá trị (ví dụ: 48V 20Ah)"
                disabled={isLoading}
              />
              <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-red-500 px-2" disabled={isLoading}>
                Xóa
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button type="button" onClick={handleAddSpec} className="glass-button px-3 py-2 rounded-lg" disabled={isLoading}>
            Thêm thông số
          </button>
        </div>
        {errors.specs && <p className="mt-1 text-sm text-red-400">{errors.specs}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh (tối đa 8)</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={isLoading} />

        {imagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-md" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-black/40 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {errors.submit && (
        <div className="glass-transparent border border-red-400/30 rounded-lg p-3">
          <p className="text-sm text-red-400">{errors.submit}</p>
        </div>
      )}

      <div>
        <button type="submit" disabled={isLoading} className="w-full glass-button text-black font-semibold py-3 px-4 rounded-lg">
          {isLoading ? "Đang gửi..." : "Đăng tin"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
