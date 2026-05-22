export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
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
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  category?: Category | null;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt: string | null;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: string | null;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_cents: number;
  currency: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  price_cents: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: string | null;
  rating: number;
  comment: string | null;
  author_name: string;
  created_at: string;
}

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}
