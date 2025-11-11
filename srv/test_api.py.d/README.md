# How to use?

- Bật terminal có bash, wsl, hoặc console trong docker desktop (tức là cái gì cũng được, trừ powershell với cmd ra)
- `cd` vào đây
- Sửa test case trong `tests.json`
- `./run_test.sh`
- Nếu lỗi permission thì `chmod +x run_test.sh` rồi chạy lại

# About `tests.json`

Self-explaining.json (không phải jsonc):

```jsonc
[
  {
    "name": "Tên gì cũng được 1",
    "method": "GET",
    "endpoint": "/api/health",
    "data": null,
    "expected_status": 200,
    "expected_response": {"status": "ok"} // Có thể bỏ qua, cái này nó strict lắm, nên xài rất cay
                                          // Nếu không có key này, sẽ cho test pass dựa trên "expected_status" từ 1xx đến 3xx
  },
  {
    "name": "User Registration",
    "method": "POST",
    "endpoint": "/api/auth/register",
    "data": {
      "username": "testuser",
      "email": "test@example.com",
      "password": "Password123!",
      "password_confirmation": "Password123!"
    },
    "expected_status": 201
  }
]
```

# This script suck, why?

- Tại tôi viết chỉ để mỗi tôi dùng :v
