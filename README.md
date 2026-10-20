# GreenFarmer Web Client

> Giao diện người dùng cho nền tảng Thương mại Điện tử Nông sản & Truy xuất Nguồn gốc Canh tác.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## Tổng quan

GreenFarmer Web Client là ứng dụng Single Page Application (SPA) hiện đại, đóng vai trò giao diện tương tác giữa Người tiêu dùng (Buyer), Nông dân (Seller) và Quản trị viên (Admin). Ứng dụng tập trung vào trải nghiệm người dùng tối giản, tốc độ phản hồi cao và liên kết chặt chẽ giữa thương mại điện tử với truy xuất nguồn gốc nông sản thực địa.

## Phân hệ Chức năng

### 1. Phân hệ Người tiêu dùng (Buyer)
- **Thương mại điện tử:** Khám phá danh mục nông sản theo mùa vụ, lọc theo tiêu chuẩn canh tác (VietGAP, GlobalGAP, Hữu cơ).
- **Truy xuất trực tiếp bằng Camera:** Tích hợp bộ quét camera phần cứng (`html5-qrcode`) để tra cứu tức thì thông tin nông trại và timeline nhật ký canh tác của lô hàng.
- **Thanh toán đa cổng:** Hỗ trợ thanh toán linh hoạt qua 4 phương thức:
  - Thanh toán khi nhận hàng (COD).
  - Cổng VNPay Sandbox (ATM nội địa, thẻ quốc tế, VNPAY-QR).
  - Ví điện tử MoMo Sandbox.
  - Ví điện tử ZaloPay Sandbox.
- **Đánh giá sau nhận hàng:** Giao diện chấm điểm chất lượng 5 sao và nhận xét chi tiết sau khi đơn hàng hoàn tất.

### 2. Phân hệ Nông dân / Nhà sản xuất (Seller)
- **Quản lý Nông trại & Lô hàng:** Khởi tạo lô hàng, đồng bộ danh mục và cập nhật nhật ký canh tác định kỳ theo thời gian thực.
- **Studio In Tem nhãn Bao bì (Print Sticker):**
  - Định dạng chuẩn nhãn decal dán hộp bao bì (95 × 55 mm).
  - Dàn trang in khổ giấy A4 (lưới 2 × 2) tương thích máy in văn phòng và máy in tem nhiệt.
  - Xuất ảnh tem nhãn chuẩn Retina 2x (760 × 440 px PNG) bằng HTML5 Canvas để gửi cơ sở in ấn bao bì.

### 3. Phân hệ Quản trị viên (Admin)
- Thẩm định hồ sơ nông trại mới và kiểm duyệt nhật ký canh tác của từng lô hàng trước khi mở bán.
- Cấp mã định danh Barcode/QR Code và gán nhãn mức độ tin cậy (`trust_level`).
- Báo cáo phân tích doanh thu và sản lượng tiêu thụ qua biểu đồ Recharts.

## Kiến trúc Công nghệ

| Công nghệ | Vai trò |
| :--- | :--- |
| React 19 | Thư viện xây dựng giao diện người dùng dựa trên Component |
| TypeScript 6 | Kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt trên toàn bộ mã nguồn |
| Vite 8 | Công cụ đóng gói (Bundler) với Hot Module Replacement (HMR) tức thì |
| Tailwind CSS v4 | Khung thiết kế giao diện theo Utility-First CSS hiện đại |
| Lucide React | Hệ thống biểu tượng vector tinh gọn, tối giản |
| qrcode.react & html5-qrcode | Tạo mã QR vector và quét mã qua camera thiết bị |
| Axios | Xử lý HTTP Client với interceptor quản lý JWT token |

## Cấu trúc Thư mục

```text
src/
├── components/     # Thành phần giao diện dùng chung (Modals, Badges, Layouts)
│   ├── common/     # PrintStickerModal, ReviewModal, QRScannerModal...
│   ├── layout/     # Header, Sidebar, Footer, Navigation
│   └── ui/         # Các thành phần giao diện cơ sở
├── pages/          # Các trang chức năng theo phân quyền
│   ├── admin/      # Quản trị duyệt nông trại, lô hàng, báo cáo
│   ├── seller/     # Quản lý lô hàng, in tem QR, nhật ký nông vụ
│   ├── buyer/      # Giỏ hàng, lịch sử đơn hàng, thanh toán
│   └── public/     # Trang chủ, chi tiết sản phẩm, tra cứu nguồn gốc
├── services/       # Lớp tương tác RESTful API với backend
├── types/          # Định nghĩa kiểu dữ liệu TypeScript (User, Order, Batch...)
├── lib/            # Tiện ích định dạng ngày tháng, tiền tệ, cấu hình axios
├── routes/         # Cấu hình bộ định tuyến và Route Guards
├── App.tsx         # Thành phần gốc ứng dụng
└── main.tsx        # Điểm gắn kết React DOM
```

## Cài đặt & Khởi chạy

### Yêu cầu môi trường
- Node.js >= 20.x (Khuyến nghị Node.js v22.x)
- Backend GreenFarmer đang chạy tại `http://localhost:3000`

### Hướng dẫn chạy

```bash
# Cài đặt thư viện
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Kiểm tra biên dịch Production
npm run build
```

Ứng dụng khởi chạy mặc định tại: `http://localhost:5173`

## Thông tin Dự án

- **Tác giả:** Lê Tuấn Khải
- **Lớp:** 23KIT - Trường CNTT & TT Việt - Hàn (VKU) - Đại học Đà Nẵng
- **Đơn vị thực tập:** FPT Software DaNang
- **Đề tài:** GreenFarmer - Nền tảng TMĐT Nông sản & Truy xuất Nguồn gốc Canh tác
