import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { updateCartItemSchema } from "@/lib/schemas/cart.schema";
import { errorResponse, AppError } from "@/lib/errors";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { ICartItem } from "@/lib/models/Cart";

type RouteContext = { params: Promise<Record<string, string>> };

export const PATCH = withAuth(
  withValidation(updateCartItemSchema)(
    async (req: AuthenticatedRequest, context: RouteContext) => {
      try {
        const { itemId } = await context.params;
        const { quantity } = await req.json();

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
          throw new AppError("Cart not found", 404);
        }

        const item = cart.items.find(
          (i: ICartItem) => i._id.toString() === itemId
        );
        if (!item) {
          throw new AppError("Item not found in cart", 404);
        }

        if (quantity === 0) {
          cart.items = cart.items.filter(
            (i: ICartItem) => i._id.toString() !== itemId
          );
        } else {
          const product = await Product.findById(item.productId);
          if (!product || product.stock < quantity) {
            throw new AppError(
              `Insufficient stock. Available: ${product?.stock ?? 0}`,
              409
            );
          }
          item.quantity = quantity;
        }

        await cart.save();
        return NextResponse.json({ cart });
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

      const cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      cart.items = cart.items.filter(
        (i: ICartItem) => i._id.toString() !== itemId
      );

      await cart.save();
      return NextResponse.json({ cart });
    } catch (error) {
      return errorResponse(error);
    }
  }
);
