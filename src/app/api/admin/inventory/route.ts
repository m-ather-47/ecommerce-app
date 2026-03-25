import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { errorResponse } from "@/lib/errors";
import { db, products } from "@/lib/db";
import { eq, and, lt, asc, sql } from "drizzle-orm";

export const GET = withAuth(
  withRole("admin")(async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
      const offset = (page - 1) * limit;
      const stockBelow = searchParams.get("stockBelow");
      const outOfStock = searchParams.get("outOfStock");
      const category = searchParams.get("category");

      const conditions = [];

      if (outOfStock === "true") {
        conditions.push(eq(products.stock, 0));
      } else if (stockBelow) {
        conditions.push(lt(products.stock, parseInt(stockBelow)));
      }

      if (category) {
        conditions.push(eq(products.category, category));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [productResults, countResult] = await Promise.all([
        db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            category: products.category,
            stock: products.stock,
            price: products.price,
            isActive: products.isActive,
            updatedAt: products.updatedAt,
          })
          .from(products)
          .where(whereClause)
          .orderBy(asc(products.stock))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(products)
          .where(whereClause),
      ]);

      const total = countResult[0]?.count || 0;

      // Map to API format
      const mappedProducts = productResults.map((p) => ({
        _id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        stock: p.stock,
        price: p.price,
        isActive: p.isActive,
        updatedAt: p.updatedAt.toISOString(),
      }));

      return NextResponse.json({
        products: mappedProducts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      return errorResponse(error);
    }
  })
);
