"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/store/cart-context";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductWithImages } from "@/lib/types";

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const supabase = createClient();
  const { profile } = useAuth();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(profile?.id ?? null);

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<
    { id: number; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // Build count query
    let countQuery = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_visible", true);

    if (debouncedSearch) {
      countQuery = countQuery.or(
        `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`
      );
    }

    if (categoryFilter) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categoryFilter)
        .single();
      if (catData) {
        countQuery = countQuery.eq("category_id", catData.id);
      }
    }

    if (priceMin) {
      countQuery = countQuery.gte("price_cents", Math.round(parseFloat(priceMin) * 100));
    }
    if (priceMax) {
      countQuery = countQuery.lte("price_cents", Math.round(parseFloat(priceMax) * 100));
    }

    const { count } = await countQuery;
    setTotalCount(count ?? 0);
    setHasMore((page + 1) * PAGE_SIZE < (count ?? 0));

    // Build data query
    let query = supabase
      .from("products")
      .select(
        "*, images:product_images(*), category:categories(id, name, slug)"
      )
      .eq("is_visible", true);

    if (debouncedSearch) {
      query = query.or(
        `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`
      );
    }

    if (categoryFilter) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categoryFilter)
        .single();
      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    }

    if (priceMin) {
      query = query.gte("price_cents", Math.round(parseFloat(priceMin) * 100));
    }
    if (priceMax) {
      query = query.lte("price_cents", Math.round(parseFloat(priceMax) * 100));
    }

    switch (sortBy) {
      case "price_asc":
        query = query.order("price_cents", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price_cents", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      case "name_desc":
        query = query.order("name", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(from, to);

    const { data } = await query;
    if (data) {
      setProducts(data as unknown as ProductWithImages[]);
    }
    setLoading(false);
  }, [supabase, debouncedSearch, categoryFilter, sortBy, priceMin, priceMax, page]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, [supabase]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    if (catParam) setCategoryFilter(catParam);
    const searchParam = params.get("search");
    if (searchParam) setSearch(searchParam);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Каталог
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap">
        <Input
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-xs"
        />
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v ?? ""); setPage(0); }}>
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              Все категории
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v ?? "date_desc"); setPage(0); }}>
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Сначала новые</SelectItem>
            <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
            <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
            <SelectItem value="name_asc">Название: А-Я</SelectItem>
            <SelectItem value="name_desc">Название: Я-А</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Цена от"
            value={priceMin}
            onChange={(e) => { setPriceMin(e.target.value); setPage(0); }}
            className="w-28"
            min="0"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Цена до"
            value={priceMax}
            onChange={(e) => { setPriceMax(e.target.value); setPage(0); }}
            className="w-28"
            min="0"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setCategoryFilter("");
            setPriceMin("");
            setPriceMax("");
            setSortBy("date_desc");
            setPage(0);
          }}
        >
          Сбросить
        </Button>
      </div>

      {/* Products count */}
      {!loading && (
        <p className="text-sm text-muted-foreground mb-4">
          Найдено товаров: {totalCount}
        </p>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Товары не найдены</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setCategoryFilter("");
              setPriceMin("");
              setPriceMax("");
              setSortBy("date_desc");
              setPage(0);
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        <>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(0)}
              >
                ««
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                «
              </Button>
              <span className="text-sm px-3">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                »
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={() => setPage(totalPages - 1)}
              >
                »»
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}