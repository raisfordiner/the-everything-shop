The project followed a modified Waterfall methodology, adapted for a small team with a fixed deadline. The development lifecycle was divided into distinct phases:

1. *Analysis Phase*:
  - Requirement Gathering: Listing core features (Login, Product, Cart).
  - Use Case Modeling: Identifying actors (Admin, User) and their interactions.
2. *Design Phase*:
  - *Database Schema*: Designing the Entity-Relationship Diagram (ERD) for Postgres, defining tables for `User`, `Product`, `Order`, `OrderItem`.
  - *API Contract*: Defining RESTful endpoints (e.g., `GET /api/products`, `POST /api/cart`).
  - *Wireframing*: Creating basic UI layouts for the React frontend.
3. *Implementation Phase*:
  - *Backend First*: Built the Express server, Prisma models, and core logic. Tested via Postman.
  - *Frontend Integration*: Built React components to consume the API.
  - *Containerization*: Added Dockerfiles to ensure the app runs identically on all developer machines.
4. *Testing Phase*:
  - *Unit Testing*: Basic tests for utility functions.
  - *Manual Acceptance Testing*: Verifying the end-to-end user flow (Register -> Shop -> Checkout).

*Tools & Environment:*
- *IDE*: Visual Studio Code.
- *VCS*: Git (Branching strategy: Gitflow Workflow).
- *Project Management*: Basic Kanban board for tracking progress.
