The system involves several key actors, each with defined roles and responsibilities:

1. *Guest* (Unregistered User)
  - *Role*: Potential customer exploring the platform.
  - *Capabilities*: Can browse categories, search for products, view product details, and register for an account. Cannot purchase or manage a cart.

2. *Customer* (Registered User)
  - *Role*: End-user purchasing goods.
  - *Capabilities*: Inherits Guest capabilities. Can manage profile, maintain a persistent shopping cart, place orders, make payments (simulated), review order history, and request returns.

3. *Seller* (Vendor)
  - *Role*: Merchant managing their own inventory and sales.
  - *Capabilities*: Create and manage own products, view orders related to their products, update order status (e.g., Shipping), and view basic performance reports.

4. *Administrator* (System Owner)
  - *Role*: Supervisor of the entire platform.
  - *Capabilities*: Full access to all modules. Manages user accounts (ban/un-ban), defines global product categories, oversees all orders, and accesses comprehensive system-wide reports and audit logs.

5. *System Actors* (Automated Services)
  - *Payment Gateway (Mock)*: simulating financial transactions.
  - *Notification Service*: Sending emails (via MailHog) for order confirmations or stock alerts.
  - *Logging Service*: Recording audit trails for security and debugging.
