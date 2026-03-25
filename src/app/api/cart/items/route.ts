import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { addCartItemSchema } from "@/lib/schemas/cart.schema";
import { errorResponse, AppError } from "@/lib/errors";
import { db, carts, cartItems, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/db/utils";
import { mapCartToApi, mapCartItemToApi } from "@/lib/types";

export const POST = withAuth(
  withValidation(addCartItemSchema)(async (req: AuthenticatedRequest) => {
    try {
      const { productId, quantity } = await req.json();

      // Find product
      const productResult = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      const product = productResult[0];
      if (!product || !product.isActive) {
        throw new AppError("Product not found", 404);
      }
      if (product.stock < quantity) {
        throw new AppError(
          `Insufficient stock. Available: ${product.stock}`,
          409
        );
      }

      // Find or create cart
      let cartResult = await db
        .select()
        .from(carts)
        .where(eq(carts.userId, req.user.id))
        .limit(1);

      let cart = cartResult[0];
      if (!cart) {
        const newCart = {
          id: generateId(),
          userId: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.insert(carts).values(newCart);
        cart = newCart;
      }

      // Check for existing item
      const existingItemResult = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));

      const existingItem = existingItemResult.find(
        (item) => item.productId === productId
      );

      const images = product.images ? JSON.parse(product.images) : [];

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (product.stock < newQty) {
          throw new AppError(
            `Insufficient stock. Available: ${product.stock}`,
            409
          );
        }
        await db
          .update(cartItems)
          .set({ quantity: newQty })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        await db.insert(cartItems).values({
          id: generateId(),
          cartId: cart.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: images[0] || null,
        });
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

      return NextResponse.json(
        { cart: mapCartToApi(cart, items.map(mapCartItemToApi)) },
        { status: 201 }
      );
    } catch (error) {
      return errorResponse(error);
    }
  })
);
