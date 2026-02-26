To achieve the stated objectives, we propose a web-based "Online Shop Management Software" built on a *Monolithic MVC Architecture*.
This approach centralizes business logic and data access, offering the following advantages for this academic context:

- *Simplicity*: Easier to develop, debug, and deploy as a single unit or closely coupled services.
- *Data Integrity*: Unified database simplifies transaction management and data consistency.
- *Learning Curve*: Ideal for understanding the fundamental request-response cycle and full-stack flow.

The solution comprises three distinct layers:
1. *Presentation Layer (View)*: A React Single Page Application (SPA) that provides a dynamic and responsive user interface.
2. *Logic Layer (Controller)*: A Node.js/Express server that handles API requests, processes business logic, and interacts with the database.
3. *Data Layer (Model)*: A PostgreSQL database accessed via Prisma ORM for structured data storage.
