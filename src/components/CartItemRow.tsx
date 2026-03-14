"use client";

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
    <div className="flex items-center gap-4 border-b border-gray-100 py-4 last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          disabled={isUpdating}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right">
        <p className="font-medium text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <button
        onClick={() => onRemove(item._id)}
        disabled={isUpdating}
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
