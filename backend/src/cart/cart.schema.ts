import { z } from "zod";

const create = z.object({
  customerId: z.string("Customer ID is required"),
});

const search = z.object({
  customerID: z.string().optional(),
});

const addItem = z.object({
  productVariantId: z.string("Product Variant ID is required"),
  quantity: z
    .number("Quantity is required")
    .int("Quantity must be integer")
    .positive("Quantity must be greater than 0"),
});

const updateItem = z.object({
  quantity: z
    .number("Quantity is required")
    .int("Quantity must be integer")
    .positive("Quantity must be greater than 0"),
});

const CartSchema = { create, search, addItem, updateItem };

export default CartSchema;
