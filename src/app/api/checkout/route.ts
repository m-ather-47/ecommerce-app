import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse, AppError } from "@/lib/errors";
import { whop } from "@/lib/whop";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import crypto from "crypto";

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `ORD-${date}-${rand}`;
}

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    if (!req.user.shippingAddress?.street) {
      throw new AppError(
        "Shipping address is required. Update your profile first.",
        400
      );
    }

    const productIds = cart.items.map((item: { productId: unknown }) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.productId.toString());
      if (!product || !product.isActive) {
        throw new AppError(
          `Product "${cartItem.name}" is no longer available`,
          409
        );
      }
      if (product.stock < cartItem.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          409
        );
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.images[0],
      });
    }

    const total = subtotal;

    const order = await Order.create({
      userId: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      tax: 0,
      total,
      status: "pending",
      whopCheckoutId: "pending",
      shippingAddress: req.user.shippingAddress,
    });

    // Price is in dollars for Whop (our DB stores cents)
    const totalDollars = total / 100;

    const checkoutConfig = await whop.checkoutConfigurations.create({
      plan: {
        company_id: process.env.WHOP_COMPANY_ID!,
        currency: "usd",
        initial_price: totalDollars,
        plan_type: "one_time",
        title: `Order ${order.orderNumber}`,
        visibility: "hidden",
      },
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}?success=true`,
    });

    order.whopCheckoutId = checkoutConfig.id;
    await order.save();

    return NextResponse.json({
      checkoutId: checkoutConfig.id,
      purchaseUrl: checkoutConfig.purchase_url,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
