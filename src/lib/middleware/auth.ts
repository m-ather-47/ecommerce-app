import { NextRequest, NextResponse } from "next/server";
import { neonAuth } from "@neondatabase/auth/next/server";
import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/lib/models/User";

export type AuthenticatedRequest = NextRequest & { user: IUser };

type RouteContext = { params: Promise<Record<string, string>> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandlerFn = (req: any, context: RouteContext) => Promise<NextResponse>;

export function withAuth(handler: AnyHandlerFn) {
  return async (req: NextRequest, context: RouteContext): Promise<NextResponse> => {
    const { session, user: authUser } = await neonAuth();

    if (!session || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let user = await User.findOne({ neonAuthId: authUser.id });
    if (!user) {
      user = await User.create({
        neonAuthId: authUser.id,
        email: authUser.email,
        name: authUser.name || authUser.email.split("@")[0],
        role: "customer",
      });
    }

    (req as AuthenticatedRequest).user = user;
    return handler(req as AuthenticatedRequest, context);
  };
}
