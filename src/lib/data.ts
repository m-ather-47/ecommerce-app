import "server-only";
import { db, products } from "@/lib/db";
import { eq, and, gt, desc, asc, like, sql } from "drizzle-orm";
import type { Product as ProductType, Pagination } from "@/lib/types";
import { mapProductToApi } from "@/lib/types";

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
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [eq(products.isActive, true)];

  if (params.category) {
    conditions.push(eq(products.category, params.category));
  }

  if (params.q) {
    const searchTerm = `%${params.q}%`;
    conditions.push(
      sql`(${products.name} LIKE ${searchTerm} OR ${products.description} LIKE ${searchTerm} OR ${products.category} LIKE ${searchTerm})`
    );
  }

  // Build sort
  let orderBy;
  if (params.sort === "price_asc") orderBy = asc(products.price);
  else if (params.sort === "price_desc") orderBy = desc(products.price);
  else if (params.sort === "name_asc") orderBy = asc(products.name);
  else if (params.sort === "name_desc") orderBy = desc(products.name);
  else orderBy = desc(products.createdAt);

  const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

  const [productResults, countResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;

  return {
    products: productResults.map(mapProductToApi),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductType | null> {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  return result[0] ? mapProductToApi(result[0]) : null;
}

export async function getCategories(): Promise<string[]> {
  const results = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.category));

  return results.map((r) => r.category);
}

export async function getFeaturedProducts(
  limit = 8
): Promise<ProductType[]> {
  const results = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), gt(products.stock, 0)))
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return results.map(mapProductToApi);
}

export async function getBestSellers(limit = 4): Promise<ProductType[]> {
  // In a real app, this would sort by sales count
  const results = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), gt(products.stock, 0)))
    .orderBy(desc(products.updatedAt))
    .limit(limit);

  return results.map(mapProductToApi);
}

export async function getProductsByCategory(
  category: string,
  limit = 4
): Promise<ProductType[]> {
  const results = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        gt(products.stock, 0),
        eq(products.category, category)
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return results.map(mapProductToApi);
}

export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductType[]> {
  const results = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        eq(products.category, category),
        sql`${products.slug} != ${excludeSlug}`
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return results.map(mapProductToApi);
}
