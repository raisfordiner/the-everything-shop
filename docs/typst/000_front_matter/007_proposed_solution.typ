To achieve the stated objectives, we propose a web-based "Online Shop Management Software" built on a **Monolithic MVC Architecture**.

While microservices are popular for large-scale systems, a monolithic approach is selected here to focus on:
- **Simplicity**: Easier to develop, debug, and deploy as a single unit or closely coupled services.
- **Data Integrity**: Unified database simplifies transaction management and data consistency.
- **Learning Curve**: Ideal for understanding the fundamental request-response cycle and full-stack flow.

The solution consists of:
1. **Presentation Layer (View)**: A React Single Page Application (SPA) that provides a dynamic and responsive user interface.
2. **Logic Layer (Controller)**: A Node.js/Express server that handles API requests, processes business logic, and interacts with the database.
3. **Data Layer (Model)**: A PostgreSQL database accessed via Prisma ORM for structured data storage.
