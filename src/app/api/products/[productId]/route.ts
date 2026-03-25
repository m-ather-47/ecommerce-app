import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { updateProductSchema } from "@/lib/schemas/product.schema";
import { errorResponse } from "@/lib/errors";
import { db, products } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { mapProductToApi } from "@/lib/types";

type RouteContext = { params: Promise<Record<string, string>> };

async function findProduct(productId: string) {
  // Try to find by ID or slug
  const result = await db
    .select()
    .from(products)
    .where(or(eq(products.id, productId), eq(products.slug, productId)))
    .limit(1);

  return result[0] || null;
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const { productId } = await context.params;
    const product = await findProduct(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: mapProductToApi(product) });
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

          // Check if product exists
          const existingResult = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

          if (!existingResult[0]) {
            return NextResponse.json(
              { error: "Product not found" },
              { status: 404 }
            );
          }

          const updates: Partial<typeof products.$inferInsert> = {
            updatedAt: new Date(),
          };

          if (body.name !== undefined) updates.name = body.name;
          if (body.description !== undefined) updates.description = body.description;
          if (body.price !== undefined) updates.price = body.price;
          if (body.currency !== undefined) updates.currency = body.currency;
          if (body.images !== undefined) updates.images = JSON.stringify(body.images);
          if (body.category !== undefined) updates.category = body.category;
          if (body.stock !== undefined) updates.stock = body.stock;
          if (body.isActive !== undefined) updates.isActive = body.isActive;

          await db.update(products).set(updates).where(eq(products.id, productId));

          const updatedProductResult = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

          return NextResponse.json({ product: mapProductToApi(updatedProductResult[0]) });
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

        // Check if product exists
        const existingResult = await db
          .select()
          .from(products)
          .where(eq(products.id, productId))
          .limit(1);

        if (!existingResult[0]) {
          return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
          );
        }

        // Soft delete
        await db
          .update(products)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(products.id, productId));

        return NextResponse.json({ message: "Product deleted" });
      } catch (error) {
        return errorResponse(error);
      }
    }
  )
);
