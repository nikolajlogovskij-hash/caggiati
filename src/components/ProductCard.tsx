"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/format";
import type { ProductWithImages } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithImages;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: ProductWithImages) => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  const mainImage =
    product.images?.find((i) => i.is_main) || product.images?.[0];
  const hasDiscount =
    product.old_price_cents && product.old_price_cents > product.price_cents;

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!product.in_stock && (
            <Badge variant="default" className="bg-muted/90 backdrop-blur-sm">
              Нет в наличии
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-red-500 text-white">
              -{Math.round(
                ((product.old_price_cents! - product.price_cents) /
                  product.old_price_cents!) *
                  100
              )}
              %
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-primary text-primary-foreground">Хит</Badge>
          )}
        </div>

        {/* Favorite */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(product.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    isFavorite ? "text-red-500" : "text-muted-foreground"
                  }
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>

      {/* Content */}
      <CardContent className="flex-1 pt-4">
        {product.category && (
          <Link
            href={`/catalog?category=${product.category.slug}`}
            className="text-xs text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        <Link href={`/product/${product.slug}`} className="block mt-1">
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.material && (
          <p className="text-xs text-muted-foreground mt-1">{product.material}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price_cents)}
          </span>
          {product.old_price_cents && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.old_price_cents)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        <Button
          className="w-full"
          disabled={!product.in_stock}
          onClick={() => onAddToCart(product)}
          variant={product.in_stock ? "default" : "outline"}
        >
          {product.in_stock ? "В корзину" : "Нет в наличии"}
        </Button>
      </CardFooter>
    </Card>
  );
}