import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { updateCartItemSchema } from "@/lib/schemas/cart.schema";
import { errorResponse, AppError } from "@/lib/errors";
import { db, carts, cartItems, products } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { mapCartToApi, mapCartItemToApi } from "@/lib/types";

type RouteContext = { params: Promise<Record<string, string>> };

export const PATCH = withAuth(
  withValidation(updateCartItemSchema)(
    async (req: AuthenticatedRequest, context: RouteContext) => {
      try {
        const { itemId } = await context.params;
        const { quantity } = await req.json();

        // Find cart
        const cartResult = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, req.user.id))
          .limit(1);

        const cart = cartResult[0];
        if (!cart) {
          throw new AppError("Cart not found", 404);
        }

        // Find item
        const itemResult = await db
          .select()
          .from(cartItems)
          .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)))
          .limit(1);

        const item = itemResult[0];
        if (!item) {
          throw new AppError("Item not found in cart", 404);
        }

        if (quantity === 0) {
          // Delete item
          await db.delete(cartItems).where(eq(cartItems.id, itemId));
        } else {
          // Check stock
          const productResult = await db
            .select()
            .from(products)
            .where(eq(products.id, item.productId))
            .limit(1);

          const product = productResult[0];
          if (!product || product.stock < quantity) {
            throw new AppError(
              `Insufficient stock. Available: ${product?.stock ?? 0}`,
              409
            );
          }

          // Update quantity
          await db
            .update(cartItems)
            .set({ quantity })
            .where(eq(cartItems.id, itemId));
        }

        // Update cart timestamp
        await db
          .update(carts)
          .set({ updatedAt: new Date() })
          .where(eq(carts.id, cart.id));

        // Return updated cart
        const items = await db
          .select()
          .from(cartItems)
          .where(eq(cartItems.cartId, cart.id));

        return NextResponse.json({
          cart: mapCartToApi(cart, items.map(mapCartItemToApi)),
        });
      } catch (error) {
        return errorResponse(error);
      }
    }
  )
);

export const DELETE = withAuth(
  async (req: AuthenticatedRequest, context: RouteContext) => {
    try {
      const { itemId } = await context.params;

      // Find cart
      const cartResult = await db
        .select()
        .from(carts)
        .where(eq(carts.userId, req.user.id))
        .limit(1);

      const cart = cartResult[0];
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      // Delete item
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)));

      // Update cart timestamp
      await db
        .update(carts)
        .set({ updatedAt: new Date() })
        .where(eq(carts.id, cart.id));

      // Return updated cart
      const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));

      return NextResponse.json({
        cart: mapCartToApi(cart, items.map(mapCartItemToApi)),
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
);
