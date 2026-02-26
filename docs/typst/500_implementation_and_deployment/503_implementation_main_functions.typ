This section highlights the code implementation of the system's most critical functions, demonstrating how the actual core business logic is handled in the codebase.

=== Authentication Module
The authentication system secures the application by verifying user identities, issuing JWT tokens (access and refresh), and managing cookies.

==== Login Controller
The `login` function validates user credentials, generates tokens, sets secure cookies, and retrieves complete user profile information (including customer, seller, or admin roles).

```typescript
// backend/src/auth/auth.controller.ts
static async login(req: Request, res: Response) {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  try {
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    setAuthCookies(res, accessToken, refreshToken);

    // Fetch complete user info including customer/seller/admin relations
    const completeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        customer: { select: { id: true, image: true, addresses: true } },
        seller: { select: { id: true, email: true, image: true } },
        admin: { select: { id: true } }
      },
    });

    return Send.success(res, completeUser);
  } catch (error: any) {
    if (error.message === "Invalid email or password.") {
      return Send.unauthorized(res, null, error.message);
    }
    logger.error({ error }, "Login Failed");
    return Send.error(res, null, error.message || "Login failed.");
  }
}
```

=== Product Management
This module handles the retrieval and management of the product catalog.

==== Get All Products
The `getAllProducts` function supports pagination, category filtering, and search functionality, validating input query parameters before delegating to the service layer.

```typescript
// backend/src/products/product.controller.ts
static async getAllProducts(req: Request, res: Response) {
  try {
    const queryValidation = ProductSchema.getAllProductsQuery.safeParse(req.query);

    if (!queryValidation.success) {
      const errors = queryValidation.error.flatten().fieldErrors;
      return Send.validationErrors(res, errors);
    }

    const { skip, take, categoryId, search } = queryValidation.data as GetAllProductsQuery;

    const result = await ProductService.getAllProducts(skip, take, categoryId, search);

    return Send.success(res, result, "Products fetched successfully");
  } catch (error) {
    logger.error({ error }, "Failed to fetch products");
    return Send.error(res, null, "Failed to fetch products");
  }
}
```

=== Order Module
The order module manages the checkout process and direct order creation.

==== Create Direct Order
The `createDirect` function handles immediate purchases of a single product variant. It identifies the customer from the authenticated session and delegates the order creation logic.

```typescript
// backend/src/orders/order.controller.ts
static async createDirect(req: Request, res: Response) {
  const { addressId, productVariantId, quantity } = req.body;
  const customerId = (req as any).user?.customer?.id;

  if (!customerId) {
    return Send.notFound(res, null, "Customer not found");
  }

  try {
    const order = await OrderService.createDirectOrder(customerId, addressId, productVariantId, quantity);

    return Send.success(res, order, "Order created successfully");
  } catch (error: any) {
    return Send.badRequest(res, null, error.message);
  }
}
```

=== Cart Management
The cart module allows customers to manage items before checkout.

==== Checkout Logic
The `checkout` function initiates the order process from a cart, handling multiple items, address selection, and payment method.

```typescript
// backend/src/cart/cart.controller.ts
static async checkout(req: Request, res: Response) {
  try {
    const { customerId } = req.params;
    const { cartItemIds, addressId, paymentMethod } = req.body;

    const order = await CartService.checkout({
      customerId,
      cartItemIds,
      addressId,
      paymentMethod,
    });

    return Send.success(res, { order }, "Checkout successful");
  } catch (error: any) {
    logger.error({ error }, "Error during checkout");

    if (error.message.includes("not found") || error.message.includes("do not belong")) {
      return Send.badRequest(res, {}, error.message);
    }

    return Send.error(res, {}, "Internal server error");
  }
}
```

=== Security Middleware
Middleware functions ensure that only authorized users can access specific resources.

==== Auth Guard
The `authGuard` middleware extracts the JWT token from cookies, verifies it, and attaches the user object (including role-specific profiles) to the request context.

```typescript
// backend/src/middlewares/authGuard.ts
export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return Send.unauthorized(res, null); // can't find token, unauthorized user
  }
  try {
    const decodedToken = jwt.verify(token, authConfig.secret) as { userId: string };

    // Fetch complete user with relations
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: {
        customer: true,
        seller: true,
        admin: true,
      }
    });

    if (!user) {
      return Send.unauthorized(res, { message: "User not found" });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    // token is invalid or expired
    logger.error({ error }, "Authentication failed");
    return Send.unauthorized(res, null);
  }
};
```
