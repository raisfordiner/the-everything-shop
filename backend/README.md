# Order

Routes → Controllers → Service, sử dụng Prisma

# Routes

- Định nghĩa các route
- Route gì sử dụng Controller gì
- Bắt đầu từ `index.js` trước

## Vì sao trong `user.js` định nghĩa route `/` ?

- `index.js` định nghĩa các route trong `user.js` đều bắt đầu bằng `/user`
- Thế nên:
  - `/` → `/user`
  - `/profile` → `/user/profile`
  - `/:id` → `user/:id`

# Controllers

- Xử lý Request và Respond từ các route
- Truyền dữ liệu của Request cho service xử lí

# Service

- Tương tác với Prisma
- Nhớ sử dụng `try/catch` và `ErrorHandler`