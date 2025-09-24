# Store Management System – Specification (v1.0)

## 1. Introduction
- **Purpose**: A Store Management System for a single-owner retail shop (Product Group X).  
- **Scope**: Support product lifecycle management, user roles, orders, promotions, payments (mock), returns, clearance sales, reporting, and administration.  
- **Tech Stack**:  
  - **Frontend**: React (plain)  
  - **Backend**: Node.js + ExpressJS (REST API)  
  - **Database**: PostgreSQL  
  - **Deployment**: Docker (Homelab + VPS, with HA)  
  - **CI/CD**: GitHub Actions  
  - **Monitoring**: Prometheus + Grafana  

---

## 2. Architecture Overview
- **Architecture Style**: Client–Server, REST API, JWT Authentication.  
- **Frontend**: React SPA, includes admin/seller dashboards.  
- **Backend**: ExpressJS REST API, stateless, JWT + OAuth.  
- **Database**: PostgreSQL relational schema, optimized for simplicity.  
- **Media**: Stored on file system or object storage (DB keeps URLs only).  
- **Payment**: Mock APIs for VNPay, MoMo, PayPal.  

---

## 3. User Roles & Permissions
- **Admin**  
  - Manage users, monitor logs, generate/export reports  
- **Seller (Store Owner)**  
  - Manage products, categories, inventory, promotions, orders, returns, reports  
- **Customer**  
  - Register, manage profile, browse, place orders, apply coupons, request returns  
- **Guest**  
  - Browse only (must log in to purchase)  

---

## 4. Functional Modules

### FR1 – User Management & Security
- JWT-based authentication (login with email/phone + password).  
- OAuth login (Google, Facebook).  
- Automatic session timeout.  
- Role-based access control (Admin, Seller, Customer, Guest).  
- Sensitive data encryption.  

### FR2 – Product Management
- CRUD operations for products.  
- Unique SKU per product.  
- Variants (size, color).  
- Product status: active, out-of-stock, discontinued.  
- Media upload (images/videos → URL stored in DB).  

### FR3 – Category & Inventory
- Multi-level category structure.  
- Stock tracking per SKU/variant.  
- Low-stock/out-of-stock alerts.  
- Back-in-stock notifications for customers.  

### FR4 – Order Management
- Order creation (items, qty, unit price, discount, shipping fee, total).  
- Lifecycle: Created → Confirmed → Processing → Ready to Ship → Delivered → Completed.  
- Cancellation by customer (before processing) or seller.  
- Delivery modification before shipping.  
- Order logs with timestamps.  

### FR5 – Promotion & Coupon
- Seller creates promotions/coupons (code, scope, validity, conditions).  
- Customers apply at checkout.  
- Validation rules enforced.  

### FR6 – Return & Exchange
- Customer requests with reason & condition.  
- Seller approves/rejects.  
- Inventory updates on accepted returns.  
- Status: requested, approved, rejected, completed.  

### FR7 – Clearance Sale
- Seller creates clearance events (ID, date, product list, discount).  
- Revenue recorded per event.  

### FR8 – Payment
- Support multiple methods (VNPay, MoMo, PayPal [mock], Cash, Bank Transfer).  
- PaymentID linked to Order.  
- Status: pending, paid, refunded.  
- Transaction receipts.  

### FR9 – Reporting & Analytics
- Inventory reports (stock, low/out-of-stock).  
- Order reports (by time, status, customer, delayed orders, returns).  
- Revenue reports (by time period, discounts, profit estimation).  
- Control reports (activity logs, audit differences, lost/damaged items).  
- Dashboard (charts/graphs on frontend).  
- Export: CSV, PDF, Excel.  

### FR10 – System Administration
- Admin manages user accounts (create, suspend, reactivate).  
- Data logs & audit trails.  
- Data retention compliance.  

---

## 5. Database Design (Simplified ERD)

### Main Tables
- **Users**(UserID, Role, Email, Phone, PasswordHash, OAuthProvider, Status, CreatedAt)  
- **Products**(ProductID, SKU, Name, Description, CategoryID, Price, Status, CreatedAt, UpdatedAt)  
- **ProductVariants**(VariantID, ProductID, Size, Color, StockQty)  
- **Categories**(CategoryID, ParentID, Name)  
- **Orders**(OrderID, CustomerID, Status, TotalAmount, ShippingFee, CreatedAt, UpdatedAt)  
- **OrderItems**(OrderItemID, OrderID, ProductID, VariantID, Quantity, UnitPrice, Discount)  
- **Payments**(PaymentID, OrderID, Method, Status, Amount, CreatedAt)  
- **Coupons**(CouponID, Code, Scope, ValidFrom, ValidTo, Conditions, UsageLimit)  
- **Returns**(ReturnID, OrderID, ProductID, Reason, Status, CreatedAt)  
- **ClearanceEvents**(ClearanceID, Date, Notes)  
- **ClearanceItems**(ClearanceItemID, ClearanceID, ProductID, DiscountRate, Revenue)  
- **Logs**(LogID, UserID, Action, Timestamp, Details)  

---

## 6. API Specification (REST)

### Auth
- `POST /auth/register`  
- `POST /auth/login`  
- `POST /auth/oauth` (Google/Facebook)  
- `POST /auth/logout`  

### Users
- `GET /users/:id` (Admin only)  
- `PUT /users/:id` (Self or Admin)  
- `DELETE /users/:id` (Admin)  

### Products
- `GET /products`  
- `GET /products/:id`  
- `POST /products` (Seller/Admin)  
- `PUT /products/:id` (Seller/Admin)  
- `DELETE /products/:id` (Seller/Admin)  

### Categories
- `GET /categories`  
- `POST /categories` (Seller/Admin)  

### Orders
- `POST /orders` (Customer)  
- `GET /orders/:id` (Owner/Admin)  
- `PUT /orders/:id/cancel`  
- `PUT /orders/:id/status` (Seller/Admin)  

### Payments
- `POST /payments` (linked to order)  
- `GET /payments/:id`  

### Coupons
- `POST /coupons` (Seller/Admin)  
- `POST /orders/:id/apply-coupon`  

### Returns
- `POST /returns` (Customer)  
- `PUT /returns/:id/status` (Seller/Admin)  

### Clearance
- `POST /clearance` (Seller/Admin)  
- `GET /clearance/:id`  

### Reports
- `GET /reports/inventory`  
- `GET /reports/orders`  
- `GET /reports/revenue`  
- `GET /reports/control`  
- `GET /reports/export?format=csv|pdf|excel`  

---

## 7. Non-Functional Requirements
- **Performance**: Support ~20 concurrent users.  
- **Scalability**: Design with possibility to scale up (multi-shop, larger product base).  
- **Security**: JWT, OAuth, encrypted sensitive data, role-based access.  
- **Monitoring**: Prometheus + Grafana.  
- **CI/CD**: GitHub Actions (build, test, deploy via Docker).  
- **Backup**: TBD (Postgres dump or Docker volume snapshot).  

---

## 8. Deployment & DevOps
- **Docker Compose**: Services for frontend, backend, database, monitoring.  
- **Environment Variables**: Secrets managed via `.env` files or Vault.  
- **CI/CD Pipeline**:  
  - On push → Run tests → Build Docker image → Deploy to Homelab/VPS.  
- **Monitoring**: Prometheus scrapes backend metrics, Grafana dashboards.  

---

