import { NextRequest, NextResponse } from "next/server";
import { neonAuth } from "@neondatabase/auth/next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/db/utils";
import type { User } from "@/lib/db/schema";

export type AuthenticatedRequest = NextRequest & { user: User };

type RouteContext = { params: Promise<Record<string, string>> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandlerFn = (req: any, context: RouteContext) => Promise<NextResponse>;

export function withAuth(handler: AnyHandlerFn) {
  return async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
    try {
      const { session, user: authUser } = await neonAuth();

      if (!session || !authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Find or create user
      let userResult = await db
        .select()
        .from(users)
        .where(eq(users.neonAuthId, authUser.id))
        .limit(1);

      let user = userResult[0];

      if (!user) {
        const newUser = {
          id: generateId(),
          neonAuthId: authUser.id,
          email: authUser.email,
          name: authUser.name || authUser.email.split("@")[0],
          role: "customer" as const,
          phone: null,
          shippingAddress: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(users).values(newUser);
        user = newUser;
      }

      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest, context);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  };
}
