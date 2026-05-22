"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useCart } from "@/lib/store/cart-context";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductWithImages } from "@/lib/types";

export default function FavoritesPage() {
  const supabase = createClient();
  const { profile } = useAuth();
  const { addItem } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites(
    profile?.id ?? null
  );
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (favorites.size === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select(
          "*, images:product_images(*), category:categories(id, name, slug)"
        )
        .in("id", Array.from(favorites));

      if (data) {
        setProducts(data as unknown as ProductWithImages[]);
      }
      setLoading(false);
    }
    load();
  }, [supabase, favorites]);

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-wider">
          Избранное
        </h1>
        <p className="text-muted-foreground mb-6">
          Войдите в аккаунт, чтобы сохранять избранные товары
        </p>
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Избранное
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">
            В избранном пока ничего нет
          </p>
          <Link href="/catalog">
            <Button className="mt-4">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}