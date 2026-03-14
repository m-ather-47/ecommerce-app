import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { errorResponse } from "@/lib/errors";
import Product from "@/lib/models/Product";

export const GET = withAuth(
  withRole("admin")(async (req: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
      const skip = (page - 1) * limit;
      const stockBelow = searchParams.get("stockBelow");
      const outOfStock = searchParams.get("outOfStock");
      const category = searchParams.get("category");

      const filter: Record<string, unknown> = {};

      if (outOfStock === "true") {
        filter.stock = 0;
      } else if (stockBelow) {
        filter.stock = { $lt: parseInt(stockBelow) };
      }

      if (category) {
        filter.category = category;
      }

      const [products, total] = await Promise.all([
        Product.find(filter)
          .select("name slug category stock price isActive updatedAt")
          .sort({ stock: 1 })
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter),
      ]);

      return NextResponse.json({
        products,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      return errorResponse(error);
    }
  })
);
