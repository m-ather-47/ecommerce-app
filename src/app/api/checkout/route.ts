import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse, AppError } from "@/lib/errors";
import { db, carts, cartItems, products, orders, orderItems } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { generateId, generateOrderNumber } from "@/lib/db/utils";
import crypto from "crypto";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    // Find cart
    const cartResult = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, req.user.id))
      .limit(1);

    const cart = cartResult[0];
    if (!cart) {
      throw new AppError("Cart is empty", 400);
    }

    // Get cart items
    const cartItemsResult = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    if (cartItemsResult.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Check shipping address
    const shippingAddress = req.user.shippingAddress
      ? JSON.parse(req.user.shippingAddress)
      : null;

    if (!shippingAddress?.street) {
      throw new AppError(
        "Shipping address is required. Update your profile first.",
        400
      );
    }

    // Get all products in cart
    const productIds = cartItemsResult.map((item) => item.productId);
    const productsResult = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(productsResult.map((p) => [p.id, p]));

    const orderItemsData = [];
    let subtotal = 0;

    for (const cartItem of cartItemsResult) {
      const product = productMap.get(cartItem.productId);
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

      const images = product.images ? JSON.parse(product.images) : [];
      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        id: generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: images[0] || null,
      });
    }

    const total = subtotal;
    const testCheckoutId = `test_${crypto.randomBytes(8).toString("hex")}`;
    const orderId = generateId();

    // Create order
    await db.insert(orders).values({
      id: orderId,
      userId: req.user.id,
      orderNumber: generateOrderNumber(),
      subtotal,
      tax: 0,
      total,
      status: "pending",
      whopCheckoutId: testCheckoutId,
      shippingAddress: JSON.stringify(shippingAddress),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create order items
    for (const item of orderItemsData) {
      await db.insert(orderItems).values({
        ...item,
        orderId,
      });
    }

    return NextResponse.json({
      checkoutId: testCheckoutId,
      purchaseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/test-payment?orderId=${orderId}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
});
