"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, getProfile, updateProfile, createCheckout } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Cart, UserProfile } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [cartData, userData] = await Promise.all([
          getCart(),
          getProfile(),
        ]);

        if (!cartData.cart?.items?.length) {
          router.push("/cart");
          return;
        }

        setCart(cartData.cart);
        setUser(userData.user);

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
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.push("/auth/sign-in");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load checkout");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.postalCode || !form.country) {
      setError("Please fill in all shipping address fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateProfile({ shippingAddress: form });
      const checkout = await createCheckout();
      window.location.href = checkout.purchaseUrl;
    } catch (err) {
      setSubmitting(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Checkout failed. Please try again.");
      }
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
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
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Shipping Address
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={form.street}
                  onChange={(e) =>
                    setForm({ ...form, street: e.target.value })
                  }
                  className="input-field mt-1"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="input-field mt-1"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    className="input-field mt-1"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    className="input-field mt-1"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="input-field mt-1"
                    placeholder="US"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                You will be redirected to Whop for secure payment
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
