"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import CartItemRow from "@/components/CartItemRow";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>
          {items.length > 0 && (
            <p className="text-sm text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Your cart is empty"
              description="Browse our products and add items to your cart."
              actionLabel="Browse Products"
              actionHref="/products"
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Proceed to Checkout
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
