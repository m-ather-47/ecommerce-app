import { NextRequest } from "next/server";
import { whop } from "@/lib/whop";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Cart from "@/lib/models/Cart";

export async function POST(req: NextRequest): Promise<Response> {
  const bodyText = await req.text();
  const headers = Object.fromEntries(req.headers);

  let webhookData;
  try {
    webhookData = whop.webhooks.unwrap(bodyText, { headers });
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (webhookData.type === "payment.succeeded") {
    const payment = webhookData.data;
    const orderId = payment.metadata?.orderId;

    if (!orderId) {
      return new Response("OK", { status: 200 });
    }

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order || order.status !== "pending") {
      return new Response("OK", { status: 200 });
    }

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

        // Refund via Whop
        try {
          await whop.payments.refund(payment.id);
        } catch (refundErr) {
          console.error("Failed to refund payment:", refundErr);
        }

        return new Response("OK", { status: 200 });
      }
    }

    // Mark order as paid
    order.status = "paid";
    order.whopPaymentId = payment.id;
    order.paidAt = new Date();
    await order.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { $set: { items: [] } }
    );
  }

  return new Response("OK", { status: 200 });
}
