import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { createProductSchema } from "@/lib/schemas/product.schema";
import { errorResponse } from "@/lib/errors";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

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
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";

    const filter: Record<string, unknown> = { isActive: true };

    if (q) {
      filter.$text = { $search: q };
    }
    if (category) {
      filter.category = category;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
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
          const existing = await Product.findOne({ slug });
          if (existing) {
            slug = `${slug}-${Date.now()}`;
          }

          const product = await Product.create({ ...body, slug });
          return NextResponse.json({ product }, { status: 201 });
        } catch (error) {
          return errorResponse(error);
        }
      }
    )
  )
);
