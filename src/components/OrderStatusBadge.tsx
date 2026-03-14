import { getStatusColor, getStatusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
