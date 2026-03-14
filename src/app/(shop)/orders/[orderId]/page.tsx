"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/api";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import type { Order } from "@/lib/types";
import OrderStatusBadge from "@/components/OrderStatusBadge";

function OrderDetailContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const isSuccess = searchParams.get("success") === "true";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(isSuccess);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrder(orderId);
        setOrder(data.order);
      } catch (err) {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.push("/auth/sign-in");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error || "Order not found"}
        </div>
        <Link
          href="/orders"
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700"
        >
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Success Banner */}
      {showSuccess && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            Payment successful! Your order has been placed.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 hover:text-green-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/orders"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order Items */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <div className="mt-4 divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Order Summary
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ordered</span>
              <span className="text-gray-900">
                {formatDateTime(order.createdAt)}
              </span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="text-gray-900">
                  {formatDateTime(order.paidAt)}
                </span>
              </div>
            )}
            {order.shippedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipped</span>
                <span className="text-gray-900">
                  {formatDateTime(order.shippedAt)}
                </span>
              </div>
            )}
            {order.deliveredAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered</span>
                <span className="text-gray-900">
                  {formatDateTime(order.deliveredAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Shipping Address
          </h2>
          <div className="mt-4 text-sm text-gray-600">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
          </div>
        }
      >
        <OrderDetailContent />
      </Suspense>
    </div>
  );
}
