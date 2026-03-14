import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { updateOrderStatusSchema } from "@/lib/schemas/order.schema";
import { errorResponse, AppError } from "@/lib/errors";
import Order from "@/lib/models/Order";

type RouteContext = { params: Promise<Record<string, string>> };

export const GET = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      const { orderId } = await context.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      // Customers can only view their own orders
      if (
        req.user.role !== "admin" &&
        order.userId.toString() !== req.user._id.toString()
      ) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
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

          const order = await Order.findById(orderId);
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

          order.status = status;
          if (status === "shipped") order.shippedAt = new Date();
          if (status === "delivered") order.deliveredAt = new Date();

          await order.save();
          return NextResponse.json({ order });
        } catch (error) {
          return errorResponse(error);
        }
      }
    )
  )
);
