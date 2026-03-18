"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedTransitions = VALID_TRANSITIONS[currentStatus];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!confirm(`Change status to "${statusLabels[newStatus]}"?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (allowedTransitions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No status changes available
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {allowedTransitions.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={loading}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
              status === "cancelled"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {loading ? "..." : `Mark as ${statusLabels[status]}`}
          </button>
        ))}
      </div>
    </div>
  );
}
