import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { getProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const q = params.q || "";
  const category = params.category || "";
  const sort = params.sort || "";

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({ page, limit: 12, q: q || undefined, category: category || undefined, sort: sort || undefined }),
    getCategories(),
  ]);

  const currentSearchParams: Record<string, string> = {};
  if (q) currentSearchParams.q = q;
  if (category) currentSearchParams.category = category;
  if (sort) currentSearchParams.sort = sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Results for "${q}"` : "Products"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
        </p>
      </div>

      <Suspense>
        <ProductFilters
          categories={categories}
          currentCategory={category}
          currentSort={sort}
          currentQuery={q}
        />
      </Suspense>

      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for."
          actionLabel="Clear Filters"
          actionHref="/products"
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        basePath="/products"
        searchParams={currentSearchParams}
      />
    </div>
  );
}
