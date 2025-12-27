This section details the specific test cases designed to validate the system's functionality.

=== Authentication Module Tests

- *TC-01: Verify User Registration with valid data*
  - *Input Data*: Name: "John", Email: "test\@mail.com", Pass: "123456"
  - *Expected Result*: Account created, redirect to Login
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-02: Verify Registration with duplicate email*
  - *Input Data*: Email: "test\@example.com" (existing)
  - *Expected Result*: Error: "Email already exists"
  - *Actual Result*: Error: "User exists"
  - *Status*: Pass

- *TC-03: Verify Login with valid credentials*
  - *Input Data*: Email: "test\@example.com", Pass: "123456"
  - *Expected Result*: JWT Token received, Redirected to Home page
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-04: Verify Login with invalid password*
  - *Input Data*: Email: "test\@example.com", Pass: "wrong"
  - *Expected Result*: Error: "Invalid credentials"
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-05: Verify Logout*
  - *Input Data*: Click "Logout" button
  - *Expected Result*: Session cleared, redirect to Home
  - *Actual Result*: As Expected
  - *Status*: Pass

=== Product Module Tests

- *TC-06: Admin creates product with valid data*
  - *Input Data*: Name: "Laptop", Price: 999, Stock: 10
  - *Expected Result*: Product added to catalog
  - *Actual Result*: As Expected
  - *Status*: Pass


- *TC-07: Verify Negative Price input*
  - *Input Data*: Price: -100
  - *Expected Result*: Validation Error: "Price must be positive"
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-08: Delete Product*
  - *Input Data*: Select Product -> Delete
  - *Expected Result*: Product removed from list
  - *Actual Result*: As Expected
  - *Status*: Pass

=== Ordering & Checkout Tests

- *TC-09: Add Item to Cart*
  - *Input Data*: Select "Laptop", Qty: 1
  - *Expected Result*: Cart Icon count +1
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-10: Add quantity exceeding stock*
  - *Input Data*: Stock: 10, Request: 11
  - *Expected Result*: Error: "Insufficient stock"
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-11: Calculate Cart Total*
  - *Input Data*: Item A (\$10) + Item B (\$20)
  - *Expected Result*: Total: \$30
  - *Actual Result*: Total:\$30
  - *Status*: Pass

- *TC-12: Complete Checkout*
  - *Input Data*: Confirm Payment -> Submit
  - *Expected Result*: Order #123 created, Cart cleared
  - *Actual Result*: As Expected
  - *Status*: Pass

- *TC-13: Verify Stock Deduction*
  - *Input Data*: Checkout 1 "Laptop"
  - *Expected Result*: Stock reduces by 1
  - *Actual Result*: As Expected
  - *Status*: Pass

=== Security & Permissions Tests

- *TC-14: Customer accessing Admin Page*
  - *Input Data*: Navigate to `/admin/dashboard`
  - *Expected Result*: Redirect to Home / 403 Forbidden
  - *Actual Result*: Redirected
  - *Status*: Pass

- *TC-15: SQL Injection on Login*
  - *Input Data*: Email: `' OR '1'='1`
  - *Expected Result*: Login Failed (Sanitized)
  - *Actual Result*: Safe
  - *Status*: Pass

- *TC-16: Access Protected API without Token*
  - *Input Data*: GET `/api/orders`
  - *Expected Result*: 401 Unauthorized
  - *Actual Result*: As Expected
  - *Status*: Pass
