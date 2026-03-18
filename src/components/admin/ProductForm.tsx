"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  categories: string[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ? product.price / 100 : 0,
    currency: product?.currency || "usd",
    category: product?.category || "",
    stock: product?.stock || 0,
    images: product?.images || [],
    isActive: product?.isActive ?? true,
  });

  const [newImage, setNewImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: Math.round(formData.price * 100),
      };

      const url = product
        ? `/api/products/${product._id}`
        : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage],
      });
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input-field w-full"
            list="categories"
            required
          />
          <datalist id="categories">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field min-h-[100px] w-full"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
            }
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
            }
            className="input-field w-full"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.isActive ? "active" : "inactive"}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "active" })
            }
            className="input-field w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Images
        </label>
        <div className="space-y-2">
          {formData.images.map((img, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-gray-200 p-2"
            >
              <img
                src={img}
                alt=""
                className="h-10 w-10 rounded object-cover"
              />
              <span className="flex-1 truncate text-sm text-gray-600">
                {img}
              </span>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={addImage}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <div>
          {product && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
            >
              Delete Product
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
