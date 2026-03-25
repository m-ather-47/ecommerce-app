import { NextRequest, NextResponse } from "next/server";
import { errorResponse, AppError } from "@/lib/errors";
import { db, products, orders, orderItems, users, carts, cartItems as dbCartItemsTable } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { generateId, generateOrderNumber } from "@/lib/db/utils";
import crypto from "crypto";
import { neonAuth } from "@neondatabase/auth/next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { cartItems } = body;
    let shippingAddress = body.shippingAddress;
    let userEmail = body.email || null;

    let userId: string | null = null;

    // Check for authenticated user - use conditional approach to avoid redirects
    try {
      const authResult = await neonAuth().catch(() => ({ session: null, user: null }));
      const { session, user: authUser } = authResult || { session: null, user: null };

      if (session && authUser) {
        // Find user in db
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.neonAuthId, authUser.id))
          .limit(1);

        const user = userResult[0];
        if (user) {
          userId = user.id;
          if (!userEmail) userEmail = user.email;
          if (!shippingAddress && user.shippingAddress) {
            shippingAddress = JSON.parse(user.shippingAddress);
          }

          if (!cartItems || cartItems.length === 0) {
            const cartResult = await db
              .select()
              .from(carts)
              .where(eq(carts.userId, user.id))
              .limit(1);

            const cart = cartResult[0];
            if (cart) {
              const itemsResult = await db
                .select()
                .from(dbCartItemsTable)
                .where(eq(dbCartItemsTable.cartId, cart.id));
              cartItems = itemsResult;
            }
          }
        }
      }
    } catch (e) {
      // Ignore auth errors for guests - continue with guest checkout
      console.log("Guest checkout - no authentication");
    }

    if (!userEmail) {
      throw new AppError("Email is required for checkout", 400);
    }

    if (!cartItems || cartItems.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    if (!shippingAddress?.street) {
      throw new AppError(
        "Shipping address is required.",
        400
      );
    }


    // Get all products in cart
    const productIds = cartItems.map((item: any) => item.productId);
    const productsResult = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(productsResult.map((p) => [p.id, p]));

    const orderItemsData = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.productId);
      if (!product || !product.isActive) {
        throw new AppError(
          `Product "${cartItem.name || product?.name || cartItem.productId}" is no longer available`,
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
      userId,
      userEmail,
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
      purchaseUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/test-payment?orderId=${orderId}`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return errorResponse(error);
  }
}

