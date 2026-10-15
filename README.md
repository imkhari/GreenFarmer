# 🌿 GreenFarmer Web - Nền tảng TMĐT Nông sản Sạch & Truy xuất nguồn gốc

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/VNPay-Sandbox-005BAA?style=for-the-badge&logo=vnpay&logoColor=white" alt="VNPay" />
</p>

---

## 📖 Tổng quan dự án

**GreenFarmer Frontend** là giao diện người dùng (Single Page Application - SPA) hiện đại, trực quan, được xây dựng với **React 19**, **Vite** và **Tailwind CSS v4**. Dự án đóng vai trò cầu nối thông tin giữa các bên tham gia chuỗi cung ứng nông sản: từ Nông trại sản xuất, Người tiêu dùng cho đến Quản trị viên sàn thương mại điện tử.

Hệ thống giải quyết bài toán cốt lõi: **"Minh bạch hóa nguồn gốc nông sản"** bằng cách liên kết chặt chẽ giữa thương mại điện tử và truy xuất nhật ký canh tác thực tế.

---

## ✨ Tính năng nổi bật theo phân hệ

### 1. Phân hệ Người tiêu dùng (Buyer)
* **Khám phá nông sản:** Duyệt danh mục rau củ quả theo mùa, lọc theo tiêu chuẩn chất lượng (VietGAP, GlobalGAP, Organic).
* **Truy xuất nguồn gốc bằng Camera thực tế:** Tích hợp bộ quét mã QR trực tiếp qua camera máy tính/điện thoại (`html5-qrcode`) để tra cứu nguồn gốc và nhật ký canh tác của lô hàng.
* **Quy trình Mua hàng & Thanh toán:** Giỏ hàng, địa chỉ giao hàng, tích hợp cổng thanh toán trực tuyến **VNPay Sandbox**.
* **Đánh giá & Phản hồi (Review Loop):** Modal đánh giá chất lượng sản phẩm (1-5 sao kèm nhận xét) ngay sau khi nhận hàng thành công (`Completed`).

### 2. Phân hệ Nông dân / Người bán (Seller)
* **Quản lý Nông trại:** Cập nhật thông tin vùng trồng, diện tích, phương pháp canh tác và tọa độ vị trí.
* **Quản lý Lô hàng & Nhật ký canh tác:** Tạo lô hàng mới, ghi lại các hoạt động chăm sóc (bón phân, tưới nước, phun thuốc sinh học, thu hoạch).
* **In tem nhãn QR dán bao bì (Sticker Studio):**
  * Thiết kế tem decal chuẩn kích thước dán bao bì nông sản (**95 × 55 mm**).
  * Hiển thị đầy đủ thông tin: Logo GreenFarmer, QR Code truy xuất, Tên sản phẩm, Tên trang trại, Ngày thu hoạch, Tiêu chuẩn VietGAP.
  * Tự động dàn trang in khổ A4 (lưới 2x2 tem / trang) với CSS in ấn chuyên dụng (`@media print`).
  * Xuất ảnh tem nhãn độ phân giải cao **Retina 2x (760 × 440 px PNG)** bằng HTML5 Canvas để gửi xưởng in.

### 3. Phân hệ Quản trị viên (Admin)
* **Kiểm duyệt chất lượng:** Duyệt đăng ký nông trại mới, thẩm định nhật ký canh tác và phê duyệt cấp mã barcode/QR cho các lô hàng.
* **Thống kê & Báo cáo:** Theo dõi biểu đồ doanh thu, số lượng đơn hàng, lượng nông sản tiêu thụ qua [Recharts](https://recharts.org/).

---

## 🛠️ Công nghệ sử dụng (Frontend Stack)

* **Core:** React 19, TypeScript 6.0, Vite 8 (Tốc độ khởi động và HMR cực nhanh).
* **Styling & UI:** Tailwind CSS v4, Lucide React (Bộ icon vector chuẩn), clsx, tailwind-merge.
* **Mã vạch & QR Code:** `qrcode.react` (Sinh mã vector SVG/Canvas), `html5-qrcode` (Quét mã qua Camera).
* **Quản lý biểu mẫu:** `react-hook-form` kết hợp `zod` xác thực dữ liệu.
* **Điều hướng & Định tuyến:** `react-router-dom` v7 với cấu trúc Route bảo vệ theo Role (Guard).
* **HTTP Client:** `axios` với Interceptor xử lý Bearer Token tự động.

---

## 📂 Cấu trúc thư mục (Source Architecture)

```text
greenFarmFE/
├── src/
│   ├── components/         # Các thành phần giao diện tái sử dụng
│   │   ├── common/         # ReviewModal, PrintStickerModal, TrustBadge, CameraScanner...
│   │   ├── layout/         # Header, Footer, Sidebar, Navigation bar
│   │   └── ui/             # Button, Input, Modal, Dropdown base components
│   ├── pages/              # Các màn hình chức năng chính
│   │   ├── admin/          # Quản lý người dùng, duyệt nông trại & lô hàng
│   │   ├── seller/         # Quản lý lô hàng, nhật ký canh tác, in tem QR
│   │   ├── buyer/          # Giỏ hàng, lịch sử đơn hàng, trang cá nhân
│   │   └── public/         # Trang chủ, chi tiết sản phẩm, chi tiết đơn hàng, truy xuất QR
│   ├── services/           # Gọi API backend (auth, product, batch, order, review)
│   ├── types/              # Định nghĩa kiểu dữ liệu TypeScript (User, Order, Batch...)
│   ├── lib/                # Utilities, cấu hình Axios, hàm định dạng ngày tháng, tiền tệ
│   ├── App.tsx             # Định tuyến ứng dụng (App Router)
│   └── main.tsx            # Điểm khởi tạo ứng dụng React DOM
├── index.html              # HTML template chính
├── tsconfig.app.json       # Cấu hình TypeScript Bundler
├── vite.config.ts          # Cấu hình Vite & Tailwind v4
└── README.md               # Tài liệu dự án
```

---

## ⚙️ Cài đặt & Khởi chạy ứng dụng

### 1. Yêu cầu hệ thống
* **Node.js:** Phiên bản >= 20.x (Khuyến nghị **Node v22.x**).
* **Backend:** Khởi chạy `greenFarmBE` tại cổng `http://localhost:3000`.

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Khởi chạy máy chủ phát triển
```bash
# Chạy Frontend ở chế độ dev
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:5173`

### 4. Kiểm tra Build Production
```bash
npm run build
```
*(Đã tối ưu hóa biên dịch không lỗi TypeScript - thời gian build ~500ms).*

---

## 👨‍💻 Thông tin Tác giả & Đồ án

* **Sinh viên:** Lê Tuấn Khải
* **Lớp:** 23KIT - Khoa Kỹ thuật Máy tính & Điện tử - Trường CNTT & TT Việt - Hàn (**VKU**)
* **Đơn vị thực tập:** **FPT Software DaNang**
* **Đề tài:** GreenFarmer - Nền tảng TMĐT Nông sản Sạch & Truy xuất Nguồn gốc Canh tác
