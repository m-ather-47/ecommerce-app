import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";
import { withValidation } from "@/lib/middleware/validate";
import { updateUserSchema } from "@/lib/schemas/user.schema";
import { errorResponse } from "@/lib/errors";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  return NextResponse.json({ user: req.user });
});

export const PATCH = withAuth(
  withValidation(updateUserSchema)(async (req: AuthenticatedRequest) => {
    try {
      const body = await req.json();
      const user = req.user;

      if (body.name !== undefined) user.name = body.name;
      if (body.phone !== undefined) user.phone = body.phone;
      if (body.shippingAddress !== undefined)
        user.shippingAddress = body.shippingAddress;

      await user.save();
      return NextResponse.json({ user });
    } catch (error) {
      return errorResponse(error);
    }
  })
);
