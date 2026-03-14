"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, Pagination } from "@/lib/types";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import EmptyState from "@/components/EmptyState";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getOrders(page, 10);
        setOrders(data.orders);
        setPagination(data.pagination);
      } catch (err) {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.push("/auth/sign-in");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, router]);

  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              {page > 1 ? (
                <Link
                  href={`/orders?page=${page - 1}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-300">
                  Previous
                </span>
              )}
              <span className="text-sm text-gray-600">
                Page {page} of {pagination.pages}
              </span>
              {page < pagination.pages ? (
                <Link
                  href={`/orders?page=${page + 1}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-300">
                  Next
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <Suspense
        fallback={
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        }
      >
        <OrdersContent />
      </Suspense>
    </div>
  );
}
