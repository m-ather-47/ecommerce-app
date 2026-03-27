import { NextRequest, NextResponse } from "next/server";
import { neonAuth } from "@neondatabase/auth/next/server";
import { db, users } from "@/lib/db/index";
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

      // Prefer Neon auth id, then reconcile by email for pre-seeded users.
      const userByAuthIdResult = await db
        .select()
        .from(users)
        .where(eq(users.neonAuthId, authUser.id))
        .limit(1);

      let user = userByAuthIdResult[0];

      if (!user) {
        const userByEmailResult = authUser.email
          ? await db
              .select()
              .from(users)
              .where(eq(users.email, authUser.email))
              .limit(1)
          : [];

        const existingByEmail = userByEmailResult[0];

        if (existingByEmail) {
          await db
            .update(users)
            .set({ neonAuthId: authUser.id, updatedAt: new Date() })
            .where(eq(users.id, existingByEmail.id));

          user = {
            ...existingByEmail,
            neonAuthId: authUser.id,
            updatedAt: new Date(),
          };
        } else {
          const email = authUser.email || `${authUser.id}@local.invalid`;
          const newUser = {
            id: generateId(),
            neonAuthId: authUser.id,
            email,
            name: authUser.name || email.split("@")[0],
            role: "customer" as const,
            phone: null,
            shippingAddress: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await db.insert(users).values(newUser);
          user = newUser;
        }
      }

      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest, context);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
  };
}
