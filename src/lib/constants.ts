export const SITE_NAME = "Caggiati";
export const SITE_DESCRIPTION =
  "Интернет-магазин изделий из бронзы Caggiati. Люстры, бра, торшеры и другие светильники премиум-класса.";

export const SUPPORTED_COUNTRIES = [
  { code: "BY" as const, name: "Беларусь", currency: "BYN" as const, symbol: "Br" },
  { code: "RU" as const, name: "Россия", currency: "RUB" as const, symbol: "₽" },
] as const;

export type CountryCode = (typeof SUPPORTED_COUNTRIES)[number]["code"];
export type CurrencyCode = (typeof SUPPORTED_COUNTRIES)[number]["currency"];

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  BYN: "Br",
  RUB: "₽",
};

export const SHIPPING_METHODS: Record<CountryCode, { id: string; name: string; cost: number; free_from?: number }[]> = {
  BY: [
    { id: "courier", name: "Курьерская доставка по Минску", cost: 15 },
    { id: "courier_regions", name: "Курьерская доставка по Беларуси", cost: 25 },
    { id: "pickup", name: "Самовывоз из магазина", cost: 0 },
  ],
  RU: [
    { id: "cdek", name: "СДЭК — до пункта выдачи", cost: 500 },
    { id: "cdek_courier", name: "СДЭК — курьерская доставка", cost: 800 },
    { id: "russian_post", name: "Почта России", cost: 400 },
  ],
};

export const CONTACTS: Record<CountryCode, { phone: string; email: string; address: string }> = {
  BY: {
    phone: "+375 (29) XXX-XX-XX",
    email: "info@caggiati.by",
    address: "г. Минск, ул. Примерная, 1",
  },
  RU: {
    phone: "+7 (800) XXX-XX-XX",
    email: "info@caggiati.ru",
    address: "г. Москва, ул. Примерная, 1",
  },
};

export const ITEMS_PER_PAGE = 12;