"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/store/cart-context";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const supabase = createClient();
  const { profile } = useAuth();
  const { items, itemCount, totalCents, clearCart } = useCart();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [city, setCity] = useState(profile?.city || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Заказ оформлен!</h1>
        <p className="text-muted-foreground mb-6">
          Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для
          уточнения деталей доставки.
        </p>
        <Link href="/">
          <Button>На главную</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-wider">
          Оформление заказа
        </h1>
        <p className="text-muted-foreground mb-6">Корзина пуста</p>
        <Link href="/catalog">
          <Button>Перейти в каталог</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userId = profile?.id || null;

      if (!fullName || !phone || !city || !address || !delivery || !payment) {
        setError("Заполните все обязательные поля");
        setLoading(false);
        return;
      }

      // 1. Создаём заказ
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          full_name: fullName,
          phone,
          email: email || null,
          city,
          address,
          delivery_method: delivery,
          payment_method: payment,
          comment: comment || null,
          total_cents: totalCents,
        })
        .select("id")
        .single();

      if (orderError || !order) {
        setError("Ошибка оформления заказа. Попробуйте позже.");
        setLoading(false);
        return;
      }

      // 2. Создаём позиции заказа
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price_cents: item.product.price_cents,
        quantity: item.quantity,
        image_url: item.product.images?.[0]?.url || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        setError("Ошибка при сохранении позиций заказа");
        setLoading(false);
        return;
      }

      clearCart();
      setSuccess(true);
    } catch {
      setError("Неизвестная ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-wider">
        Оформление заказа
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold mb-4">Контактные данные</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkoutName">ФИО *</Label>
                  <Input
                    id="checkoutName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkoutPhone">Телефон *</Label>
                  <Input
                    id="checkoutPhone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checkoutCity">Город *</Label>
                  <Input
                    id="checkoutCity"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Минск, Москва, ..."
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="checkoutEmail">Email</Label>
                  <Input
                    id="checkoutEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-bold mb-4">Доставка</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="checkoutAddress">Адрес доставки *</Label>
                  <Textarea
                    id="checkoutAddress"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={2}
                    placeholder="Улица, дом, квартира"
                  />
                </div>
                <div>
                  <Label>Способ доставки *</Label>
                  <Select value={delivery} onValueChange={(v) => setDelivery(v ?? "")} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ доставки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minsk">
                        Доставка по Минску
                      </SelectItem>
                      <SelectItem value="belarus">
                        Доставка по Беларуси
                      </SelectItem>
                      <SelectItem value="russia">
                        Доставка в Россию
                      </SelectItem>
                      <SelectItem value="pickup">Самовывоз</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-bold mb-4">Оплата</h2>
              <div>
                <Label>Способ оплаты *</Label>
                <Select value={payment} onValueChange={(v) => setPayment(v ?? "")} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите способ оплаты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Банковская карта</SelectItem>
                    <SelectItem value="cash">
                      Наложенный платеж
                    </SelectItem>
                    <SelectItem value="invoice">
                      Безналичный расчет (для юр. лиц)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-bold mb-4">Комментарий</h2>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Дополнительная информация к заказу"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="p-6 border border-border rounded-lg sticky top-24">
              <h2 className="text-lg font-bold mb-4">Ваш заказ</h2>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="truncate max-w-[180px]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.product.price_cents * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={loading}
              >
                {loading ? "Оформление..." : "Подтвердить заказ"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Нажимая кнопку, вы соглашаетесь с условиями обработки
                персональных данных
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}