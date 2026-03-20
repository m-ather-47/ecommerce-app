import { Suspense } from "react";
import Link from "next/link";
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

  const showHero = !q && !category && page === 1;

  return (
    <>
      {/* Hero Section */}
      {showHero && (
        <section className="relative overflow-hidden bg-gray-100">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid min-h-[500px] items-center gap-8 py-12 lg:grid-cols-2 lg:py-0">
              <div className="order-2 lg:order-1">
                <span className="inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white">
                  New Collection
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Spring Summer
                  <br />
                  <span className="text-gray-500">2026</span>
                </h1>
                <p className="mt-6 max-w-lg text-lg text-gray-600">
                  Discover our latest collection of premium fashion pieces designed
                  for the modern individual who values style and quality.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Shop Now
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/products?category=Women"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    Women&apos;s Collection
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000"
                      alt="Spring Collection"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl">
                    <p className="text-xs font-medium text-gray-500 uppercase">Up to</p>
                    <p className="text-3xl font-bold text-gray-900">40% Off</p>
                    <p className="text-xs text-gray-500">Selected Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Cards - Only on homepage without filters */}
      {showHero && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="mt-2 text-gray-600">Find exactly what you&apos;re looking for</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/products?category=Men"
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <div className="aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=600"
                    alt="Men's Collection"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">Men</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      Shop Now
                      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/products?category=Women"
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <div className="aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600"
                    alt="Women's Collection"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">Women</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      Shop Now
                      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/products?category=Accessories"
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <div className="aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600"
                    alt="Accessories"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">Accessories</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      Shop Now
                      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/products?category=Footwear"
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <div className="aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"
                    alt="Footwear"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">Footwear</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                      Shop Now
                      <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className={showHero ? "bg-gray-50 py-16" : "py-8"}>
        <div className="mx-auto max-w-7xl px-4">
          {showHero && (
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600">Handpicked favorites just for you</p>
            </div>
          )}

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
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
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
        </div>
      </section>

      {/* Features Section */}
      {showHero && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="mt-1 text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                  <p className="mt-1 text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="mt-1 text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                  <p className="mt-1 text-sm text-gray-600">Crafted with care</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
