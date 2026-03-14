import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { withRole } from "@/lib/middleware/requireRole";
import { withValidation } from "@/lib/middleware/validate";
import { adminUpdateUserSchema } from "@/lib/schemas/user.schema";
import { errorResponse } from "@/lib/errors";
import User from "@/lib/models/User";

type RouteContext = { params: Promise<Record<string, string>> };

export const GET = withAuth(
  withRole("admin")(async (_req, context: RouteContext) => {
    try {
      const { userId } = await context.params;
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user });
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

        const user = await User.findByIdAndUpdate(userId, body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ user });
      } catch (error) {
        return errorResponse(error);
      }
    })
  )
);
