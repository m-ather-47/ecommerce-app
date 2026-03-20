"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemRowProps) {
  return (
    <div className={`flex gap-4 p-6 transition ${isUpdating ? "opacity-60" : ""}`}>
      {/* Product Image */}
      <Link
        href={`/products/${item.slug || item._id}`}
        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.slug || item._id}`}
            className="font-medium text-gray-900 hover:text-black transition line-clamp-1"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            {formatPrice(item.price)} each
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:text-gray-900 disabled:opacity-50"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:text-gray-900 disabled:opacity-50"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => onRemove(item._id)}
            disabled={isUpdating}
            className="text-sm text-gray-500 transition hover:text-red-600 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
