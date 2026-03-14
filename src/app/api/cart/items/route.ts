import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { addCartItemSchema } from "@/lib/schemas/cart.schema";
import { errorResponse, AppError } from "@/lib/errors";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";

export const POST = withAuth(
  withValidation(addCartItemSchema)(async (req: AuthenticatedRequest) => {
    try {
      const { productId, quantity } = await req.json();

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw new AppError("Product not found", 404);
      }
      if (product.stock < quantity) {
        throw new AppError(
          `Insufficient stock. Available: ${product.stock}`,
          409
        );
      }

      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
      }

      const existingItem = cart.items.find(
        (item: { productId: { toString(): string } }) =>
          item.productId.toString() === productId
      );

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (product.stock < newQty) {
          throw new AppError(
            `Insufficient stock. Available: ${product.stock}`,
            409
          );
        }
        existingItem.quantity = newQty;
      } else {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.images[0],
        } as typeof cart.items[number]);
      }

      await cart.save();
      return NextResponse.json({ cart }, { status: 201 });
    } catch (error) {
      return errorResponse(error);
    }
  })
);
