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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input-field"
        />
      </div>
      <select
        value={currentCategory || ""}
        onChange={(e) => updateParams({ category: e.target.value || undefined })}
        className="input-field sm:w-48"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={currentSort || ""}
        onChange={(e) => updateParams({ sort: e.target.value || undefined })}
        className="input-field sm:w-48"
      >
        <option value="">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
