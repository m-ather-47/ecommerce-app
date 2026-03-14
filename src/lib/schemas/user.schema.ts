import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  shippingAddress: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
});

export const adminUpdateUserSchema = updateUserSchema.extend({
  role: z.enum(["customer", "admin"]).optional(),
});
