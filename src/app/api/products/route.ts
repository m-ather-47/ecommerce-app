import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { createProductSchema } from "@/lib/schemas/product.schema";
import { errorResponse } from "@/lib/errors";
import { db, products } from "@/lib/db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { generateId } from "@/lib/db/utils";
import { mapProductToApi } from "@/lib/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";

    const conditions = [eq(products.isActive, true)];

    if (q) {
      const searchTerm = `%${q}%`;
      conditions.push(
        sql`(${products.name} LIKE ${searchTerm} OR ${products.description} LIKE ${searchTerm} OR ${products.category} LIKE ${searchTerm})`
      );
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    let orderBy;
    if (sort === "price_asc") orderBy = asc(products.price);
    else if (sort === "price_desc") orderBy = desc(products.price);
    else orderBy = desc(products.createdAt);

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const [productResults, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(products)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      products: productResults.map(mapProductToApi),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export const POST = withAuth(
  withRole("admin")(
    withValidation(createProductSchema)(
      async (req: AuthenticatedRequest) => {
        try {
          const body = await req.json();

          let slug = slugify(body.name);

          // Check for existing slug
          const existingResult = await db
            .select()
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

          if (existingResult[0]) {
            slug = `${slug}-${Date.now()}`;
          }

          const productId = generateId();
          const now = new Date();

          await db.insert(products).values({
            id: productId,
            name: body.name,
            slug,
            description: body.description,
            price: body.price,
            currency: body.currency || "usd",
            images: body.images ? JSON.stringify(body.images) : null,
            category: body.category,
            stock: body.stock || 0,
            isActive: body.isActive !== false,
            createdAt: now,
            updatedAt: now,
          });

          const productResult = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

          return NextResponse.json(
            { product: mapProductToApi(productResult[0]) },
            { status: 201 }
          );
        } catch (error) {
          return errorResponse(error);
        }
      }
    )
  )
);
