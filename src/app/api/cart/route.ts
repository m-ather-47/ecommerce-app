import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse } from "@/lib/errors";
import { db, carts, cartItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { mapCartToApi, mapCartItemToApi } from "@/lib/types";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, req.user.id))
      .limit(1);

    if (!cart[0]) {
      return NextResponse.json({
        cart: { userId: req.user.id, items: [] },
      });
    }

    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cart[0].id));

    return NextResponse.json({
      cart: mapCartToApi(cart[0], items.map(mapCartItemToApi)),
    });
  } catch (error) {
    return errorResponse(error);
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, req.user.id))
      .limit(1);

    if (cart[0]) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id));
    }

    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    return errorResponse(error);
  }
});
