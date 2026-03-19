"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface HomeFiltersProps {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
  totalProducts: number;
}

export default function HomeFilters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
  totalProducts,
}: HomeFiltersProps) {
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
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
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
      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams({ category: undefined })}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !currentCategory
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              currentCategory === cat
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort & Results Count */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{totalProducts}</span>{" "}
          product{totalProducts !== 1 ? "s" : ""}
          {currentQuery && (
            <span>
              {" "}
              for &quot;<span className="font-medium">{currentQuery}</span>
              &quot;
            </span>
          )}
        </p>
        <select
          value={currentSort || ""}
          onChange={(e) => updateParams({ sort: e.target.value || undefined })}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">Sort by: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
