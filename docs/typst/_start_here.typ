#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)
#set text(font: "New Computer Modern")

// only first level headings on a new page
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  it
}

#include "cover_page.typ"


= Lời cam đoan
#include "loi_cam_doan.typ"

= Lời cảm ơn
#include "loi_cam_on.typ"

#show outline.entry.where(
  level: 1,
): set block(above: 1.2em)

#outline(title: "Mục lục")

#outline(
  title: "Danh sách các hình ảnh",
  target: figure.where(kind: image),
)

= Tóm tắt đồ án
#include "tom_tat_do_an.typ"

= Vấn đề cần giải quyết
#include "van_de_can_giai_quyet.typ"

= Mục tiêu của hệ thống
#include "muc_tieu_cua_he_thong.typ"

= Giải pháp đề xuất
#include "giai_phap_de_xuat.typ"

= Công nghệ sử dụng
#include "cong_nghe_su_dung.typ"

= Kết quả đạt được
#include "ket_qua_dat_duoc.typ"

#set heading(numbering: "1.")

= GIỚI THIỆU

== Tính cấp thiết của đề tài
#include "tinh_cap_thiet_cua_de_tai.typ"

== Mục tiêu của hệ thống
#include "muc_tieu_cua_he_thong_section.typ"

== Phạm vi nghiên cứu và giới hạn đề tài
#include "pham_vi_nghien_cuu_va_gioi_han_de_tai.typ"

== Đối tượng và phạm vi sử dụng
#include "doi_tuong_va_pham_vi_su_dung.typ"

== Phương pháp thực hiện
#include "phuong_phap_thuc_hien.typ"

== Bố cục báo cáo
#include "bo_cuc_bao_cao.typ"


= CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ

== Cơ sở lý thuyết
#include "co_so_ly_thuyet.typ"

== Tổng quan các công nghệ liên quan
#include "tong_quan_cac_cong_nghe_lien_quan.typ"

== Lý do lựa chọn công nghệ
#include "ly_do_lua_chon_cong_nghe.typ"


= PHÂN TÍCH YÊU CẦU HỆ THỐNG

== Mô tả bài toán và nghiệp vụ
#include "mo_ta_bai_toan_va_nghiep_vu.typ"

== Các bên liên quan (Stakeholders)
#include "cac_ben_lien_quan_stakeholders.typ"

== Yêu cầu chức năng
#include "yeu_cau_chuc_nang.typ"

== Yêu cầu phi chức năng
#include "yeu_cau_phi_chuc_nang.typ"

== Biểu đồ Use Case
#include "bieu_do_use_case.typ"


= THIẾT KẾ HỆ THỐNG

== Thiết kế kiến trúc tổng thể
#include "thiet_ke_kien_truc_tong_the.typ"

== Thiết kế chức năng
#include "thiet_ke_chuc_nang.typ"

== Thiết kế dữ liệu
#include "thiet_ke_du_lieu.typ"

== Thiết kế chi tiết các module
#include "thiet_ke_chi_tiet_cac_module.typ"

== Thiết kế giao diện người dùng (nếu có)
#include "thiet_ke_giao_dien_nguoi_dung_neu_co.typ"


= CÀI ĐẶT VÀ TRIỂN KHAI

== Môi trường phát triển
#include "moi_truong_phat_trien.typ"

== Cấu trúc mã nguồn
#include "cau_truc_ma_nguon.typ"

== Cài đặt các chức năng chính
#include "cai_dat_cac_chuc_nang_chinh.typ"

== Triển khai hệ thống
#include "trien_khai_he_thong.typ"


= KIỂM THỬ VÀ ĐÁNH GIÁ

== Chiến lược kiểm thử
#include "chien_luoc_kiem_thu.typ"

== Xây dựng và thực hiện test case
#include "xay_dung_va_thuc_hien_test_case.typ"

== Đánh giá hệ thống
#include "danh_gia_he_thong.typ"


= KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

== Kết luận
#include "ket_luan.typ"

== Hạn chế của đồ án
#include "han_che_cua_do_an.typ"

== Hướng phát triển trong tương lai
#include "huong_phat_trien_trong_tuong_lai.typ"

= TÀI LIỆU THAM KHẢO
#include "tai_lieu_tham_khao.typ"

= PHỤ LỤC
#include "phu_luc.typ"
