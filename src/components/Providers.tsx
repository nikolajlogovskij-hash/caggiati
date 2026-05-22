"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/lib/store/cart-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </CartProvider>
  );
}