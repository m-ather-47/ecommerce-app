import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/lib/admin-data";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getAdminOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Orders
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Items
            </h2>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Update Status
            </h2>
            <OrderStatusSelect orderId={order._id} currentStatus={order.status} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Timeline
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid</span>
                <span className="text-gray-900">{formatDate(order.paidAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipped</span>
                <span className="text-gray-900">{formatDate(order.shippedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivered</span>
                <span className="text-gray-900">{formatDate(order.deliveredAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
