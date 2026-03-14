import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { updateProductSchema } from "@/lib/schemas/product.schema";
import { errorResponse } from "@/lib/errors";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";

type RouteContext = { params: Promise<Record<string, string>> };

async function findProduct(productId: string) {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    return Product.findById(productId);
  }
  return Product.findOne({ slug: productId });
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    await dbConnect();
    const { productId } = await context.params;
    const product = await findProduct(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    return errorResponse(error);
  }
}

export const PATCH = withAuth(
  withRole("admin")(
    withValidation(updateProductSchema)(
      async (req: AuthenticatedRequest, context: RouteContext) => {
        try {
          const { productId } = await context.params;
          const body = await req.json();

          const product = await Product.findByIdAndUpdate(productId, body, {
            new: true,
            runValidators: true,
          });
          if (!product) {
            return NextResponse.json(
              { error: "Product not found" },
              { status: 404 }
            );
          }

          return NextResponse.json({ product });
        } catch (error) {
          return errorResponse(error);
        }
      }
    )
  )
);

export const DELETE = withAuth(
  withRole("admin")(
    async (_req, context: RouteContext) => {
      try {
        const { productId } = await context.params;
        const product = await Product.findByIdAndUpdate(
          productId,
          { isActive: false },
          { new: true }
        );
        if (!product) {
          return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ message: "Product deleted" });
      } catch (error) {
        return errorResponse(error);
      }
    }
  )
);
