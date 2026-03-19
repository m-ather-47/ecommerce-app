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
      {/* Product Image - Portrait Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.images.length > 0 ? (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Second image on hover if available */}
            {product.images.length > 1 && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
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
          <div className="absolute left-2 top-2 bg-black px-2 py-1 text-xs font-medium uppercase text-white">
            Sold Out
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-black/80 py-3 text-center text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Quick View
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-gray-900">${priceDisplay}</p>
      </div>
    </Link>
  );
}
