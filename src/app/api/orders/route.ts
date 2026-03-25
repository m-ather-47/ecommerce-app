import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse } from "@/lib/errors";
import { db, orders, orderItems } from "@/lib/db";
import { eq, and, desc, sql, or } from "drizzle-orm";
import { mapOrderToApi, mapOrderItemToApi, OrderStatus } from "@/lib/types";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const status = searchParams.get("status");

    const isAdmin = req.user.role === "admin";
    const conditions = [];

    if (!isAdmin) {
      conditions.push(or(eq(orders.userId, req.user.id), eq(orders.userEmail, req.user.email)));
    } else {
      const userId = searchParams.get("userId");
      if (userId) conditions.push(eq(orders.userId, userId));
    }

    if (status) {
      conditions.push(eq(orders.status, status as OrderStatus));
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

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(error);
  }
});
