import { NextResponse } from "next/server";
import { AuthenticatedRequest } from "./auth";

type RouteContext = { params: Promise<Record<string, string>> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandlerFn = (req: any, context: RouteContext) => Promise<NextResponse>;

export function withRole(...roles: string[]) {
  return (handler: AnyHandlerFn): AnyHandlerFn => {
    return async (req: AuthenticatedRequest, context: RouteContext) => {
      if (!roles.includes(req.user.role)) {
        return NextResponse.json(
          { error: "Forbidden: insufficient permissions" },
          { status: 403 }
        );
      }
      return handler(req, context);
    };
  };
}
