"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Main Navbar */}
      <div className="border-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              VOGUE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <NavLink href="/" current={pathname} exact>
              Home
            </NavLink>
            <NavLink href="/products" current={pathname}>
              Shop
            </NavLink>
            <NavLink href="/products?category=Men" current={pathname}>
              Men
            </NavLink>
            <NavLink href="/products?category=Women" current={pathname}>
              Women
            </NavLink>
            <NavLink href="/products?category=Accessories" current={pathname}>
              Accessories
            </NavLink>
            <NavLink href="/products?category=Footwear" current={pathname}>
              Footwear
            </NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <Link
              href="/"
              className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <button className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {/* Dropdown */}
                <div className="invisible absolute right-0 top-full z-50 w-48 rounded-lg border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => authClient.signOut()}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {/* Cart Badge */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <MobileNavLink
              href="/"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
              exact
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/products"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Men"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Women"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Accessories"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Accessories
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Footwear"
              current={pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Footwear
            </MobileNavLink>
            {!user && (
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 block w-full rounded-lg bg-black py-3 text-center text-sm font-medium text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
  exact = false,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const isActive = exact
    ? current === href
    : current === href || current.startsWith(href + "/") || current.startsWith(href + "?");

  return (
    <Link
      href={href}
      className={`text-sm font-medium uppercase tracking-wide transition ${
        isActive
          ? "text-black"
          : "text-gray-500 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  current,
  children,
  onClick,
  exact = false,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  onClick: () => void;
  exact?: boolean;
}) {
  const isActive = exact
    ? current === href
    : current === href || current.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm font-medium ${
        isActive
          ? "bg-gray-100 text-black"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
