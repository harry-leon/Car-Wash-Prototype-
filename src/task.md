# Admin Console — Update Tasks

## SCOPE CONSTRAINT
- Ưu tiên sửa file trong `src/modules/admin-console/`
- Được phép sửa các file liên quan bên ngoài folder NẾU thực sự cần thiết (ví dụ: shared Zustand store, shared types, router config để thêm route WashPackages)
- Trước khi sửa file ngoài folder, hãy giải thích lý do
- Dùng Zustand store + localStorage persistence (không có real backend)
- Nếu cần tạo shared store, ưu tiên tạo trong `src/store/` hoặc nơi phù hợp với convention của project

---

## TASK 1 — Dashboard: Real-time sync + Pagination cho Recent Bookings

- Dùng Zustand store để Dashboard tự cập nhật khi data thay đổi (reactive, không cần reload)
- Recent Bookings:
  - Hiển thị được cả booking hiện tại lẫn lịch sử
  - Thêm filter theo ngày (date picker)
  - Thêm phân trang (pagination) cho bảng Recent Bookings

---

## TASK 2 — Customers Page: Real-time sync + Pagination

- Dùng Zustand store để danh sách khách hàng tự cập nhật khi có thay đổi
- Thêm phân trang (pagination) cho bảng danh sách khách hàng

---

## TASK 3 — Settings Page: Cập nhật Business Rules

- Thêm business rule mới: **Cancellation Policy**
  - Nếu khách hủy booking quá N lần trong M ngày → tài khoản bị vô hiệu hóa trong K ngày
  - Admin có thể cấu hình N, M, K bằng local state (useState)
- **Xóa** các mục sau khỏi Settings:
  - Supported languages
  - Currency format
  - No-show threshold

---

## TASK 4 — Trang mới: Wash Package Management

- Tạo file: `src/modules/admin-console/pages/WashPackagesPage.tsx`
- Tạo file: `src/modules/admin-console/mock/washPackages.mock.ts`
- Route export: thêm `washPackages: WashPackagesPage` vào `adminRoutes` trong `routes.tsx`
- Chức năng:
  - Hiển thị danh sách gói rửa xe hiện có
  - Thêm gói mới bằng form (Dialog từ shadcn/ui)
  - Sửa / Vô hiệu hóa gói (mock bằng Zustand store)
  - Khi thêm/sửa gói → store cập nhật ngay → user-facing pages có thể subscribe để hiển thị gói mới

---

## TASK 5 — Data Sync: Kiểm tra và đồng bộ toàn bộ dữ liệu

- Rà soát tất cả các trang trong `src/modules/admin-console/pages/`
- Thay thế toàn bộ mock data cứng (hardcoded) bằng dữ liệu từ Zustand store
- Đảm bảo mọi thay đổi (thêm/sửa/xóa) đều được phản ánh ngay trên UI mà không cần reload
- Persist toàn bộ store ra localStorage để data không mất khi reload trang

---