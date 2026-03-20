"use client";

import Link from "next/link";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = (product.price / 100).toFixed(2);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {product.images.length > 0 ? (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Second image on hover */}
            {product.images.length > 1 && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            Sold Out
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full rounded-full bg-black py-3 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Quick View
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 backdrop-blur-sm transition-all hover:text-red-500 group-hover:opacity-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {product.category}
        </p>
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-black">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-gray-900">${priceDisplay}</p>
      </div>
    </Link>
  );
}
