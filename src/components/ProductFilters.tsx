"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProductFiltersProps {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
}

export default function ProductFilters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery || "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setQuery(currentQuery || "");
  }, [currentQuery]);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/products?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateParams({ q: value || undefined });
    }, 300);
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {query && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={currentCategory || ""}
            onChange={(e) => updateParams({ category: e.target.value || undefined })}
            className="appearance-none rounded-full border border-gray-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-gray-900 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={currentSort || ""}
            onChange={(e) => updateParams({ sort: e.target.value || undefined })}
            className="appearance-none rounded-full border border-gray-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-gray-900 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:w-48"
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
