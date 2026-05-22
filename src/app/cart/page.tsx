"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/store/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { profile } = useAuth();
  const { items, removeItem, updateQuantity, itemCount, totalCents } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-wider">
          Корзина
        </h1>
        <div className="py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto mb-4 text-muted-foreground"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-lg text-muted-foreground mb-6">
            Ваша корзина пуста
          </p>
          <Link href="/catalog">
            <Button>Перейти в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Корзина
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 border border-border rounded-lg"
            >
              <Link
                href={`/product/${item.product.slug}`}
                className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted"
              >
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.images[0].alt || item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.product.price_cents)}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive h-8"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.product.price_cents * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-border rounded-lg sticky top-24">
            <h2 className="text-lg font-bold mb-4">Сумма заказа</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Товары ({itemCount})
                </span>
                <span>{formatPrice(totalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доставка</span>
                <span className="text-muted-foreground">
                  Рассчитывается отдельно
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-6" size="lg">
                Оформить заказ
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">
              После оформления с вами свяжется менеджер для уточнения деталей
              доставки
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}