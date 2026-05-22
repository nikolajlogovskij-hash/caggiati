"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { Button } from "@/components/ui/button";
import type { ProductWithImages } from "@/lib/types";

interface AddToCartButtonProps {
  product: ProductWithImages;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty = product.stock_quantity ?? 99;

  const increment = () => setQuantity((q) => Math.min(q + 1, maxQty));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = () => {
    addItem(product, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 mt-auto">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-600">Количество:</span>
        <div className="flex items-center border border-zinc-300 rounded-lg">
          <button
            onClick={decrement}
            disabled={disabled || quantity <= 1}
            className="p-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Уменьшить количество"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium text-zinc-900 select-none">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={disabled || quantity >= maxQty}
            className="p-2 text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Увеличить количество"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={disabled}
          className="flex-1"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {added ? "Добавлено!" : "В корзину"}
        </Button>
      </div>
    </div>
  );
}