To ensure the project is achievable within the semester's constraints, we have clearly defined the boundaries of the system.

*Research Scope (What is included):*
- *Business Model*: The system operates on a Business-to-Consumer (B2C) model. A single entity (the "Shop") sells products directly to multiple end-users ("Customers"). Multi-vendor marketplaces (C2C) are out of scope.
- *Core Modules*:
  - *Authentication Module*: Registration, Login, Logout, Password Hashing.
  - *Product Module*: Categories, Product Listings, Inventory counts.
  - *Order Module*: Cart management, Order creation, Order History.
  - *Admin Module*: Administrative interface for content management.
- *Technology Stack*: strictly adhered to the PERN stack (Postgres, Express, React, Node) with Docker for environment orchestration.

*Limitations (What is excluded):*
- *Payment Processing*: The system simulates the checkout process up to the point of "Placing Order". Integration with real-world payment gateways (Stripe, PayPal, VNPay) is simulated or omitted to avoid financial complexity.
- *Advanced Search*: Product search is implemented with basic string matching, lacking features like fuzzy search or relevance ranking.
- *Shipping and Logistics*: Shipping logic is simplified. Real-time shipping rate calculation and tracking integration are not included.
- *Scalability Testing*: While designed with standard practices, the system is not load-tested for high-concurrency production scenarios.
