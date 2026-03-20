import "server-only";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import type { Product as ProductType, Pagination } from "@/lib/types";

interface GetProductsParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: string;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<{ products: ProductType[]; pagination: Pagination }> {
  await dbConnect();

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isActive: true };
  if (params.q) filter.$text = { $search: params.q };
  if (params.category) filter.category = params.category;

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (params.sort === "price_asc") sortOption = { price: 1 };
  else if (params.sort === "price_desc") sortOption = { price: -1 };
  else if (params.sort === "name_asc") sortOption = { name: 1 };
  else if (params.sort === "name_desc") sortOption = { name: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductType | null> {
  await dbConnect();
  const product = await Product.findOne({ slug, isActive: true }).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getCategories(): Promise<string[]> {
  await dbConnect();
  const categories: string[] = await Product.distinct("category", {
    isActive: true,
  });
  return categories.sort();
}

export async function getFeaturedProducts(
  limit = 8
): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getBestSellers(limit = 4): Promise<ProductType[]> {
  await dbConnect();
  // In a real app, this would sort by sales count
  const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductsByCategory(
  category: string,
  limit = 4
): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({
    isActive: true,
    stock: { $gt: 0 },
    category,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find({
    isActive: true,
    category,
    slug: { $ne: excludeSlug },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}
