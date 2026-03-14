"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/api";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const outOfStock = stock === 0;

  async function handleAddToCart() {
    setLoading(true);
    setMessage(null);
    try {
      await addToCart(productId, quantity);
      setMessage({ type: "success", text: "Added to cart!" });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
        router.push("/auth/sign-in");
        return;
      }
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to add to cart",
      });
    } finally {
      setLoading(false);
    }
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full rounded-lg bg-gray-300 px-6 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-12 text-center text-lg font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
