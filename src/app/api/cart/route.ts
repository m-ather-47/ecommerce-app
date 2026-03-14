import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse } from "@/lib/errors";
import Cart from "@/lib/models/Cart";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    return NextResponse.json({ cart: cart || { userId: req.user._id, items: [] } });
  } catch (error) {
    return errorResponse(error);
  }
});

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } }
    );
    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    return errorResponse(error);
  }
});
