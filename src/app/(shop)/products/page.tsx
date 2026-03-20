import { Suspense } from "react";
import Link from "next/link";
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
    <div className="bg-white">
      {/* Header Banner */}
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 transition hover:text-gray-900">
              Home
            </Link>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-900 font-medium">
              {category || "All Products"}
            </span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {q ? `Search results for "${q}"` : category || "All Products"}
          </h1>
          <p className="mt-2 text-gray-600">
            {pagination.total} {pagination.total === 1 ? "product" : "products"} available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Suspense>
          <ProductFilters
            categories={categories}
            currentCategory={category}
            currentSort={sort}
            currentQuery={q}
          />
        </Suspense>

        {products.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              actionHref="/products"
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
}
