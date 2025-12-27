import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const dynamic = 'force-dynamic';

async function getHomeData() {
  await dbConnect();

  // Fetch active categories
  const categories = await Category.find({ isActive: true }).limit(3).lean();

  // Fetch featured products (latest 4 active)
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return {
    categories: JSON.parse(JSON.stringify(categories)),
    products: JSON.parse(JSON.stringify(products))
  };
}

export default async function Home() {
  const { categories, products } = await getHomeData();

  return (
    <div className="pb-20">
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Offerings</h2>
            <p className="mt-1 text-sm text-foreground/50">Handpicked solutions for your professional needs.</p>
          </div>
          <Link href="/category/all" className="text-sm font-semibold text-primary hover:text-primary-hover">
            View all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-foreground/40">
              No products found. Add some in the admin dashboard!
            </div>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="bg-primary/5 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {categories.map((cat) => (
                <div key={cat._id} className="rounded-2xl bg-white p-8 shadow-sm border border-border/50">
                  <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                  <p className="mt-2 text-sm text-foreground/60">Explore our premium {cat.name} solutions and expert offerings.</p>
                  <Link href={`/category/${cat.slug}`} className="mt-4 inline-block text-sm font-semibold text-primary">Discover &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
