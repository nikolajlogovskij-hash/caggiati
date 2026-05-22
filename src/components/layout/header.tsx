"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User, X, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui";
import { SUPPORTED_COUNTRIES, CURRENCY_SYMBOLS, type CountryCode, type CurrencyCode } from "@/lib/constants";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>("BY");
  const [currency, setCurrency] = useState<CurrencyCode>("BYN");

  const countryInfo = SUPPORTED_COUNTRIES.find((c) => c.code === country) ?? SUPPORTED_COUNTRIES[0];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95">
      {/* Top bar */}
      <div className="hidden border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>Бесплатная доставка по Минску от 500 Br</span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span>Доставка в РФ через СДЭК</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Country selector */}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <select
                value={country}
                onChange={(e) => {
                  const code = e.target.value as CountryCode;
                  setCountry(code);
                  const c = SUPPORTED_COUNTRIES.find((x) => x.code === code);
                  if (c) setCurrency(c.currency);
                }}
                className="border-none bg-transparent text-xs text-zinc-500 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="border-none bg-transparent text-xs text-zinc-500 focus:outline-none cursor-pointer"
            >
              <option value="BYN">BYN (Br)</option>
              <option value="RUB">RUB (₽)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Mobile menu button */}
        <button
          className="lg:hidden -ml-1 p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-amber-800 dark:text-amber-400 hover:opacity-80 transition-opacity"
        >
          CACCIATI
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/catalog"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
          >
            Каталог
          </Link>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
          >
            Категории
            <ChevronDown className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
          >
            О бренде
          </Link>
          <Link
            href="/contacts"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
          >
            Контакты
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 pb-6 pt-4 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/catalog"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              О бренде
            </Link>
            <Link
              href="/contacts"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Контакты
            </Link>
            <hr className="my-2 border-zinc-200 dark:border-zinc-800" />
            {/* Country selector mobile */}
            <div className="flex items-center gap-2 px-3 py-1 text-sm text-zinc-500">
              <MapPin className="h-4 w-4" />
              <select
                value={country}
                onChange={(e) => {
                  const code = e.target.value as CountryCode;
                  setCountry(code);
                  const c = SUPPORTED_COUNTRIES.find((x) => x.code === code);
                  if (c) setCurrency(c.currency);
                }}
                className="border-none bg-transparent text-sm text-zinc-500 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-3 text-sm text-zinc-500">
              Валюта: {CURRENCY_SYMBOLS[currency]}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}