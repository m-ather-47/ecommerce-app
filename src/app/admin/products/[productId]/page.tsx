import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin-data";
import { getCategories } from "@/lib/data";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { productId } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(productId),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
