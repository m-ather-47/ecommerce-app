import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum(["paid", "shipped", "delivered", "cancelled"]),
});
