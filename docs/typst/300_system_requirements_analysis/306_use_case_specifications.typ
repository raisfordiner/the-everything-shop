== Use Case Specifications

This section provides detailed specifications for the most critical use cases in the system.

=== User Management

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-01],
    [*Use Case Name*], [Register Account],
    [*Description*], [Allows a new visitor to create a customer account to access personalized features.],
    [*Actors*], [Guest],
    [*Priority*], [High],
    [*Trigger*], [Guest selects "Register" option on the homepage.],
    [*Pre-conditions*], [Guest is not currently logged in.],
    [*Basic Flow*],
    [
      1. System displays the Registration Form.
      2. Guest enters name, email, password, and confirmation.
      3. System validates the input format and checks email uniqueness.
      4. System creates a new Customer record.
      5. System displays a success message and redirects to Login.
    ],

    [*Alternative Flows*],
    [
      - *Invalid Input*: If validation fails, System highlights errors and requests correction.
    ],

    [*Exception Flows*],
    [
      - *Email Taken*: If email exists, System notifies user and suggests recovery.
    ],

    [*Post-conditions*], [New Customer account is created in the database.],
  ),
  caption: [Specification for UC-01: Register Account],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-02],
    [*Use Case Name*], [Login (Email)],
    [*Description*], [Allows users to authenticate and access their account.],
    [*Actors*], [Guest, Customer, Seller, Admin],
    [*Priority*], [High],
    [*Trigger*], [Guest submits login credentials.],
    [*Pre-conditions*], [User must have a registered account.],
    [*Basic Flow*],
    [
      1. Guest enters email and password.
      2. System validates credentials against the database.
      3. System generates a JWT token.
      4. System redirects user to the homepage/dashboard.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Auth Failed*: If credentials disable match, System displays "Invalid email or password".
    ],

    [*Post-conditions*], [User is authenticated and session is active.],
  ),
  caption: [Specification for UC-02: Login],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-05],
    [*Use Case Name*], [View Account Information],
    [*Description*], [Displays the user's personal profile content.],
    [*Actors*], [Customer, Seller, Admin],
    [*Priority*], [Low],
    [*Trigger*], [User navigates to "My Profile".],
    [*Pre-conditions*], [User is logged in.],
    [*Basic Flow*],
    [
      1. System retrieves user details from the database.
      2. System displays name, email, and role.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [User profile is displayed.],
  ),
  caption: [Specification for UC-05: View Account Information],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-06],
    [*Use Case Name*], [Update Account Information],
    [*Description*], [Allows users to modify their personal details.],
    [*Actors*], [Customer, Seller, Admin],
    [*Priority*], [Medium],
    [*Trigger*], [User clicks "Edit Profile".],
    [*Pre-conditions*], [User is logged in.],
    [*Basic Flow*],
    [
      1. User modifies name or other allowed fields.
      2. User submits changes.
      3. System validates input.
      4. System updates the database.
      5. System shows success message.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Update Failed*: Database error triggers an alert to the user.
    ],

    [*Post-conditions*], [User record is updated.],
  ),
  caption: [Specification for UC-06: Update Account Information],
)

=== Product Management

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-14],
    [*Use Case Name*], [Create Product],
    [*Description*], [Enables Sellers to list a new item for sale.],
    [*Actors*], [Seller],
    [*Priority*], [High],
    [*Trigger*], [Seller clicks "Add New Product".],
    [*Pre-conditions*], [Seller is logged in.],
    [*Basic Flow*],
    [
      1. System displays Product Creation form.
      2. Seller enters name, price, stock, and category.
      3. System invokes *UC-17 Upload Media*.
      4. Seller submits the form.
      5. System saves product to database.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Validation Error*: Missing fields prevent submission.
    ],

    [*Post-conditions*], [Product is visible in the catalog.],
  ),
  caption: [Specification for UC-14: Create Product],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-15],
    [*Use Case Name*], [Edit Product],
    [*Description*], [Allows Sellers to update product details.],
    [*Actors*], [Seller],
    [*Priority*], [Medium],
    [*Trigger*], [Seller selects a product to edit.],
    [*Pre-conditions*], [Product exists and belongs to Seller.],
    [*Basic Flow*],
    [
      1. System pre-fills form with current data.
      2. Seller modifies fields (e.g., description, price).
      3. Seller saves changes.
      4. System updates the record.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [Product information is updated.],
  ),
  caption: [Specification for UC-15: Edit Product],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-17],
    [*Use Case Name*], [Upload Product Media],
    [*Description*], [Handles image file uploading and storage.],
    [*Actors*], [Seller],
    [*Priority*], [Medium],
    [*Trigger*], [Included by UC-14 or UC-15.],
    [*Pre-conditions*], [Valid image file format.],
    [*Basic Flow*],
    [
      1. Seller selects image file(s).
      2. System validates file type and size.
      3. System uploads to Object Storage (MinIO).
      4. Storage returns a public URL.
      5. System attaches URL to the product form.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Upload Error*: Storage unavailable/quota exceeded.
    ],

    [*Post-conditions*], [Image URL is ready to be saved.],
  ),
  caption: [Specification for UC-17: Upload Product Media],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-21],
    [*Use Case Name*], [Update Stock Quantity],
    [*Description*], [Adjusts inventory levels.],
    [*Actors*], [Seller],
    [*Priority*], [High],
    [*Trigger*], [Seller manually updates stock or Order placement occurs.],
    [*Pre-conditions*], [Product exists.],
    [*Basic Flow*],
    [
      1. Seller inputs new quantity.
      2. System updates inventory count.
      3. System checks for low-stock triggers.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [Inventory reflects new quantity.],
  ),
  caption: [Specification for UC-21: Update Stock Quantity],
)

=== Shopping & Browsing

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-24],
    [*Use Case Name*], [Browse Products by Category],
    [*Description*], [Allows users to navigate products via hierarchy.],
    [*Actors*], [Guest, Customer],
    [*Priority*], [High],
    [*Trigger*], [User selects a category from menu.],
    [*Pre-conditions*], [-],
    [*Basic Flow*],
    [
      1. System retrieves products linked to the selected category.
      2. System displays products in a grid.
    ],

    [*Alternative Flows*],
    [
      - *Filtering*: User applies additional filters to the category view.
    ],

    [*Exception Flows*],
    [
      - *No Products*: System indicates category is empty.
    ],

    [*Post-conditions*], [Products are displayed.],
  ),
  caption: [Specification for UC-24: Browse Products by Category],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-26],
    [*Use Case Name*], [Search Products],
    [*Description*], [Allows users to find products by keywords.],
    [*Actors*], [Guest, Customer],
    [*Priority*], [High],
    [*Trigger*], [User enters text in search bar.],
    [*Pre-conditions*], [-],
    [*Basic Flow*],
    [
      1. User executes search query.
      2. System matches query against product names/descriptions.
      3. System returns matching results.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *No Matches*: System suggests broadening search.
    ],

    [*Post-conditions*], [Search results are displayed.],
  ),
  caption: [Specification for UC-26: Search Products],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-27],
    [*Use Case Name*], [View Product Details],
    [*Description*], [Shows comprehensive information about a specific item.],
    [*Actors*], [Guest, Customer],
    [*Priority*], [High],
    [*Trigger*], [User clicks a product card.],
    [*Pre-conditions*], [Product exists.],
    [*Basic Flow*],
    [
      1. System fetches full product details (variants, images, reviews).
      2. System renders the Product Detail Page.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Deleted Product*: Redirects to 404/Catalog.
    ],

    [*Post-conditions*], [User views details.],
  ),
  caption: [Specification for UC-27: View Product Details],
)

=== Ordering Process

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-29],
    [*Use Case Name*], [Create & Update Shopping Cart],
    [*Description*], [Manages temporary selection of products.],
    [*Actors*], [Customer],
    [*Priority*], [High],
    [*Trigger*], [Customer clicks "Add to Cart".],
    [*Pre-conditions*], [Customer is logged in, Product has stock.],
    [*Basic Flow*],
    [
      1. System adds item to user's persistent cart.
      2. User views cart.
      3. User can modify quantities or remove items.
      4. System updates cart totals.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Out of Stock*: User tries to add more than available; System restricts action.
    ],

    [*Post-conditions*], [Cart state is updated.],
  ),
  caption: [Specification for UC-29: Create & Update Shopping Cart],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-30],
    [*Use Case Name*], [Create Order],
    [*Description*], [Finalizes the purchase transaction.],
    [*Actors*], [Customer],
    [*Priority*], [Critical],
    [*Trigger*], [Customer clicks "Checkout" from Cart.],
    [*Pre-conditions*], [Cart is not empty.],
    [*Basic Flow*],
    [
      1. System validates stock for all cart items.
      2. Customer confirms delivery address.
      3. Customer optionally applies Coupon (*UC-42*).
      4. System calculates final total.
      5. Customer proceeds to Payment (*UC-37*).
      6. System creates Order record with status "Pending".
      7. System clears the Cart.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Payment Failed*: Order creation aborts, user returned to checkout.
      - *Stock Change*: Items sold out during checkout process alert user.
    ],

    [*Post-conditions*], [Order is placed, Inventory reduced (*UC-21*).],
  ),
  caption: [Specification for UC-30: Create Order],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-31],
    [*Use Case Name*], [View Order Details],
    [*Description*], [Allows customers to track their purchase.],
    [*Actors*], [Customer],
    [*Priority*], [Medium],
    [*Trigger*], [Customer selects an order from history.],
    [*Pre-conditions*], [Order belongs to Customer.],
    [*Basic Flow*],
    [
      1. System retrieves order items, status, and timeline.
      2. System displays details.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [Order info is displayed.],
  ),
  caption: [Specification for UC-31: View Order Details],
)

=== Order Management

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-32],
    [*Use Case Name*], [Manage Order],
    [*Description*], [Sellers update the lifecycle of an order.],
    [*Actors*], [Seller],
    [*Priority*], [High],
    [*Trigger*], [Seller reviews pending orders.],
    [*Pre-conditions*], [Order contains Seller's products.],
    [*Basic Flow*],
    [
      1. Seller views order details.
      2. Seller updates status (e.g., "Processing" -> "Delivering").
      3. System notifies Customer of status change.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Invalid Transition*: Trying to 'ship' a cancelled order. System blocks.
    ],

    [*Post-conditions*], [Order status is updated.],
  ),
  caption: [Specification for UC-32: Manage Order],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-33],
    [*Use Case Name*], [Cancel Order (Customer)],
    [*Description*], [Allows customers to stop an order before processing.],
    [*Actors*], [Customer],
    [*Priority*], [Medium],
    [*Trigger*], [Customer clicks "Cancel" on an order.],
    [*Pre-conditions*], [Order status is "Pending".],
    [*Basic Flow*],
    [
      1. Customer confirms cancellation.
      2. System refunds payment (*UC-40*).
      3. System restocks inventory (*UC-21*).
      4. System marks order as "Cancelled".
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Too Late*: Order is already "Processing"; Cancellation denied.
    ],

    [*Post-conditions*], [Order is cancelled.],
  ),
  caption: [Specification for UC-33: Cancel Order (Customer)],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-35],
    [*Use Case Name*], [Modify Delivery Info],
    [*Description*], [Corrects shipping details before dispatch.],
    [*Actors*], [Seller],
    [*Priority*], [Low],
    [*Trigger*], [Customer request or error discovery.],
    [*Pre-conditions*], [Order not yet "Delivering".],
    [*Basic Flow*],
    [
      1. Seller edits shipping address/notes.
      2. System saves changes.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [Delivery info updated.],
  ),
  caption: [Specification for UC-35: Modify Delivery Info],
)

=== Promotions & Reporting

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-41],
    [*Use Case Name*], [Create/Manage Promotion],
    [*Description*], [Defines discount rules.],
    [*Actors*], [Seller],
    [*Priority*], [Medium],
    [*Trigger*], [Seller creates a coupon.],
    [*Pre-conditions*], [Seller is logged in.],
    [*Basic Flow*],
    [
      1. Seller defines code, discount %, and validity period.
      2. System saves coupon.
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*], [-],
    [*Post-conditions*], [Coupon is active.],
  ),
  caption: [Specification for UC-41: Create/Manage Promotion],
)

#figure(
  table(
    columns: (30%, 70%),
    align: (left, left),
    [*Use Case ID*], [UC-46],
    [*Use Case Name*], [Request Return],
    [*Description*], [Initiates the RMA process.],
    [*Actors*], [Customer],
    [*Priority*], [Medium],
    [*Trigger*], [Customer reports issue with delivered item.],
    [*Pre-conditions*], [Order is "Delivered".],
    [*Basic Flow*],
    [
      1. Customer selects item and reason (Damaged/Wrong Item).
      2. System creates Return Request.
      3. Seller notified to Approve/Reject (*UC-47*).
    ],

    [*Alternative Flows*], [-],
    [*Exception Flows*],
    [
      - *Policy Expiry*: Return window passed.
    ],

    [*Post-conditions*], [Return Request is pending.],
  ),
  caption: [Specification for UC-46: Request Return],
)

// #figure(
//   table(
//     columns: (30%, 70%),
//     align: (left, left),
//     [*Use Case ID*], [UC-54],
//     [*Use Case Name*], [View Dashboard],
//     [*Description*], [Provides high-level analytics.],
//     [*Actors*], [Seller, Admin],
//     [*Priority*], [Low],
//     [*Trigger*], [User logs in to backend.],
//     [*Pre-conditions*], [-],
//     [*Basic Flow*],
//     [
//       1. System aggregates sales data, new orders, and inventory alerts.
//       2. System renders charts/tables.
//     ],

//     [*Alternative Flows*], [-],
//     [*Exception Flows*], [-],
//     [*Post-conditions*], [Business insights displayed.],
//   ),
//   caption: [Specification for UC-54: View Dashboard],
// )
