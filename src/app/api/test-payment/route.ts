import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Cart from "@/lib/models/Cart";
import crypto from "crypto";

export async function POST(req: NextRequest): Promise<Response> {
  const { orderId, action } = await req.json();

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const order = await Order.findById(orderId);
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
    order.status = "cancelled";
    await order.save();
    return NextResponse.json({ success: true, status: "cancelled" });
  }

  // Simulate successful payment
  // Atomically decrement stock for each item
  for (const item of order.items) {
    const result = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!result) {
      // Stock insufficient — cancel order
      order.status = "cancelled";
      await order.save();
      return NextResponse.json(
        { error: "Insufficient stock, order cancelled" },
        { status: 409 }
      );
    }
  }

  // Mark order as paid
  order.status = "paid";
  order.whopPaymentId = `test_pay_${crypto.randomBytes(8).toString("hex")}`;
  order.paidAt = new Date();
  await order.save();

  // Clear the user's cart
  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { $set: { items: [] } }
  );

  return NextResponse.json({ success: true, status: "paid" });
}
