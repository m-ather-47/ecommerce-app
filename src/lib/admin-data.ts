import "server-only";
import { db, products, orders, orderItems, users } from "@/lib/db";
import { eq, and, lt, gte, gt, desc, like, sql, ne } from "drizzle-orm";
import type {
  Product as ProductType,
  Order as OrderType,
  UserProfile,
  Pagination,
} from "@/lib/types";
import {
  mapProductToApi,
  mapOrderToApi,
  mapUserToApi,
  mapOrderItemToApi,
} from "@/lib/types";

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
  recentOrders: OrderType[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalOrdersResult,
    revenueResult,
    totalProductsResult,
    totalUsersResult,
    lowStockResult,
    recentOrdersRaw,
  ] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(orders),
    db
      .select({ total: sql<number>`COALESCE(SUM(total), 0)` })
      .from(orders)
      .where(ne(orders.status, "cancelled")),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.isActive, true)),
    db.select({ count: sql<number>`COUNT(*)` }).from(users),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(and(lt(products.stock, 10), eq(products.isActive, true))),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);

  // Get order items for recent orders
  const recentOrders = await Promise.all(
    recentOrdersRaw.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return mapOrderToApi(order, items.map(mapOrderItemToApi));
    })
  );

  return {
    totalOrders: totalOrdersResult[0]?.count || 0,
    totalRevenue: revenueResult[0]?.total || 0,
    totalProducts: totalProductsResult[0]?.count || 0,
    totalUsers: totalUsersResult[0]?.count || 0,
    lowStockCount: lowStockResult[0]?.count || 0,
    recentOrders,
  };
}

interface GetAdminProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  stockStatus?: "all" | "in" | "low" | "out";
  q?: string;
}

export async function getAdminProducts(
  params: GetAdminProductsParams = {}
): Promise<{ products: ProductType[]; pagination: Pagination }> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (params.q) {
    const searchTerm = `%${params.q}%`;
    conditions.push(
      sql`(${products.name} LIKE ${searchTerm} OR ${products.description} LIKE ${searchTerm})`
    );
  }

  if (params.category) {
    conditions.push(eq(products.category, params.category));
  }

  if (params.stockStatus === "out") {
    conditions.push(eq(products.stock, 0));
  } else if (params.stockStatus === "low") {
    conditions.push(and(gt(products.stock, 0), lt(products.stock, 10)));
  } else if (params.stockStatus === "in") {
    conditions.push(gte(products.stock, 10));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [productResults, countResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.updatedAt))
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

interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
}

export async function getAdminOrders(
  params: GetAdminOrdersParams = {}
): Promise<{ orders: OrderType[]; pagination: Pagination }> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (params.status) {
    conditions.push(eq(orders.status, params.status as OrderType["status"]));
  }

  if (params.q) {
    conditions.push(like(orders.orderNumber, `%${params.q}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [orderResults, countResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;

  // Get items for each order
  const ordersWithItems = await Promise.all(
    orderResults.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return mapOrderToApi(order, items.map(mapOrderItemToApi));
    })
  );

  return {
    orders: ordersWithItems,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  q?: string;
}

export async function getAdminUsers(
  params: GetAdminUsersParams = {}
): Promise<{ users: UserProfile[]; pagination: Pagination }> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (params.role) {
    conditions.push(eq(users.role, params.role as "customer" | "admin"));
  }

  if (params.q) {
    const searchTerm = `%${params.q}%`;
    conditions.push(
      sql`(${users.email} LIKE ${searchTerm} OR ${users.name} LIKE ${searchTerm})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [userResults, countResult] = await Promise.all([
    db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`COUNT(*)` }).from(users).where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;

  return {
    users: userResults.map(mapUserToApi),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getAdminProduct(id: string): Promise<ProductType | null> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result[0] ? mapProductToApi(result[0]) : null;
}

export async function getAdminOrder(id: string): Promise<OrderType | null> {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!result[0]) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return mapOrderToApi(result[0], items.map(mapOrderItemToApi));
}

export async function getAdminUser(id: string): Promise<UserProfile | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0] ? mapUserToApi(result[0]) : null;
}
