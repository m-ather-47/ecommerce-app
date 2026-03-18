import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export const proxy = neonAuthMiddleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/api/cart/:path*",
    "/api/checkout/:path*",
    "/api/orders/:path*",
    "/api/users/:path*",
    "/api/admin/:path*",
  ],
};
