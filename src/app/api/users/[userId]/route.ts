import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { adminUpdateUserSchema } from "@/lib/schemas/user.schema";
import { errorResponse } from "@/lib/errors";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { mapUserToApi } from "@/lib/types";

type RouteContext = { params: Promise<Record<string, string>> };

export const GET = withAuth(
  withRole("admin")(async (_req, context: RouteContext) => {
    try {
      const { userId } = await context.params;
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!userResult[0]) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user: mapUserToApi(userResult[0]) });
    } catch (error) {
      return errorResponse(error);
    }
  })
);

export const PATCH = withAuth(
  withRole("admin")(
    withValidation(adminUpdateUserSchema)(async (req, context: RouteContext) => {
      try {
        const { userId } = await context.params;
        const body = await req.json();

        const updates: Partial<typeof users.$inferInsert> = {
          updatedAt: new Date(),
        };

        if (body.name !== undefined) updates.name = body.name;
        if (body.role !== undefined) updates.role = body.role;
        if (body.phone !== undefined) updates.phone = body.phone;
        if (body.shippingAddress !== undefined) {
          updates.shippingAddress = JSON.stringify(body.shippingAddress);
        }

        await db.update(users).set(updates).where(eq(users.id, userId));

        const updatedUserResult = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!updatedUserResult[0]) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ user: mapUserToApi(updatedUserResult[0]) });
      } catch (error) {
        return errorResponse(error);
      }
    })
  )
);
