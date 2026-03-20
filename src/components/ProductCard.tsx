"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const priceDisplay = (product.price / 100).toFixed(2);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
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
        {product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              disabled={added}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-medium transition ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {added ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          </div>
        )}
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
