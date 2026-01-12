#import "@preview/diatypst:0.8.0": *

#show: slides.with(
  title: "The Everything Shop",
  subtitle: "SE100 - Object-Oriented Analysis and Design",
  date: datetime.today().display(),
  authors: "Nhóm 2",

  ratio: 4 / 3,
  layout: "small",
  title-color: navy,
  toc: true,
  theme: "full",
  count: "number",
)

= Tổng quan đề tài
*Giới thiệu:*
- Trang web thương mại điện tử

*Vấn đề giải quyết:*
- Hiểu kiến trúc ứng dụng web, quản lý trạng thái, mô hình CSDL quan hệ
- Nắm vững mẫu thiết kế cốt lõi thay vì dùng công cụ có sẵn

*Mục tiêu chính:*
- Quản lý sản phẩm, user authentication (JWT)
- Trải nghiệm mua sắm: duyệt, giỏ hàng, thanh toán
- Tích hợp full-stack (React + Express + PostgreSQL)

= Kiến trúc & Công nghệ
*Kiến trúc 3 tầng (MVC):*
- *Tầng View*: React SPA + Redux
- *Tầng Controller*: Node.js/Express API
- *Tầng Model*: PostgreSQL + Prisma ORM

*Stack công nghệ (PERN):*
- *Frontend*: React, Redux
- *Backend*: Node.js, Express, TypeScript, Prisma, JWT
- *Infrastructure*: PostgreSQL, Docker

#pagebreak()

#figure(
  image("/docs/diagrams/architecture/svg/architecture.svg", height: 100%),
)



= Actors & Chức năng
*4 Actor chính:*
1. *Guest*: Duyệt/tìm sản phẩm, đăng ký
2. *Customer*: Quản lý giỏ hàng, đặt hàng, lịch sử đơn
3. *Seller*: Tạo/quản lý sản phẩm, cập nhật đơn hàng
4. *Admin*: Quản lý user/danh mục, báo cáo hệ thống

*Chức năng:*
- User: Đăng ký/đăng nhập
- Sản phẩm: CRUD
- Đặt hàng: Duyệt/lọc, cart → order, thanh toán, coupon
- Khác: Trả hàng, dashboard, báo cáo


#figure(
  image("/docs/diagrams/usecases/svg/01_account_session.svg", height: 90%),
  caption: [Epic 01: Account & Session],
)

#figure(
  image("/docs/diagrams/usecases/svg/02_product_management.svg", height: 90%),
  caption: [Epic 02: Product Management],
)

#figure(
  image("/docs/diagrams/usecases/svg/03_browsing_searching.svg", height: 90%),
  caption: [Epic 03: Browsing & Searching],
)

#figure(
  image("/docs/diagrams/usecases/svg/04_order_management.svg", height: 90%),
  caption: [Epic 04: Order Management],
)

#figure(
  image("/docs/diagrams/usecases/svg/05_payment.svg", height: 90%),
  caption: [Epic 05: Payment],
)

#figure(
  image("/docs/diagrams/usecases/svg/06_promotions.svg", width: 100%),
  caption: [Epic 06: Promotions],
)

#figure(
  image("/docs/diagrams/usecases/svg/07_returns.svg", width: 100%),
  caption: [Epic 07: Returns],
)

#figure(
  image("/docs/diagrams/usecases/svg/08_reporting.svg", height: 90%),
  caption: [Epic 08: Reporting],
)


= Kết quả & Demo
*Đã triển khai:*
- ✓ Trang web E-Commerce hoàn chỉnh với luồng MVC đầy đủ
- ✓ Docker hóa: App + DB + Mailhog + MinIO
- ✓ Đăng ký/đăng nhập/mua hàng hoạt động
- ✓ Phân quyền truy cập các tính năng

*Giá trị đạt được:*
- Thành thạo PERN stack
- Áp dụng design patterns
- Bảo mật với JWT
- Hiểu quan hệ đối tượng thực tế

= Hạn chế & Bài học
*Hạn chế:*
- Danh mục cứng nhắc, quản lý kho đơn giản
- Không có cổng thanh toán/vận chuyển thật
- Frontend chậm, lỗi chung chung
- On-premise, khả năng phục hồi thấp

*Bài học:*
- Kĩ thuật tách thành MVC, đề cao type safety
- Thách thức: kết nối frontend-backend, quản lý state ở frontend
- Docker đảm bảo môi trường nhất quán
- Prisma đơn giản hóa thao tác với DB

*Hướng phát triển:* chia nhỏ tiểu dịch vụ, cổng thanh toán thật, tối ưu hiệu suất, triển khai lên cloud bằng VPS.
