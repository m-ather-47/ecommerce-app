import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { errorResponse } from "@/lib/errors";
import Order from "@/lib/models/Order";

type RouteContext = { params: Promise<Record<string, string>> };

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const isAdmin = req.user.role === "admin";
    const filter: Record<string, unknown> = {};

    if (!isAdmin) {
      filter.userId = req.user._id;
    } else {
      const userId = searchParams.get("userId");
      if (userId) filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(error);
  }
});
