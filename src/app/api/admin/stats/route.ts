import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { db, products, orders, users } from "@/lib/db";
import { eq, ne, lt, and, sql } from "drizzle-orm";

export const GET = withAuth(
  withRole("admin")(async (_req: AuthenticatedRequest) => {
    const [
      totalOrdersResult,
      revenueResult,
      totalProductsResult,
      totalUsersResult,
      lowStockResult,
      pendingOrders,
      paidOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
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
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(eq(orders.status, "pending")),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(eq(orders.status, "paid")),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(eq(orders.status, "shipped")),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(eq(orders.status, "delivered")),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(eq(orders.status, "cancelled")),
    ]);

    const stats = {
      totalOrders: totalOrdersResult[0]?.count || 0,
      totalRevenue: revenueResult[0]?.total || 0,
      totalProducts: totalProductsResult[0]?.count || 0,
      totalUsers: totalUsersResult[0]?.count || 0,
      lowStockCount: lowStockResult[0]?.count || 0,
      ordersByStatus: [
        { status: "pending", count: pendingOrders[0]?.count || 0 },
        { status: "paid", count: paidOrders[0]?.count || 0 },
        { status: "shipped", count: shippedOrders[0]?.count || 0 },
        { status: "delivered", count: deliveredOrders[0]?.count || 0 },
        { status: "cancelled", count: cancelledOrders[0]?.count || 0 },
      ].filter((item) => item.count > 0),
    };

    return NextResponse.json(stats);
  })
);
