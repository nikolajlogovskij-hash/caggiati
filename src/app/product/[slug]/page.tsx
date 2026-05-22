"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/store/cart-context";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatPrice, formatWeight } from "@/lib/format";
import type { ProductWithImages } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  const { profile } = useAuth();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(profile?.id ?? null);

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*), category:categories(id, name, slug)")
      .eq("slug", slug)
      .single();

    if (data) {
      setProduct(data as unknown as ProductWithImages);
    }
    setLoading(false);
  }, [supabase, slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <p className="text-muted-foreground">
          Возможно, товар был удален или перемещен.
        </p>
      </div>
    );
  }

  const images = product.images || [];
  const hasDiscount =
    product.old_price_cents && product.old_price_cents > product.price_cents;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]?.url || images[0].url}
                alt={
                  images[selectedImage]?.alt ||
                  images[0].alt ||
                  product.name
                }
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category && (
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category.name}
            </p>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.price_cents)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.old_price_cents!)}
              </span>
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
          </div>

          <div className="flex items-center gap-4">
            {product.weight_grams && (
              <span className="text-sm text-muted-foreground">
                Вес: {formatWeight(product.weight_grams)}
              </span>
            )}
            {product.material && (
              <span className="text-sm text-muted-foreground">
                Материал: {product.material}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-medium ${
                product.in_stock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.in_stock ? "В наличии" : "Нет в наличии"}
            </span>
            {product.sku && (
              <span className="text-sm text-muted-foreground">
                Артикул: {product.sku}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.in_stock}
              onClick={() => addItem(product, quantity)}
            >
              {product.in_stock ? "В корзину" : "Нет в наличии"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => toggleFavorite(product.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFavorite(product.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  isFavorite(product.id)
                    ? "text-red-500"
                    : "text-muted-foreground"
                }
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="pt-8">
            <TabsList>
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="delivery">Доставка</TabsTrigger>
            </TabsList>
            <TabsContent
              value="description"
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              {product.description || "Описание отсутствует."}
            </TabsContent>
            <TabsContent value="delivery" className="mt-4">
              <Accordion>
                <AccordionItem value="delivery-payment">
                  <AccordionTrigger>Способы доставки</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      • Доставка по Минску — 1-2 рабочих дня, стоимость
                      рассчитывается индивидуально
                    </p>
                    <p>
                      • Доставка по Беларуси (Белпочта / Европочта) — 3-7
                      рабочих дней
                    </p>
                    <p>
                      • Доставка в Россию (СДЭК / Почта России) — от 5 рабочих
                      дней
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-methods">
                  <AccordionTrigger>Способы оплаты</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>• Банковская карта (онлайн)</p>
                    <p>• Наложенный платеж (при получении)</p>
                    <p>• Безналичный расчет (для юридических лиц)</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}