"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Store
          </Link>
          <div className="hidden gap-6 md:flex">
            <NavLink href="/products" current={pathname}>
              Products
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink href="/cart" current={pathname}>
                Cart
              </NavLink>
              <NavLink href="/orders" current={pathname}>
                Orders
              </NavLink>
              <NavLink href="/account" current={pathname}>
                Account
              </NavLink>
              <button
                onClick={() => authClient.signOut()}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const isActive = current === href || current.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`text-sm font-medium ${
        isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}
