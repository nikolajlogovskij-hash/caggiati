export function formatPrice(cents: number, currency: "BYN" | "RUB" = "BYN"): string {
  const amount = cents / 100;
  return `${amount.toLocaleString("ru-BY")} ${currency}`;
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} кг`;
  }
  return `${grams} г`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ru-BY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}