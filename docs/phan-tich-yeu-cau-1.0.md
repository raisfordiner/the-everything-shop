# Hệ thống Quản lý Cửa hàng – Phân tích Yêu cầu - 1.0

## Yêu cầu ứng dụng ban đầu
Xây dựng nền tảng quản lý cửa hàng cho một cửa hàng bán lẻ (Nhóm mặt hàng X).  
Hệ thống hỗ trợ nhiều vai trò người dùng: **Admin, Người bán (Chủ cửa hàng), Khách hàng, Người xem**.  
Hệ thống quản lý toàn bộ vòng đời sản phẩm từ nhập hàng, tồn kho, bán hàng, đơn hàng, thanh toán đến báo cáo.  
Tích hợp **nhiều phương thức thanh toán (online và trực tiếp)**, hỗ trợ **khuyến mãi, đổi trả, thanh lý hàng**, và cung cấp **báo cáo & phân tích kinh doanh**.  

---

## Yêu cầu chức năng (Functional Requirements – FR)

### FR1 Quản lý người dùng & Bảo mật
- **FR1.1** Hệ thống phải hỗ trợ đăng nhập bằng email/số điện thoại và mật khẩu.  
- **FR1.2** Hệ thống phải mã hóa thông tin nhạy cảm (thông tin cá nhân, dữ liệu thanh toán).  
- **FR1.3** Hệ thống phải tự động đăng xuất sau thời gian không hoạt động để bảo mật.  

**Các vai trò người dùng**  
- **Khách hàng**: Đăng ký, quản lý hồ sơ, xem sản phẩm, đặt hàng, áp dụng mã giảm giá, yêu cầu đổi trả.  
- **Người bán (Chủ cửa hàng)**: Quản lý sản phẩm, tồn kho, khuyến mãi, đơn hàng, đổi trả, báo cáo.  
- **Admin**: Toàn quyền, quản lý tài khoản, kiểm duyệt hoạt động, theo dõi nhật ký, xuất báo cáo tổng hợp.  
- **Người xem**: Chỉ xem sản phẩm, muốn mua phải đăng nhập.  

---

### FR2 Quản lý sản phẩm
- **FR2.1** Người bán có thể thêm sản phẩm với mã SKU duy nhất, tên, mô tả, giá, danh mục, số lượng tồn.  
- **FR2.2** Hệ thống hỗ trợ sản phẩm nhiều biến thể (màu, kích thước…).  
- **FR2.3** Người bán có thể chỉnh sửa, cập nhật hoặc ngừng kinh doanh sản phẩm.  
- **FR2.4** Hệ thống phải theo dõi trạng thái sản phẩm (còn hàng, hết hàng, ngừng bán).  
- **FR2.5** Hệ thống hỗ trợ tải ảnh và video giới thiệu cho sản phẩm.  

---

### FR3 Quản lý danh mục & tồn kho
- **FR3.1** Mỗi sản phẩm phải thuộc ít nhất một danh mục.
- **FR3.2** Hệ thống theo dõi tồn kho theo từng SKU và biến thể.  
- **FR3.3** Hệ thống cảnh báo khi hàng sắp hết hoặc hết.  
- **FR3.4** Khách hàng có thể đăng ký nhận thông báo khi có hàng trở lại.  

---

### FR4 Quản lý đơn hàng
- **FR4.1** Khách hàng tạo đơn hàng gồm sản phẩm, số lượng, giá, giảm giá, phí ship, tổng tiền.  
- **FR4.2** Hệ thống theo dõi vòng đời đơn hàng: *Mới tạo → Xác nhận → Chuẩn bị → Sẵn sàng giao → Giao hàng → Hoàn tất*.  
- **FR4.3** Đơn có thể hủy bởi khách (trước khi xử lý) hoặc bởi người bán.  
- **FR4.4** Khách hàng có thể thay đổi phương thức nhận hàng trước khi giao.  
- **FR4.5** Hệ thống ghi lại toàn bộ lịch sử thay đổi đơn hàng kèm thời gian.  

---

### FR5 Quản lý khuyến mãi & mã giảm giá
- **FR5.1** Người bán có thể tạo chương trình khuyến mãi với mã, phạm vi áp dụng, thời gian hiệu lực, điều kiện.  
- **FR5.2** Khách hàng có thể nhập mã giảm giá khi thanh toán.  
- **FR5.3** Hệ thống kiểm tra và xác thực điều kiện sử dụng mã giảm giá.  

---

### FR6 Quản lý đổi trả
- **FR6.1** Khách hàng gửi yêu cầu đổi/ trả hàng với lý do và tình trạng sản phẩm.  
- **FR6.2** Người bán duyệt hoặc từ chối theo chính sách đổi trả.  
- **FR6.3** Hệ thống cập nhật tồn kho khi hàng đổi/ trả hợp lệ.  
- **FR6.4** Hệ thống lưu trạng thái đổi trả (đã yêu cầu, chấp nhận, từ chối, hoàn tất).  

---

### FR7 Quản lý thanh lý hàng
- **FR7.1** Người bán có thể lập các đợt thanh lý cho hàng tồn lâu hoặc cần xả kho.  
- **FR7.2** Mỗi đợt có mã định danh, ngày thực hiện, danh sách hàng và mức chiết khấu.  
- **FR7.3** Hệ thống lưu doanh thu thu được từ các đợt thanh lý.  

---

### FR8 Quản lý thanh toán
- **FR8.1** Hệ thống hỗ trợ nhiều phương thức thanh toán: online (VNPay, MoMo, PayPal…) và truyền thống (tiền mặt, chuyển khoản).  
- **FR8.2** Mỗi giao dịch thanh toán có PaymentID liên kết với đơn hàng.  
- **FR8.3** Hệ thống theo dõi trạng thái thanh toán (chờ xử lý, đã thanh toán, đã hoàn tiền).  
- **FR8.4** Hệ thống sinh biên lai giao dịch.  

---

### FR9 Báo cáo & phân tích
- **Báo cáo tồn kho**: theo sản phẩm, biến thể, danh mục; danh sách hàng sắp hết, hết, hỏng.  
- **Báo cáo đơn hàng**: theo thời gian, trạng thái, khách hàng; đơn chậm xử lý; thống kê đổi trả.  
- **Báo cáo doanh thu**: theo ngày/tuần/tháng/quý/năm; tổng doanh thu – chiết khấu – lợi nhuận ước tính.  
- **Báo cáo kiểm soát**: nhật ký cập nhật dữ liệu, chênh lệch kiểm kê, hàng mất/hỏng.  

---

### FR10 Quản trị hệ thống
- **FR10.1** Admin quản lý tài khoản (tạo, khóa, mở lại).  
- **FR10.2** Admin theo dõi nhật ký hệ thống, audit trail.  
- **FR10.3** Admin xuất báo cáo ra CSV, PDF, Excel.  
- **FR10.4** Hệ thống tuân thủ chính sách lưu trữ và bảo mật dữ liệu.  

