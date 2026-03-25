import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { updateOrderStatusSchema } from "@/lib/schemas/order.schema";
import { errorResponse, AppError } from "@/lib/errors";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { mapOrderToApi, mapOrderItemToApi, OrderStatus } from "@/lib/types";

type RouteContext = { params: Promise<Record<string, string>> };

export const GET = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      const { orderId } = await context.params;

      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      const order = orderResult[0];
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Customers can only view their own orders
      if (req.user.role !== "admin" && order.userId !== req.user.id) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      return NextResponse.json({
        order: mapOrderToApi(order, items.map(mapOrderItemToApi)),
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
);

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const PATCH = withAuth(
  withRole("admin")(
    withValidation(updateOrderStatusSchema)(
      async (req: AuthenticatedRequest, context: RouteContext) => {
        try {
          const { orderId } = await context.params;
          const { status } = await req.json();

          const orderResult = await db
            .select()
            .from(orders)
            .where(eq(orders.id, orderId))
            .limit(1);

          const order = orderResult[0];
          if (!order) {
            return NextResponse.json(
              { error: "Order not found" },
              { status: 404 }
            );
          }

          const allowed = VALID_TRANSITIONS[order.status] || [];
          if (!allowed.includes(status)) {
            throw new AppError(
              `Cannot transition from "${order.status}" to "${status}"`,
              400
            );
          }

          const updates: Partial<typeof orders.$inferInsert> = {
            status: status as OrderStatus,
            updatedAt: new Date(),
          };

          if (status === "shipped") updates.shippedAt = new Date();
          if (status === "delivered") updates.deliveredAt = new Date();

          await db.update(orders).set(updates).where(eq(orders.id, orderId));

          // Fetch updated order
          const updatedOrderResult = await db
            .select()
            .from(orders)
            .where(eq(orders.id, orderId))
            .limit(1);

          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, orderId));

          return NextResponse.json({
            order: mapOrderToApi(updatedOrderResult[0], items.map(mapOrderItemToApi)),
          });
        } catch (error) {
          return errorResponse(error);
        }
      }
    )
  )
);
