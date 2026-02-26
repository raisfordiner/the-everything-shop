=== Functional Design and Module Details

The system is decomposed into core functional modules. Each module is documented with its responsibilities, key features, and detailed sequence diagrams illustrating critical workflows.

==== Authentication Module
- *Responsibilities*: Handles user registration, login, logout, and token management.
- *Key Features*:
  - Email/Password login.
  - JWT generation and refreshing (Access/Refresh tokens).
  - Role-Based Access Control (RBAC).

*Detailed Flows:*

1. *Registration*: User provides credentials -> Hashed (bcrypt) -> Stored in DB.
2. *Login*: User validates credentials -> Server issues JWTs.
3. *Access Control*: Middleware checks JWT in headers.

#figure(
  image("../../diagrams/sequences/svg/auth_registration.svg", width: 100%),
  caption: [Registration Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_login.svg", width: 100%),
  caption: [Login Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_verify_email.svg", width: 100%),
  caption: [Verify Email Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_forgot_password.svg", width: 100%),
  caption: [Forgot Password Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_reset_password.svg", width: 100%),
  caption: [Reset Password Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_refresh_token.svg", width: 100%),
  caption: [Token Refresh Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/auth_logout.svg", width: 100%),
  caption: [Logout Sequence],
)

==== Product Management Module
- *Responsibilities*: Manages catalog, categories, and inventory.
- *Key Features*: CRUD operations, Image upload, Stock alerts.

#figure(
  image("../../diagrams/sequences/svg/product_create.svg", width: 100%),
  caption: [Create Product Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/product_search.svg", width: 100%),
  caption: [Search & Filter Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/product_stock.svg", width: 100%),
  caption: [Update Stock Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/product_get_detail.svg", width: 100%),
  caption: [Get Product Detail Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/product_delete.svg", width: 100%),
  caption: [Delete Product Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/product_get_seller_products.svg", width: 100%),
  caption: [Get Seller Products Sequence],
)

==== Order Management Module
- *Responsibilities*: Lifecycle from cart to delivery.
- *Key Features*: Cart management, Order placement, Status tracking.

#figure(
  image("../../diagrams/sequences/svg/order_add_to_cart.svg", width: 100%),
  caption: [Add to Cart Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_view_cart.svg", width: 100%),
  caption: [View Cart Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_update_cart_item.svg", width: 100%),
  caption: [Update Cart Item Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_remove_from_cart.svg", width: 100%),
  caption: [Remove from Cart Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_checkout.svg", width: 100%),
  caption: [Order Checkout Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_history.svg", width: 100%),
  caption: [Order History Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_detail.svg", width: 100%),
  caption: [Order Detail Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_update_status.svg", width: 100%),
  caption: [Update Order Status Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/order_cancel.svg", width: 100%),
  caption: [Cancel Order Sequence],
)

==== Payment Module
- *Responsibilities*: Handling transactions and integrations.
- *Key Features*: Multiple methods (COD, VNPay), Secure callbacks.

#figure(
  image("../../diagrams/sequences/svg/payment_initiate.svg", width: 100%),
  caption: [Payment Initiation Sequence],
)

==== Promotion Module
- *Responsibilities*: Discount and coupon management.
- *Key Features*: Flash sales, Coupon codes.

#figure(
  image("../../diagrams/sequences/svg/promo_create.svg", width: 100%),
  caption: [Create Promotion Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/promo_create_coupon.svg", width: 100%),
  caption: [Create Coupon Sequence],
)

#figure(
  image("../../diagrams/sequences/svg/promo_list.svg", width: 100%),
  caption: [List Promotions Sequence],
)

==== Reporting & Analytics Module
- *Responsibilities*: Insights for admins and sellers.
- *Key Features*: Sales charts, User growth, Top products.

#figure(
  image("../../diagrams/sequences/svg/report_sales.svg", width: 100%),
  caption: [Sales Report Sequence],
)
