import Link from "next/link";
import { getAdminStats } from "@/lib/admin-data";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/OrderStatusBadge";

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
  });
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
        />
        <StatCard title="Total Products" value={stats.totalProducts} />
        <Link href="/admin/inventory" className="block">
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            subtitle="Click to view"
          />
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No orders yet
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {order.orderNumber}
                      </Link>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
