import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().int().min(0),
  currency: z.string().length(3).default("usd"),
  images: z.array(z.string().url()).default([]),
  category: z.string().min(1).max(100),
  stock: z.number().int().min(0).default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().min(1).max(100).optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
