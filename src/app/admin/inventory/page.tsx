import Link from "next/link";
import { getAdminProducts } from "@/lib/admin-data";
import StockBadge from "@/components/admin/StockBadge";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

export default async function InventoryPage() {
  const { products } = await getAdminProducts({
    limit: 50,
    stockStatus: "low",
  });

  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Alerts</h1>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all products
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-white">
          <div className="border-b border-red-200 bg-red-50 px-6 py-4">
            <h2 className="font-semibold text-red-800">
              Out of Stock ({outOfStock.length})
            </h2>
          </div>
          {outOfStock.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No products out of stock
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {outOfStock.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category} - {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StockBadge stock={product.stock} />
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-yellow-200 bg-white">
          <div className="border-b border-yellow-200 bg-yellow-50 px-6 py-4">
            <h2 className="font-semibold text-yellow-800">
              Low Stock ({lowStock.length})
            </h2>
          </div>
          {lowStock.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No products with low stock
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lowStock.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category} - {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StockBadge stock={product.stock} />
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
