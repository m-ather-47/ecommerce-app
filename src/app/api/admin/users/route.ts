import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export const GET = withAuth(
  withRole("admin")(async (req: AuthenticatedRequest) => {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const search = searchParams.get("q");
    const role = searchParams.get("role");

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);
