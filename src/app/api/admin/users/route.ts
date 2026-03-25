import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { db, users } from "@/lib/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { mapUserToApi } from "@/lib/types";

export const GET = withAuth(
  withRole("admin")(async (req: AuthenticatedRequest) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const search = searchParams.get("q");
    const role = searchParams.get("role");

    const conditions = [];

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        sql`(${users.email} LIKE ${searchTerm} OR ${users.name} LIKE ${searchTerm})`
      );
    }

    if (role) {
      conditions.push(eq(users.role, role as "customer" | "admin"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [userResults, countResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`COUNT(*)` }).from(users).where(whereClause),
    ]);

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      users: userResults.map(mapUserToApi),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);
