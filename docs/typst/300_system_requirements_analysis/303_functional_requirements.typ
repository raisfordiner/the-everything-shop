The functional requirements are categorized by module, derived from the use case analysis.

=== User Management (EP-01)
- *UC-01 Register*: Allow guests to create accounts.
- *UC-02 Login*: Authenticate via Email/Password.
- *UC-08 RBAC*: Enforce strict role checks (Admin vs Seller vs Customer).
- *UC-11 View Users*: Admins can list and manage all user accounts.

=== Product Management (EP-02)
- *UC-14 Create Product*: Sellers can add new items. *Includes* Media Upload (UC-17) for product images.
- *UC-18 Categories*: Admins define multi-level category trees.
- *UC-22 Stock Alerts*: System notifies sellers when stock is low.

=== Shopping & Ordering (EP-03, EP-04)
- *UC-24 Browse*: Users can filter products by category or attributes.
- *UC-30 Create Order*: Customers convert cart to order. *Includes* Payment (UC-37). *Extended by* Coupon Application (UC-42).
- *UC-32 Manage Order*: Sellers update status (Pending -> Delivering -> Delivered).

=== Promotions & Returns (EP-06, EP-07)
- *UC-41 Coupons*: Sellers create validation rules for discounts.
- *UC-46 Returns*: Customers can request refunds for delivered items.

=== Reporting (EP-08)
- *UC-54 Dashboard*: Visual summary of sales.
- *UC-53 Export*: *Extends* report generation to allow downloading CSV/PDF.
