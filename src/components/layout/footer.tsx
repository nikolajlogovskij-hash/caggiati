import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-wide text-amber-800 dark:text-amber-400"
            >
              CACCIATI
            </Link>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Итальянское качество. Бронзовые изделия ручной работы с 1956 года.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Каталог
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/catalog?category=lighting"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Люстры и светильники
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=furniture"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Мебель
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=decor"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Декор
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=accessories"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Аксессуары
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Информация
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  О бренде
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href="/oferta"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  Публичная оферта
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Контакты
            </h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <a
                  href="tel:+375291234567"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  +375 (29) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <a
                  href="mailto:info@caggiati.by"
                  className="text-sm text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                >
                  info@caggiati.by
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  г. Минск, ул. Примерная, 123
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} CACCIATI. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}