=== Problem Description
The rapid growth of e-commerce has created a need for versatile platforms that simulate real-world complexities for educational purposes. "The Everything Shop" addresses the challenge of building a full-stack system that integrates multiple distinct modules—User Management, Product Catalog, Ordering, Payment Simulation, and Reporting—into a cohesive unit. The system aims to solve the problem of fragmented learning by providing a unified environment where students can experience the lifecycle of a commercial application, from inventory management by sellers to the checkout process by customers.

=== Business Logic Analysis
The core business flow follows a standard e-commerce cycle:
1. *Product Listing*: Sellers and Admins populate the system with products (UC-14), categorized hierarchically (UC-18).
2. *Product Discovery*: Guests and Customers browse (UC-24) or search (UC-26) for these products.
3. *Order Creation*: A Customer adds items to a cart (UC-29) and proceeds to checkout, creating an Order (UC-30). This process *includes* Payment Initiation (UC-37) and optionally *extends* to Coupon Application (UC-42).
4. *Order Fulfillment*: Sellers manage the order status (UC-32), potentially updating delivery info (UC-35).
5. *Post-Purchase*: Customers can view history (UC-31), request returns (UC-46), or receive notifications for back-in-stock items (UC-23).
6. *Reporting*: The system aggregates this data into reports (UC-51) for business analysis.
