import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { updateUserSchema } from "@/lib/schemas/user.schema";
import { errorResponse } from "@/lib/errors";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { mapUserToApi } from "@/lib/types";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  return NextResponse.json({ user: mapUserToApi(req.user) });
});

export const PATCH = withAuth(
  withValidation(updateUserSchema)(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();

      const updates: Partial<typeof users.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (body.name !== undefined) updates.name = body.name;
      if (body.phone !== undefined) updates.phone = body.phone;
      if (body.shippingAddress !== undefined) {
        updates.shippingAddress = JSON.stringify(body.shippingAddress);
      }

      await db.update(users).set(updates).where(eq(users.id, req.user.id));

      // Fetch updated user
      const updatedUserResult = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.id))
        .limit(1);

      return NextResponse.json({ user: mapUserToApi(updatedUserResult[0]) });
    } catch (error) {
      return errorResponse(error);
    }
  })
);
