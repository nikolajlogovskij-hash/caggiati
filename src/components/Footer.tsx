"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-widest uppercase mb-4">
              Caggiati
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Изделия из бронзы ручной работы. Итальянские традиции, 
              белорусское качество. Бронзовые скульптуры, декор и 
              элементы интерьера премиум-класса.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wide">
              Каталог
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/catalog"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Все изделия
              </Link>
              <Link
                href="/catalog?category=sculptures"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Скульптуры
              </Link>
              <Link
                href="/catalog?category=decor"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Декор
              </Link>
              <Link
                href="/catalog?category=interior"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Интерьер
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wide">
              Информация
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                О нас
              </Link>
              <Link
                href="/delivery"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Доставка и оплата
              </Link>
              <Link
                href="/contact"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Контакты
              </Link>
              <Link
                href="/faq"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/oferta"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Публичная оферта
              </Link>
              <Link
                href="/policy"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wide">
              Контакты
            </h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <p>Республика Беларусь, г. Минск</p>
              <p>
                <a
                  href="tel:+375291234567"
                  className="hover:text-primary-foreground transition-colors"
                >
                  +375 (29) 123-45-67
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@caggiati.by"
                  className="hover:text-primary-foreground transition-colors"
                >
                  info@caggiati.by
                </a>
              </p>
              <p className="mt-2">Пн–Пт: 9:00 – 18:00</p>
              <p>Сб: 10:00 – 15:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Caggiati. Все права защищены.
          </p>
          <p className="text-sm text-primary-foreground/50">
            ИП Логовской Н.С., УНП 193456789
          </p>
        </div>
      </div>
    </footer>
  );
}