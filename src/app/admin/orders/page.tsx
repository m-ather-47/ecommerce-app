import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-data";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const { orders, pagination } = await getAdminOrders({
    page,
    status: params.status,
    q: params.q,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <form className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              name="q"
              placeholder="Search order number..."
              defaultValue={params.q}
              className="input-field w-64"
            />
            <select
              name="status"
              defaultValue={params.status || ""}
              className="input-field"
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Filter
            </button>
          </form>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.items.length} item(s)
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              basePath="/admin/orders"
            />
          </div>
        )}
      </div>
    </div>
  );
}
