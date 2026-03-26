# Hướng dẫn thêm ảnh background

## Cách thêm ảnh background cho Hero Section

1. **Đặt ảnh vào folder này** (`fe-app/public/images/`)

2. **Đặt tên file:** `hero-background.jpg`
   - Hoặc bạn có thể đổi tên file khác và cập nhật trong `HeroSection.tsx`

3. **Định dạng ảnh được hỗ trợ:**
   - `.jpg` / `.jpeg`
   - `.png`
   - `.webp` (khuyến nghị - chất lượng tốt, kích thước nhỏ)

4. **Kích thước ảnh khuyến nghị:**
   - Độ rộng: 1920px trở lên
   - Tỷ lệ: 16:9 hoặc tương tự
   - Độ phân giải: Full HD (1920x1080) hoặc cao hơn

5. **Sau khi thêm ảnh:**
   - Ảnh sẽ tự động hiển thị trên trang chủ
   - Nếu muốn đổi tên file, cập nhật đường dẫn trong `src/components/HeroSection.tsx`:
     ```tsx
     src="/images/hero-background.jpg"  // Đổi tên file ở đây
     ```

## Lưu ý:
- File ảnh nên có kích thước hợp lý (< 2MB) để tải nhanh
- Nên sử dụng ảnh có độ phân giải cao để hiển thị đẹp trên màn hình lớn
- Ảnh sẽ được tự động tối ưu bởi Next.js Image component

