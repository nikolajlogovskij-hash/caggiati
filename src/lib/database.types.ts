export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          category_id: number | null;
          price_cents: number;
          old_price_cents: number | null;
          currency: string;
          in_stock: boolean;
          stock_quantity: number;
          material: string | null;
          weight_grams: number | null;
          dimensions: string | null;
          sku: string | null;
          sort_order: number;
          is_featured: boolean;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          category_id?: number | null;
          price_cents?: number;
          old_price_cents?: number | null;
          currency?: string;
          in_stock?: boolean;
          stock_quantity?: number;
          material?: string | null;
          weight_grams?: number | null;
          dimensions?: string | null;
          sku?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          category_id?: number | null;
          price_cents?: number;
          old_price_cents?: number | null;
          currency?: string;
          in_stock?: boolean;
          stock_quantity?: number;
          material?: string | null;
          weight_grams?: number | null;
          dimensions?: string | null;
          sku?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: number;
          product_id: number;
          url: string;
          alt: string | null;
          sort_order: number;
          is_main: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          url: string;
          alt?: string | null;
          sort_order?: number;
          is_main?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          url?: string;
          alt?: string | null;
          sort_order?: number;
          is_main?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string;
          role: string;
          consent_pd: boolean;
          consent_oferta: boolean;
          consent_disclaimer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          role?: string;
          consent_pd?: boolean;
          consent_oferta?: boolean;
          consent_disclaimer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string;
          role?: string;
          consent_pd?: boolean;
          consent_oferta?: boolean;
          consent_disclaimer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          status: string;
          total_cents: number;
          currency: string;
          full_name: string;
          phone: string;
          email: string | null;
          city: string;
          address: string;
          delivery_method: string | null;
          payment_method: string | null;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          status?: string;
          total_cents?: number;
          currency?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          city: string;
          address: string;
          delivery_method?: string | null;
          payment_method?: string | null;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          status?: string;
          total_cents?: number;
          currency?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          city?: string;
          address?: string;
          delivery_method?: string | null;
          payment_method?: string | null;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          product_name: string;
          price_cents: number;
          quantity: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: number;
          product_name: string;
          price_cents: number;
          quantity?: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: number;
          product_name?: string;
          price_cents?: number;
          quantity?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          rating: number;
          comment: string | null;
          author_name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          user_id: string;
          rating: number;
          comment?: string | null;
          author_name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          author_name?: string;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: number;
          full_name: string;
          phone: string;
          email: string | null;
          message: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          phone: string;
          email?: string | null;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          phone?: string;
          email?: string | null;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      discounts: {
        Row: {
          id: number;
          code: string;
          description: string | null;
          discount_percent: number | null;
          discount_cents: number;
          min_order_cents: number;
          starts_at: string | null;
          ends_at: string | null;
          usage_limit: number | null;
          used_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          description?: string | null;
          discount_percent?: number | null;
          discount_cents?: number;
          min_order_cents?: number;
          starts_at?: string | null;
          ends_at?: string | null;
          usage_limit?: number | null;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          description?: string | null;
          discount_percent?: number | null;
          discount_cents?: number;
          min_order_cents?: number;
          starts_at?: string | null;
          ends_at?: string | null;
          usage_limit?: number | null;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: number;
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          key?: string;
          value?: string | null;
          updated_at?: string;
        };
      };
      seo_meta: {
        Row: {
          id: number;
          entity_type: string;
          entity_id: number | null;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string | null;
          og_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          entity_type: string;
          entity_id?: number | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          entity_type?: string;
          entity_id?: number | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];