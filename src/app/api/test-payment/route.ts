import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems, products, carts, cartItems } from "@/lib/db";
import { eq, and, gte } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest): Promise<Response> {
  const { orderId, action } = await req.json();

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  // Find order
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = orderResult[0];
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Order is no longer pending" },
      { status: 400 }
    );
  }

  if (action === "cancel") {
    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    return NextResponse.json({ success: true, status: "cancelled" });
  }

  // Get order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  // Simulate successful payment - decrement stock for each item
  for (const item of items) {
    // Check if product has enough stock
    const productResult = await db
      .select()
      .from(products)
      .where(and(eq(products.id, item.productId), gte(products.stock, item.quantity)))
      .limit(1);

    if (!productResult[0]) {
      // Stock insufficient — cancel order
      await db
        .update(orders)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(orders.id, orderId));
      return NextResponse.json(
        { error: "Insufficient stock, order cancelled" },
        { status: 409 }
      );
    }

    // Decrement stock
    await db
      .update(products)
      .set({
        stock: productResult[0].stock - item.quantity,
        updatedAt: new Date(),
      })
      .where(eq(products.id, item.productId));
  }

  // Mark order as paid
  await db
    .update(orders)
    .set({
      status: "paid",
      whopPaymentId: `test_pay_${crypto.randomBytes(8).toString("hex")}`,
      paidAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  // Clear cart only for authenticated orders that have a user id.
  if (order.userId) {
    const cartResult = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, order.userId))
      .limit(1);

    if (cartResult[0]) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartResult[0].id));
    }
  }

  return NextResponse.json({ success: true, status: "paid" });
}
