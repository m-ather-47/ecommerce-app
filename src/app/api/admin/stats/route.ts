import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

export const GET = withAuth(
  withRole("admin")(async (_req: AuthenticatedRequest) => {
    await dbConnect();

    const [
      totalOrders,
      revenueResult,
      totalProducts,
      totalUsers,
      lowStockCount,
      ordersByStatus,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const stats = {
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      totalProducts,
      totalUsers,
      lowStockCount,
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item._id,
        count: item.count,
      })),
    };

    return NextResponse.json(stats);
  })
);
