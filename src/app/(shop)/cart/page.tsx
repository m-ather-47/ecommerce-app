"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCart, updateCartItem, removeCartItem } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Cart } from "@/lib/types";
import CartItemRow from "@/components/CartItemRow";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (err) {
      if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
        router.push("/auth/sign-in");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const data = await updateCartItem(itemId, quantity);
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }

  async function handleRemove(itemId: string) {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const data = await removeCartItem(itemId);
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={() => {
              setError(null);
              fetchCart();
            }}
            className="ml-2 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add items to your cart."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              {items.map((item) => (
                <CartItemRow
                  key={item._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  isUpdating={updatingItems.has(item._id)}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-gray-600">
                  Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
