import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product, Category, ProductImage } from "@/types/database";

export interface ProductDimensions {
  id: number;
  product_id: number;
  width: number | null;
  height: number | null;
  depth: number | null;
  diameter: number | null;
  unit: string | null;
  weight_grams: number | null;
  material: string | null;
  finish: string | null;
  created_at: string;
}

export type ProductRow = Product & {
  category?: Category | null;
  images?: ProductImage[] | null;
  dimensions?: ProductDimensions | null;
};

export type CategoryRow = Category;

/**
 * Get all categories.
 */
export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Get a single category by slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRow | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to fetch category:", error.message);
    return null;
  }

  return data;
}

/**
 * Get products, optionally filtered by category slug.
 */
export async function getProducts(
  categorySlug?: string,
  options?: { limit?: number }
): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), dimensions:product_dimensions(*)")
    .order("created_at", { ascending: false });

  if (categorySlug) {
    // Join through categories
    query = query.eq("categories.slug", categorySlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data as unknown as ProductRow[]) ?? [];
}

/**
 * Get a single product by slug.
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductRow | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), dimensions:product_dimensions(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to fetch product:", error.message);
    return null;
  }

  return data as unknown as ProductRow | null;
}

/**
 * Get featured products (first 6).
 */
export async function getFeaturedProducts(): Promise<ProductRow[]> {
  return getProducts(undefined, { limit: 6 });
}