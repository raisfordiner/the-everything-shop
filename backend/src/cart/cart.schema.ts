import { z } from "zod";

const create = z.object({
  customerId: z.string("Customer ID is required"),
});

const search = z.object({
  customerID: z.string().optional(),
});

const CartSchema = { create, search };

export default CartSchema;
