"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/use-auth";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import type { Tables } from "@/lib/database.types";

type Product = Tables<"products">;
type Order = Tables<"orders">;
type Category = Tables<"categories">;

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Обрабатывается",
  confirmed: "Подтвержден",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const { profile, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price_cents: 0,
    old_price_cents: 0,
    weight_grams: 0,
    material: "",
    sku: "",
    category_id: 0,
    in_stock: true,
    is_visible: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);

  // Order management
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!authLoading && !profile) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (!authLoading && profile && !isAdmin) {
      router.push("/");
    }
  }, [profile, authLoading, isAdmin, router]);

  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);

    const [prodRes, catRes, ordRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    if (ordRes.data) setOrders(ordRes.data);
    setLoading(false);
  }, [supabase, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price_cents: product.price_cents,
        old_price_cents: product.old_price_cents || 0,
        weight_grams: product.weight_grams || 0,
        material: product.material || "",
        sku: product.sku || "",
        category_id: product.category_id || 0,
        in_stock: product.in_stock,
        is_visible: product.is_visible,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        slug: "",
        description: "",
        price_cents: 0,
        old_price_cents: 0,
        weight_grams: 0,
        material: "",
        sku: "",
        category_id: 0,
        in_stock: true,
        is_visible: true,
      });
    }
    setProductImageUrl("");
    setShowProductDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);
      setProductImageUrl(publicUrl);
    }

    if (error) {
      alert("Ошибка загрузки изображения");
    }
    setUploadingImage(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productForm)
        .eq("id", editingProduct.id);
      if (error) {
        alert("Ошибка обновления товара");
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productForm)
        .select("id")
        .single();
      if (error) {
        alert("Ошибка создания товара");
      }

      if (data && productImageUrl) {
        await supabase.from("product_images").insert({
          product_id: data.id,
          url: productImageUrl,
          alt: productForm.name,
          sort_order: 0,
        });
      }
    }

    setShowProductDialog(false);
    loadData();
    setSavingProduct(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Удалить товар? Это действие необратимо.")) return;
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    setUpdatingOrder(true);
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setShowOrderDialog(false);
    setSelectedOrder(null);
    loadData();
    setUpdatingOrder(false);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider">
          Административная панель
        </h1>
        <Button
          variant="outline"
          onClick={() => openProductDialog()}
        >
          + Добавить товар
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Товары ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Заказы ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead>Видимость</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {formatPrice(product.price_cents)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.in_stock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {product.in_stock ? "В наличии" : "Нет"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.is_visible
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {product.is_visible ? "Да" : "Нет"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openProductDialog(product)}
                        >
                          Ред.
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{String(order.id).padStart(4, "0")}
                    </TableCell>
                    <TableCell>{order.full_name}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell>
                      {formatPrice(order.total_cents)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          ORDER_STATUS_COLORS[order.status] || "bg-gray-100"
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDialog(true);
                        }}
                      >
                        Детали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Редактировать товар" : "Новый товар"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <Label htmlFor="prodName">Название *</Label>
              <Input
                id="prodName"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-zа-яё0-9-]/g, ""),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="prodSlug">Slug *</Label>
              <Input
                id="prodSlug"
                value={productForm.slug}
                onChange={(e) =>
                  setProductForm({ ...productForm, slug: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="prodDesc">Описание</Label>
              <Textarea
                id="prodDesc"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prodPrice">Цена (коп.) *</Label>
                <Input
                  id="prodPrice"
                  type="number"
                  value={productForm.price_cents}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      price_cents: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="prodOldPrice">Старая цена (коп.)</Label>
                <Input
                  id="prodOldPrice"
                  type="number"
                  value={productForm.old_price_cents}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      old_price_cents: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prodWeight">Вес (г)</Label>
                <Input
                  id="prodWeight"
                  type="number"
                  value={productForm.weight_grams}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      weight_grams: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="prodMaterial">Материал</Label>
                <Input
                  id="prodMaterial"
                  value={productForm.material}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      material: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prodSku">Артикул</Label>
                <Input
                  id="prodSku"
                  value={productForm.sku}
                  onChange={(e) =>
                    setProductForm({ ...productForm, sku: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="prodCategory">Категория</Label>
                <Select
                  value={
                    productForm.category_id
                      ? String(productForm.category_id)
                      : ""
                  }
                  onValueChange={(v) =>
                    setProductForm({
                      ...productForm,
                      category_id: Number(v),
                    })
                  }
                >
                  <SelectTrigger id="prodCategory">
                    <SelectValue placeholder="Без категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без категории</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.in_stock}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      in_stock: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                В наличии
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.is_visible}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      is_visible: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                Видимый
              </Label>
            </div>
            <div>
              <Label>Изображение</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="text-sm text-muted-foreground mt-1">
                  Загрузка...
                </p>
              )}
              {productImageUrl && (
                <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden">
                  <Image
                    src={productImageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={savingProduct}>
              {savingProduct
                ? "Сохранение..."
                : editingProduct
                  ? "Обновить"
                  : "Создать"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Заказ #{selectedOrder && String(selectedOrder.id).padStart(4, "0")}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Информация о клиенте</h3>
                <p className="text-sm text-muted-foreground">
                  ФИО: {selectedOrder.full_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Телефон: {selectedOrder.phone}
                </p>
                {selectedOrder.email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {selectedOrder.email}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Доставка</h3>
                <p className="text-sm text-muted-foreground">
                  Адрес: {selectedOrder.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  Способ доставки: {selectedOrder.delivery_method}
                </p>
                <p className="text-sm text-muted-foreground">
                  Оплата: {selectedOrder.payment_method}
                </p>
              </div>
              {selectedOrder.comment && (
                <div>
                  <h3 className="font-semibold mb-1">Комментарий</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.comment}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Текущий статус</h3>
                <Badge
                  className={ORDER_STATUS_COLORS[selectedOrder.status] || "bg-gray-100"}
                >
                  {ORDER_STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Изменить статус</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(status) => {
                    if (status) handleUpdateOrderStatus(selectedOrder.id, status);
                  }}
                  disabled={updatingOrder}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}