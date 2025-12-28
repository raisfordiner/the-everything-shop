=== Data Design

The database schema is designed using PostgreSQL and managed via Prisma ORM. Below are the key entities and their relationships.

==== Key Entities

- *User*: The central entity for authentication.
  - Fields: `id`, `email`, `password`, `role` (Admin/Seller/Customer).
  - Relationships: 1-to-1 with `Customer`, `Seller`, `Admin` profiles.

- *Product*: Represents items for sale.
  - Fields: `id`, `name`, `price`, `stockQuantity`, `images`.
  - Relationships: Belongs to `Category`, created by `Seller`.

- *Order*: Represents a purchase transaction.
  - Fields: `id`, `totalAmount`, `status`, `orderDate`.
  - Relationships: Belongs to `Customer`, contains multiple `OrderItems`.

- *OrderItem*: A specific product variant within an order.
  - Fields: `quantity`, `price` at time of purchase.
  - Relationships: Links `Order` and `ProductVariant`.

- *Payment*: Tracks the financial transaction for an order.
  - Fields: `amount`, `method`, `status`.
  - Relationships: 1-to-1 with `Order`.

#figure(
  image("/docs/diagrams/data/svg/erd.svg", width: 100%),
  caption: [Entity Relationship Diagram],
)
