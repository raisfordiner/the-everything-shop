=== Overall Architecture Design

The system follows a classic *3-Tier Architecture*, ensuring separation of concerns, scalability, and maintainability.

==== Presentation Layer (Frontend)
- *Technology*: React (Vite), Redux.
- *Responsibility*: Handles user interactions, renders UI components, and communicates with the backend via RESTful APIs.
- *Key Components*:
  - *Client App*: Single Page Application (SPA) served to the user's browser.
  - *Admin/Seller Dashboard*: Dedicated interfaces for privileged users.

==== Application Layer (Backend)
- *Technology*: Node.js, Express.js.
- *Responsibility*: Processes business logic, handles API requests, enforces security (Authentication/Authorization), and interacts with the database.
- *Key Components*:
  - *API Server*: Exposes REST endpoints.
  - *Middleware*: Handles logging, error handling, and authentication (JWT).
  - *Modules*: Auth, Product, Order, Payment, etc.

==== Data Layer (Database)
- *Technology*: PostgreSQL (Relational Database).
- *Responsibility*: Persists application data including users, products, orders, and transactions.
- *ORM*: Prisma is used for type-safe database access and schema management.

#figure(
  image("/docs/diagrams/architecture/svg/architecture.svg", width: 90%),
  caption: [System Architecture Diagram],
)
