import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategoryBySlug, getProducts, getCategories } from "@/lib/services/products";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Категория не найдена | Caggiati",
    };
  }

  return {
    title: `${category.name} | Caggiati`,
    description: category.description || `Каталог изделий в категории ${category.name}`,
  };
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-zinc-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-zinc-100 rounded w-1/3" />
            <div className="h-5 bg-zinc-100 rounded w-3/4" />
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-6 bg-zinc-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function CategoryProducts({ slug }: { slug: string }) {
  const products = await getProducts(slug);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-3">
          Товары не найдены
        </h2>
        <p className="text-zinc-500 mb-6">
          В этой категории пока нет товаров.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 bg-bronze-600 text-white hover:bg-bronze-700 shadow-sm h-10 px-6 text-sm"
        >
          Весь каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function CategoriesNav({ activeSlug }: { activeSlug: string }) {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/catalog"
        className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-zinc-200 text-zinc-700 hover:border-bronze-300 hover:text-bronze-700 transition-colors"
      >
        Все
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/catalog/${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            cat.slug === activeSlug
              ? "bg-bronze-600 text-white"
              : "bg-white border border-zinc-200 text-zinc-700 hover:border-bronze-300 hover:text-bronze-700"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-bronze-600 transition-colors">
          Главная
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-bronze-600 transition-colors">
          Каталог
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-zinc-500 text-lg max-w-2xl">{category.description}</p>
        )}
      </div>

      {/* Categories nav */}
      <Suspense fallback={null}>
        <CategoriesNav activeSlug={slug} />
      </Suspense>

      {/* Products */}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <CategoryProducts slug={slug} />
      </Suspense>
    </div>
  );
}