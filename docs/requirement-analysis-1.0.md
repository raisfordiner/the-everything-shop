# Store Management System – Requirement Analysis - 1.0

## Initial Application Requirements
Build a comprehensive store management platform for a single-owner retail shop (Product Group X).  
The system must support multiple user roles: **Admin, Seller (Store Owner), Customer, Guest**.  
It must provide complete product lifecycle management from listing, inventory, order processing, to payment completion.  
System must integrate **online and offline payment methods**, support **promotion & return management**, and provide **reporting & analytics** for business intelligence.  

---

## Functional Requirements

### FR1 User Management & Security
- **FR1.1** System must support login functionality using email/phone number and password.  
- **FR1.2** System must encrypt sensitive user information (personal details, payment data).  
- **FR1.3** System must support automatic session timeout for security.  

**User Roles & Permissions**  
- **Customer**: Register, manage profile, browse products, place orders, apply coupons, request returns.  
- **Seller (Store Owner)**: Manage product catalog, inventory, promotions, orders, returns, and view reports.  
- **Admin**: Full access, manage user accounts, approve/reject activities, monitor system logs, generate overall reports.  
- **Guest**: Browse products, but must log in to purchase.  

---

### FR2 Product Management
- **FR2.1** Seller can register products with unique SKU, name, description, price, category, and stock quantity.  
- **FR2.2** System must support multiple product variants (size, color, etc.).  
- **FR2.3** System must allow seller to edit, update, or deactivate products.  
- **FR2.4** System must track product status (active, out-of-stock, discontinued).  
- **FR2.5** System must support product images and media uploads.  

---

### FR3 Category & Inventory Management
- **FR3.1** Products must belong to at least one category (multi-level structure supported).  
- **FR3.2** System must track stock quantity for each SKU and variant.  
- **FR3.3** System must generate low-stock alerts and out-of-stock notifications.  
- **FR3.4** Customers can subscribe for back-in-stock notifications.  

---

### FR4 Order Management
- **FR4.1** Customers can create orders with items, quantity, unit price, discount, shipping fee, and total amount.  
- **FR4.2** System must track order lifecycle: *Created → Confirmed → Processing → Ready to Ship → Delivered → Completed*.  
- **FR4.3** Orders can be cancelled by customer (before processing) or by seller.  
- **FR4.4** Customers can request modification of delivery option before shipping.  
- **FR4.5** System must log all order updates with timestamps.  

---

### FR5 Promotion & Coupon Management
- **FR5.1** Seller can create promotions with code, scope, validity period, and conditions (per product/order/customer).  
- **FR5.2** Customers can apply valid coupons at checkout.  
- **FR5.3** System must validate coupon usage and restrictions.  

---

### FR6 Return & Exchange Management
- **FR6.1** Customers can submit return/exchange requests with reason and product condition.  
- **FR6.2** Seller must approve or reject requests based on return policy.  
- **FR6.3** System must track return process and update inventory if goods are accepted.  
- **FR6.4** Return status must be logged (requested, approved, rejected, completed).  

---

### FR7 Clearance Sale Management
- **FR7.1** Seller can create clearance events for old/overstock items.  
- **FR7.2** Each clearance event must have ID, date, product list, discount rates.  
- **FR7.3** System must record revenue generated from clearance events.  

---

### FR8 Payment Management
- **FR8.1** System must support multiple payment methods: online (VNPay, MoMo, PayPal, etc.) and offline (cash, bank transfer).  
- **FR8.2** Each payment must have unique PaymentID linked to an order.  
- **FR8.3** System must track payment status (pending, paid, refunded).  
- **FR8.4** System must generate transaction receipts.  

---

### FR9 Reporting & Analytics
- **Inventory Reports**: Stock by product, variant, category; low/out-of-stock list.  
- **Order Reports**: By time, status, customer; list of delayed orders; return statistics.  
- **Revenue Reports**: By time period (day/week/month/quarter/year); total revenue – discounts – estimated profit.  
- **Control Reports**: Activity logs, stock audit differences, lost/damaged items.  

---

### FR10 System Administration
- **FR10.1** Admin must manage all user accounts (create, suspend, reactivate).  
- **FR10.2** Admin must monitor data logs and audit trails.  
- **FR10.3** Admin can export reports in CSV, PDF, Excel.  
- **FR10.4** System must comply with data retention and privacy policies.  

