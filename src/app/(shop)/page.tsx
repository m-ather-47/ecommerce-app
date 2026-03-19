import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import HomeFilters from "@/components/HomeFilters";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { getProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const q = params.q || "";
  const category = params.category || "";
  const sort = params.sort || "";

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({
      page,
      limit: 12,
      q: q || undefined,
      category: category || undefined,
      sort: sort || undefined,
    }),
    getCategories(),
  ]);

  const currentSearchParams: Record<string, string> = {};
  if (q) currentSearchParams.q = q;
  if (category) currentSearchParams.category = category;
  if (sort) currentSearchParams.sort = sort;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm">
          Free Shipping on Orders Over $50 | Use Code{" "}
          <span className="font-semibold">SAVE10</span> for 10% Off
        </div>
      </div>

      {/* Hero Banner - Slim */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              New Arrivals
            </h1>
            <p className="mt-2 text-gray-300">
              Discover our latest collection of premium products
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <Suspense>
          <HomeFilters
            categories={categories}
            currentCategory={category}
            currentSort={sort}
            currentQuery={q}
            totalProducts={pagination.total}
          />
        </Suspense>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              actionHref="/"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          basePath="/"
          searchParams={currentSearchParams}
        />
      </main>

      {/* Trust Badges */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Quality Guarantee
                </p>
                <p className="text-xs text-gray-500">100% Original</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-500">On orders $50+</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-500">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500">30 Day Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
