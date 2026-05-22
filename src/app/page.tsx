"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Truck, Award, FileText } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const categories = [
  {
    title: "Скульптуры",
    description: "Бронзовые скульптуры — от классических бюстов до современных арт-объектов",
    href: "/catalog?category=sculptures",
    slug: "sculptures",
    image: "🎭",
  },
  {
    title: "Декор",
    description: "Декоративные элементы для классических и современных интерьеров",
    href: "/catalog?category=decor",
    slug: "decor",
    image: "🏺",
  },
  {
    title: "Интерьер",
    description: "Функциональные предметы интерьера — ручки, светильники, мебельная фурнитура",
    href: "/catalog?category=interior",
    slug: "interior",
    image: "✨",
  },
];

const features = [
  {
    icon: Shield,
    title: "Высокое качество",
    text: "Только проверенные материалы и строгий контроль на всех этапах производства",
  },
  {
    icon: Award,
    title: "Гарантия",
    text: "Гарантия на все изделия. Возврат и обмен в соответствии с законодательством",
  },
  {
    icon: Truck,
    title: "Доставка",
    text: "Доставка по всей Беларуси и России. Надёжная упаковка каждого изделия",
  },
  {
    icon: FileText,
    title: "Документы",
    text: "Полный пакет документов для физических и юридических лиц",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center -mt-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-background z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-40 scale-110" />

        {/* Animated grain overlay */}
        <div className="absolute inset-0 z-10 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_#D4AF37_1px,_transparent_1px)] bg-[length:4px_4px]" />

        {/* Gold light orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-float z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-bronze/5 rounded-full blur-[100px] animate-float z-10" style={{ animationDelay: "-3s" }} />

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Brand tagline */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-6 py-2 border border-gold/30 rounded-full text-gold text-sm tracking-[0.3em] uppercase font-light">
                С 1956 года
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gold tracking-[0.05em] leading-none mb-6"
            >
              Caggiati
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase mb-4"
            >
              Изделия из бронзы ручной работы
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              Итальянские традиции литья. Эксклюзивные скульптуры, декор<br />
              и элементы интерьера премиум-класса.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/catalog">
                <Button
                  size="lg"
                  className="text-base px-10 py-7 uppercase tracking-[0.2em] font-light shimmer border-0"
                >
                  Каталог
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-10 py-7 uppercase tracking-[0.2em] font-light border-gold/30 text-gold hover:bg-gold/10"
                >
                  О бренде
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-gold/40 h-8 w-8" />
        </motion.div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">Коллекции</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
                Категории изделий
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <motion.div key={cat.slug} variants={fadeInUp}>
                  <Link href={cat.href} className="group block h-full">
                    <div className="card-luxury p-10 rounded-xl border border-border/50 bg-card h-full flex flex-col items-center text-center relative overflow-hidden">
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                      <div className="text-6xl mb-6 relative z-10">{cat.image}</div>
                      <h3 className="font-serif text-2xl font-semibold mb-3 group-hover:text-gold transition-colors relative z-10">
                        {cat.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed relative z-10">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="py-28 relative overflow-hidden bg-muted">
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-gold text-sm tracking-[0.3em] uppercase mb-4"
            >
              Наследие
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl font-bold mb-10 tracking-wide"
            >
              О бренде Caggiati
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-3xl mx-auto"
            >
              Бренд, объединяющий итальянские традиции бронзового литья и современный дизайн.
              Каждое изделие создаётся вручную мастерами с многолетним опытом.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto"
            >
              Наше производство находится в Республике Беларусь. Мы гарантируем качество,
              предлагаем индивидуальный подход и доставляем по всей Беларуси и России.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="uppercase tracking-[0.2em] font-light border-gold/30 text-gold hover:bg-gold/10 px-10 py-6"
                >
                  Узнать больше
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
                Почему выбирают нас
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
                Преимущества
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors duration-300 border border-gold/10 group-hover:border-gold/30">
                    <f.icon className="h-8 w-8 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-28 relative overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gold-gradient opacity-[0.03]" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-wide"
            >
              Готовы дополнить интерьер?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto"
            >
              Откройте для себя мир бронзового искусства. Каждое изделие —
              это уникальное сочетание красоты и долговечности.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/catalog">
                <Button
                  size="lg"
                  className="text-base px-12 py-7 uppercase tracking-[0.2em] font-light shimmer border-0"
                >
                  Смотреть каталог
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}