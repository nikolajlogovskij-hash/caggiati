import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { SmoothCursor } from "@/components/SmoothCursor";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://caggiati.by"),
  title: {
    default: "Caggiati — Бронзовые изделия ручной работы | Интернет-магазин",
    template: "%s | Caggiati",
  },
  description:
    "Эксклюзивные бронзовые люстры, скульптуры, мебель и декор от итальянского бренда Caggiati. Ручная работа с 1956 года. Доставка по Беларуси и России.",
  keywords: [
    "бронзовые изделия",
    "бронзовые люстры",
    "бронзовые скульптуры",
    "бронзовая мебель",
    "бронзовый декор",
    "Caggiati",
    "ручная работа",
    "элитный интерьер",
    "купить бронзу",
    "интернет-магазин бронзы",
  ],
  authors: [{ name: "Caggiati" }],
  creator: "Caggiati",
  publisher: "Caggiati",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    alternateLocale: "ru_RU",
    siteName: "Caggiati",
    title: "Caggiati — Бронзовые изделия ручной работы",
    description:
      "Эксклюзивные бронзовые люстры, скульптуры, мебель и декор премиум-класса. Итальянские традиции с 1956 года.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Caggiati — Бронзовые изделия",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caggiati — Бронзовые изделия ручной работы",
    description:
      "Эксклюзивные бронзовые люстры, скульптуры, мебель и декор премиум-класса.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <SmoothCursor />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}