"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";

export function useFavorites(userId: string | null) {
  const supabase = createClient();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites(new Set());
      return;
    }

    setLoading(true);
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (data) {
          setFavorites(new Set(data.map((f) => f.product_id)));
        }
        setLoading(false);
      });
  }, [userId, supabase]);

  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (!userId) return;

      const isFav = favorites.has(productId);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });

      if (isFav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: userId, product_id: productId });
      }
    },
    [userId, favorites, supabase]
  );

  const isFavorite = useCallback(
    (productId: number) => favorites.has(productId),
    [favorites]
  );

  return { favorites, loading, toggleFavorite, isFavorite };
}