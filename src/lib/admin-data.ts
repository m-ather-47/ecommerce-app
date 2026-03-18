import "server-only";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import type { Product as ProductType, Order as OrderType, UserProfile, Pagination } from "@/lib/types";

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
  recentOrders: OrderType[];
}

export async function getAdminStats(): Promise<AdminStats> {
  await dbConnect();

  const [
    totalOrders,
    revenueResult,
    totalProducts,
    totalUsers,
    lowStockCount,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
    Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalOrders,
    totalRevenue: revenueResult[0]?.total || 0,
    totalProducts,
    totalUsers,
    lowStockCount,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
  };
}

interface GetAdminProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  stockStatus?: "all" | "in" | "low" | "out";
  q?: string;
}

export async function getAdminProducts(
  params: GetAdminProductsParams = {}
): Promise<{ products: ProductType[]; pagination: Pagination }> {
  await dbConnect();

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (params.q) filter.$text = { $search: params.q };
  if (params.category) filter.category = params.category;

  if (params.stockStatus === "out") {
    filter.stock = 0;
  } else if (params.stockStatus === "low") {
    filter.stock = { $gt: 0, $lt: 10 };
  } else if (params.stockStatus === "in") {
    filter.stock = { $gte: 10 };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
}

export async function getAdminOrders(
  params: GetAdminOrdersParams = {}
): Promise<{ orders: OrderType[]; pagination: Pagination }> {
  await dbConnect();

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (params.status) filter.status = params.status;
  if (params.q) filter.orderNumber = { $regex: params.q, $options: "i" };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  q?: string;
}

export async function getAdminUsers(
  params: GetAdminUsersParams = {}
): Promise<{ users: UserProfile[]; pagination: Pagination }> {
  await dbConnect();

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (params.role) filter.role = params.role;
  if (params.q) {
    filter.$or = [
      { email: { $regex: params.q, $options: "i" } },
      { name: { $regex: params.q, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return {
    users: JSON.parse(JSON.stringify(users)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getAdminProduct(id: string): Promise<ProductType | null> {
  await dbConnect();
  const product = await Product.findById(id).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getAdminOrder(id: string): Promise<OrderType | null> {
  await dbConnect();
  const order = await Order.findById(id).lean();
  return order ? JSON.parse(JSON.stringify(order)) : null;
}

export async function getAdminUser(id: string): Promise<UserProfile | null> {
  await dbConnect();
  const user = await User.findById(id).lean();
  return user ? JSON.parse(JSON.stringify(user)) : null;
}
