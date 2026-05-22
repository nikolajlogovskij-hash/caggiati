import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import type { ProductRow } from "@/lib/services/products";

interface ProductCardProps {
  product: ProductRow;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const isInStock = product.stock_quantity === null || product.stock_quantity > 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-bronze-200 transition-all duration-300 animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-bronze-50 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bronze-300">
            <span className="text-4xl font-serif">C</span>
          </div>
        )}

        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          {isInStock ? (
            <Badge variant="success">В наличии</Badge>
          ) : (
            <Badge variant="danger">Нет в наличии</Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        {product.category && (
          <p className="text-xs text-bronze-600 font-medium mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover:text-bronze-700 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-bronze-700">
            {formatPrice(product.price_cents, product.currency as "BYN" | "RUB")}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-bronze-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Подробнее <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}