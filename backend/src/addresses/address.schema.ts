import { z } from "zod";

const create = z.object({
  customerId: z.string().optional(),
  //
  // below is the same for update
  //
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  street: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
});

const update = z.object({
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  street: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
});

const search = z.object({
  // the same as create
  customerId: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  street: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
});

const AddressSchema = { create, update, search };

export default AddressSchema;
