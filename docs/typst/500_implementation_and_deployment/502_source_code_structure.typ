The source code for "The Everything Shop" is organized as a monorepo, containing both the backend API and the frontend client. This structure facilitates easier development and deployment. The root directory contains the `docker-compose.yml` files for orchestration, while the application logic is split into `backend/` and `frontend/` directories.

== Project Tree
The following tree structure represents the actual organization of the source code:

```bash
.
├── backend
│   ├── src
│   │   ├── auth          // Authentication module
│   │   ├── cart          // Shopping cart management
│   │   ├── categories    // Product category management
│   │   ├── config        // Configuration
│   │   ├── coupons       // Discount coupon management
│   │   ├── db            // Database connection and seeding
│   │   ├── middlewares   // Custom Express middlewares
│   │   ├── orders        // Order processing module
│   │   ├── products      // Product catalog management
│   │   ├── users         // User management
│   │   ├── util          // Utilities
│   │   ├── app.ts        // Express app setup
│   │   └── index.ts      // Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   │   ├── assets        // Static assets
│   │   ├── components    // Reusable UI components
│   │   ├── pages         // Page views
│   │   ├── redux         // State management
│   │   ├── services      // API service calls
│   │   ├── utils         // Helper functions
│   │   ├── App.jsx       // Main React component
│   │   └── main.jsx      // React entry point
│   ├── package.json
│   └── vite.config.js
├── docker-compose.dev.yml    // Development orchestration
├── docker-compose.prod.yml   // Production orchestration
└── traefik                   // Reverse proxy configuration
```

== Backend Architecture
The backend adopts a *Feature-Based Architecture*. Instead of grouping files by type (Controllers, Routes, Services), they are grouped by functional module (e.g., `auth`, `products`, `orders`). This ensures that all logic related to a specific feature is co-located, improving maintainability and scalability.

- *Module Structure*: Each module folder (e.g., `src/products`) typically contains:
  - `*.controller.ts`: Handles HTTP requests and responses.
  - `*.service.ts`: Contains business logic and database interactions.
  - `*.route.ts`: Defines API endpoints.
  - `*.schema.ts`: Validation schemas.

== Frontend Architecture
The frontend follows a Component-Based Architecture standard in React applications.
- *`components/`*: Contains atomic and molecule components reused across pages.
- *`pages/`*: Separated by user role (`admin`, `customer`, `seller`) to manage different views effectively.
- *`services/`*: Abstracts API calls, keeping components clean of networking logic.
