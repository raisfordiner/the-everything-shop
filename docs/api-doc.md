# API Documentation for Frontend Developers - The Everything Shop

This guide helps frontend developers integrate with the Everything Shop backend API. All requests should include `credentials: 'include'` for cookie-based authentication.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses cookie-based authentication. After login, `accessToken` and `refreshToken` cookies are set. Include `credentials: 'include'` in all requests to authenticated endpoints.

### Register User

- **Method:** POST
- **URL:** `/auth/register`
- **Body:** JSON
  ```json
  {
    "username": "string (6-20 chars, alphanumeric + _-)",
    "email": "string (valid email)",
    "password": "string (8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special)",
    "password_confirmation": "string (must match password)"
  }
  ```
- **Response (200):** User data
- **Errors:** 400 (validation), 500 (server error)

### Login User

- **Method:** POST
- **URL:** `/auth/login`
- **Body:** JSON
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response (200):** User data + sets cookies
- **Errors:** 400 (invalid credentials), 500

### Logout User

- **Method:** POST
- **URL:** `/auth/logout`
- **Auth:** Required (accessToken cookie)
- **Response (200):** Clears cookies
- **Errors:** 401 (unauthorized), 500

### Refresh Token

- **Method:** POST
- **URL:** `/auth/refresh-token`
- **Auth:** Required (refreshToken cookie)
- **Response (200):** Refreshes accessToken cookie
- **Errors:** 401 (invalid token), 500

## User Management

### Get User Info

- **Method:** GET
- **URL:** `/user/info`
- **Auth:** Required
- **Response (200):** User object
- **Errors:** 401, 500

## Products

### Get All Products

- **Method:** GET
- **URL:** `/products`
- **Query Params:** `skip` (int, default 0), `take` (int, default 10), `categoryId` (string), `search` (string), `sellerId` (string)
- **Response (200):** `{ products: [...], pagination: {...} }`
- **Errors:** 500

### Get Product by ID

- **Method:** GET
- **URL:** `/products/:id`
- **Response (200):** Product object
- **Errors:** 404, 500

### Get Products by Category

- **Method:** GET
- **URL:** `/products/category/:categoryId`
- **Query Params:** `skip`, `take`
- **Response (200):** `{ products: [...], pagination: {...} }`
- **Errors:** 500

### Get Products by Seller

- **Method:** GET
- **URL:** `/products/seller/:sellerId`
- **Query Params:** `skip`, `take`
- **Response (200):** `{ products: [...], pagination: {...} }`
- **Errors:** 500

### Create Product (Seller Only)

- **Method:** POST
- **URL:** `/products`
- **Auth:** Required (Seller role)
- **Body:** JSON
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "stockQuantity": "integer",
    "categoryId": "string",
    "images": ["string"],
    "variantTypes": ["string"],
    "variantOptions": "object"
  }
  ```
- **Response (200):** Success message
- **Errors:** 400, 401, 403, 500

### Update Product (Seller Only)

- **Method:** PUT
- **URL:** `/products/:id`
- **Auth:** Required (Seller role, owns product)
- **Body:** JSON (same as create, optional fields)
- **Response (200):** Success message
- **Errors:** 403, 404, 500

### Delete Product (Seller/Admin)

- **Method:** DELETE
- **URL:** `/products/:id`
- **Auth:** Required (Seller owns or Admin)
- **Response (200):** Success message
- **Errors:** 403, 404, 500

## Users (Admin Only)

### Get All Users

- **Method:** GET
- **URL:** `/users`
- **Auth:** Required (Admin)
- **Query Params:** `q` (search), `role` (ADMIN/SELLER/CUSTOMER)
- **Response (200):** `{ users: [...] }`
- **Errors:** 401, 403, 500

### Get User by ID

- **Method:** GET
- **URL:** `/users/:id`
- **Auth:** Required (Admin)
- **Response (200):** User object
- **Errors:** 401, 403, 404, 500

### Create User (Admin Only)

- **Method:** POST
- **URL:** `/users`
- **Auth:** Required (Admin)
- **Body:** JSON
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "ADMIN | SELLER | CUSTOMER"
  }
  ```
- **Response (200):** Success message
- **Errors:** 401, 403, 500

### Update User (Admin Only)

- **Method:** PUT
- **URL:** `/users/:id`
- **Auth:** Required (Admin)
- **Body:** JSON (optional fields)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

### Delete User (Admin Only)

- **Method:** DELETE
- **URL:** `/users/:id`
- **Auth:** Required (Admin)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

## Coupons (Admin Only)

### Get All Coupons

- **Method:** GET
- **URL:** `/coupons`
- **Auth:** Required (Admin/Seller)
- **Query Params:** `q` (code search), `promotionId`
- **Response (200):** `{ coupons: [...] }`
- **Errors:** 401, 403, 500

### Get Coupon by ID

- **Method:** GET
- **URL:** `/coupons/:id`
- **Auth:** Required (Admin/Seller)
- **Response (200):** Coupon object
- **Errors:** 401, 403, 404, 500

### Create Coupon (Admin/Seller)

- **Method:** POST
- **URL:** `/coupons`
- **Auth:** Required (Admin/Seller)
- **Body:** JSON
  ```json
  {
    "promotionId": "string",
    "code": "string",
    "discountPercentage": "number",
    "maxUsage": "integer"
  }
  ```
- **Response (200):** Success message
- **Errors:** 401, 403, 500

### Update Coupon (Admin/Seller)

- **Method:** PUT
- **URL:** `/coupons/:id`
- **Auth:** Required (Admin/Seller)
- **Body:** JSON (optional fields)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

### Delete Coupon (Admin/Seller)

- **Method:** DELETE
- **URL:** `/coupons/:id`
- **Auth:** Required (Admin/Seller)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

## Events (Admin/Seller)

### Get All Events

- **Method:** GET
- **URL:** `/events`
- **Auth:** Required (Admin/Seller)
- **Query Params:** `promotionId`, `clearanceLevel` (HIGH/MEDIUM/LOW)
- **Response (200):** `{ events: [...] }`
- **Errors:** 401, 403, 500

### Get Event by ID

- **Method:** GET
- **URL:** `/events/:id`
- **Auth:** Required (Admin/Seller)
- **Response (200):** Event object
- **Errors:** 401, 403, 404, 500

### Create Event (Admin/Seller)

- **Method:** POST
- **URL:** `/events`
- **Auth:** Required (Admin/Seller)
- **Body:** JSON
  ```json
  {
    "promotionId": "string",
    "clearanceLevel": "HIGH | MEDIUM | LOW"
  }
  ```
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

### Update Event (Admin/Seller)

- **Method:** PUT
- **URL:** `/events/:id`
- **Auth:** Required (Admin/Seller)
- **Body:** JSON (optional clearanceLevel)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

### Delete Event (Admin/Seller)

- **Method:** DELETE
- **URL:** `/events/:id`
- **Auth:** Required (Admin/Seller)
- **Response (200):** Success message
- **Errors:** 401, 403, 404, 500

## Health Check

### Health Endpoint

- **Method:** GET
- **URL:** `/health`
- **Response (200):** `{ status: "ok", timestamp: "ISO string" }`

## Notes for Frontend Implementation

- Always use `fetch` with `credentials: 'include'` for authenticated requests.
- Handle 401 errors by redirecting to login or refreshing token.
- Use query parameters for filtering/pagination.
- Check response `ok` field for success in some endpoints.
- For file uploads (images), additional endpoints may be needed (not documented here).

For full schemas and examples, visit the Swagger UI at `http://localhost:3000/docs`.
