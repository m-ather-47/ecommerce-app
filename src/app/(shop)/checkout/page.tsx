"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { useCart } from "@/contexts/CartContext";
import { getProfile, updateProfile, createCheckout, addToCart } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;
  const { items, total, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncingCart, setSyncingCart] = useState(false);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (sessionLoading) return;

    // If no items, redirect to cart
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // If user is logged in, load their profile
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, user, items.length, router]);

  async function loadProfile() {
    try {
      const userData = await getProfile();
      if (userData.user.shippingAddress) {
        setForm({
          street: userData.user.shippingAddress.street || "",
          city: userData.user.shippingAddress.city || "",
          state: userData.user.shippingAddress.state || "",
          postalCode: userData.user.shippingAddress.postalCode || "",
          country: userData.user.shippingAddress.country || "",
        });
      }
    } catch (err) {
      // Profile might not exist yet, that's okay
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function syncCartToServer() {
    // Add all local cart items to the server cart
    for (const item of items) {
      await addToCart(item.productId, item.quantity);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.postalCode || !form.country) {
      setError("Please fill in all shipping address fields.");
      return;
    }

    setSubmitting(true);
    setSyncingCart(true);
    setError(null);

    try {
      // Sync local cart to server
      await syncCartToServer();
      setSyncingCart(false);

      // Update shipping address and create checkout
      await updateProfile({ shippingAddress: form });
      const checkout = await createCheckout();

      // Clear local cart after successful checkout initiation
      clearCart();

      window.location.href = checkout.purchaseUrl;
    } catch (err) {
      setSubmitting(false);
      setSyncingCart(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Checkout failed. Please try again.");
      }
    }
  }

  if (sessionLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Sign in to checkout</h1>
            <p className="mt-2 text-gray-600">
              Please sign in to your account to complete your purchase.
            </p>

            {/* Cart Summary */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
              <p className="text-sm font-medium text-gray-700">Your cart ({items.length} items)</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatPrice(total)}</p>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/auth/sign-in"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Sign In
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/auth/sign-up"
                className="flex w-full items-center justify-center rounded-full border border-gray-200 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Create Account
              </Link>
            </div>

            <Link
              href="/cart"
              className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Return to cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Shipping Address */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                    1
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        State / Province
                      </label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                    2
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  You&apos;ll be redirected to our secure payment page to complete your order.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100">
                    <span className="text-[10px] font-bold text-gray-500">VISA</span>
                  </div>
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100">
                    <span className="text-[10px] font-bold text-gray-500">MC</span>
                  </div>
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100">
                    <span className="text-[10px] font-bold text-gray-500">AMEX</span>
                  </div>
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100">
                    <span className="text-[10px] font-bold text-[#003087]">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-500">Calculated at payment</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {syncingCart ? "Preparing order..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      Complete Order
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    SSL Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Buyer Protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
