import Link from "next/link";
import { getCategories } from "@/lib/data";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
