"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function TestPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/cart");
      return;
    }

    async function loadOrder() {
      try {
        const data = await getOrder(orderId!);
        if (data.order.status !== "pending") {
          router.push(`/orders/${orderId}`);
          return;
        }
        setOrder(data.order);
      } catch {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId, router]);

  async function handlePayment(action: "pay" | "cancel") {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/test-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }

      if (action === "pay") {
        router.push(`/orders/${orderId}?success=true`);
      } else {
        router.push("/cart");
      }
    } catch (err) {
      setProcessing(false);
      setError(err instanceof Error ? err.message : "Payment failed");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 p-8">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-yellow-200 px-4 py-1 text-sm font-semibold text-yellow-800">
            TEST MODE
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Simulated Payment
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            This is a test payment page. No real charges will be made.
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700">Order Summary</h2>
          <p className="text-xs text-gray-500">{order.orderNumber}</p>
          <div className="mt-3 divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 text-sm">
                <span className="text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handlePayment("pay")}
            disabled={processing}
            className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Simulate Successful Payment"}
          </button>
          <button
            onClick={() => handlePayment("cancel")}
            disabled={processing}
            className="w-full rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}
