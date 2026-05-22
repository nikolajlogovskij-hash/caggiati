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
  is_visible: boolean;
  stock_quantity: number;
  material: string | null;
  weight_grams: number | null;
  dimensions: string | null;
  sku: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
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
  role: "customer" | "admin";
  consent_pd: boolean;
  consent_oferta: boolean;
  consent_disclaimer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: string | null;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
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

export interface Discount {
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
}

export interface ContactMessage {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CartItem {
  product: ProductWithImages;
  quantity: number;
}

export interface SeoMeta {
  id: number;
  entity_type: string;
  entity_id: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает подтверждения",
  confirmed: "Подтверждён",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const SHIPPING_COST = 700; // BYN в копейках (7 BYN)

export const CITIES_DELIVERY = [
  "Минск",
  "Гомель",
  "Могилёв",
  "Витебск",
  "Гродно",
  "Брест",
  "Борисов",
  "Бобруйск",
  "Барановичи",
  "Пинск",
  "Орша",
  "Мозырь",
  "Солигорск",
  "Новополоцк",
  "Лида",
  "Молодечно",
  "Полоцк",
  "Жлобин",
  "Светлогорск",
  "Речица",
  "Слуцк",
  "Кобрин",
  "Волковыск",
  "Сморгонь",
  "Горки",
  "Калинковичи",
  "Волгоград",
  "Санкт-Петербург",
  "Москва",
  "Казань",
  "Нижний-Новгород",
  "Ростов-на-Дону",
  "Екатеринбург",
  "Краснодар",
  "Новосибирск",
  "Воронеж",
  "Саратов",
  "Уфа",
  "Челябинск",
  "Калининград",
  "Псков",
  "Смоленск",
];