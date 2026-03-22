"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCartButton({
  productId,
  name,
  slug,
  price,
  image,
  stock,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const outOfStock = stock === 0;

  function handleAddToCart() {
    addItem({
      productId,
      name,
      slug,
      price,
      image,
    }, quantity);
    setMessage({ type: "success", text: "Added to cart!" });
    setTimeout(() => setMessage(null), 3000);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-gray-200 py-4 text-sm font-medium text-gray-500 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="inline-flex items-center rounded-full border border-gray-200">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-12 w-12 items-center justify-center text-gray-600 transition hover:text-gray-900 disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm font-medium text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            className="flex h-12 w-12 items-center justify-center text-gray-600 transition hover:text-gray-900 disabled:opacity-50"
            disabled={quantity >= stock}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Add to Cart
        </button>
        <button className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:text-red-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message.text}
        </div>
      )}
    </div>
  );
}
