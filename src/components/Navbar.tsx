"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs">
          <div className="hidden sm:block">
            <span className="text-gray-300">Free shipping on orders over $50</span>
          </div>
          <div className="flex-1 text-center sm:flex-none">
            <span className="font-medium">SPRING SALE • UP TO 40% OFF</span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/orders" className="text-gray-300 hover:text-white transition">
              Track Order
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/account" className="text-gray-300 hover:text-white transition">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              VOGUE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" current={pathname} exact currentCategory={currentCategory}>
              Home
            </NavLink>
            <NavLink href="/products" current={pathname} currentCategory={currentCategory}>
              Shop All
            </NavLink>
            <NavLink href="/products?category=Men" current={pathname} currentCategory={currentCategory} category="Men">
              Men
            </NavLink>
            <NavLink href="/products?category=Women" current={pathname} currentCategory={currentCategory} category="Women">
              Women
            </NavLink>
            <NavLink href="/products?category=Accessories" current={pathname} currentCategory={currentCategory} category="Accessories">
              Accessories
            </NavLink>
            <NavLink href="/products?category=Footwear" current={pathname} currentCategory={currentCategory} category="Footwear">
              Footwear
            </NavLink>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            {/* Account */}
            {user ? (
              <div className="relative group">
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>
                {/* Dropdown */}
                <div className="invisible absolute right-0 top-full z-50 w-52 rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Orders
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => authClient.signOut()}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white lg:hidden">
          <nav className="divide-y divide-gray-100">
            <MobileNavLink
              href="/"
              current={pathname}
              currentCategory={currentCategory}
              onClick={() => setMobileMenuOpen(false)}
              exact
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/products"
              current={pathname}
              currentCategory={currentCategory}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Men"
              current={pathname}
              currentCategory={currentCategory}
              category="Men"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Women"
              current={pathname}
              currentCategory={currentCategory}
              category="Women"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Accessories"
              current={pathname}
              currentCategory={currentCategory}
              category="Accessories"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accessories
            </MobileNavLink>
            <MobileNavLink
              href="/products?category=Footwear"
              current={pathname}
              currentCategory={currentCategory}
              category="Footwear"
              onClick={() => setMobileMenuOpen(false)}
            >
              Footwear
            </MobileNavLink>
          </nav>
          <div className="p-4">
            {!user ? (
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-full bg-black py-3 text-center text-sm font-medium text-white hover:bg-gray-900 transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full border border-gray-200 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    authClient.signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 rounded-full border border-gray-200 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
  exact = false,
  currentCategory,
  category,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  exact?: boolean;
  currentCategory?: string | null;
  category?: string;
}) {
  let isActive = false;

  if (exact) {
    isActive = current === href && !currentCategory;
  } else if (category) {
    isActive = current === "/products" && currentCategory === category;
  } else if (href === "/products") {
    isActive = current === "/products" && !currentCategory;
  } else {
    isActive = current === href || current.startsWith(href + "/");
  }

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-black"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-black rounded-full" />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  current,
  children,
  onClick,
  exact = false,
  currentCategory,
  category,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  onClick: () => void;
  exact?: boolean;
  currentCategory?: string | null;
  category?: string;
}) {
  let isActive = false;

  if (exact) {
    isActive = current === href && !currentCategory;
  } else if (category) {
    isActive = current === "/products" && currentCategory === category;
  } else if (href === "/products") {
    isActive = current === "/products" && !currentCategory;
  } else {
    isActive = current === href || current.startsWith(href + "/");
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-4 text-sm font-medium transition-colors ${
        isActive
          ? "bg-gray-50 text-black"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
