import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();

    if (slug === 'all') {
        return { title: 'All Products | TechFlow', description: 'Explore our complete range of premium tech solutions.' };
    }

    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} | TechFlow`,
        description: `Explore our premium ${category.name} offerings including enterprise hardware and software solutions.`
    };
}

async function getCategoryData(slug) {
    await dbConnect();

    let category = null;
    let products = [];

    if (slug === 'all') {
        category = { name: 'All Offerings', slug: 'all' };
        products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    } else {
        category = await Category.findOne({ slug, isActive: true }).lean();
        if (!category) return null;

        products = await Product.find({ categoryId: category._id, isActive: true })
            .sort({ createdAt: -1 })
            .lean();
    }

    return {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(products))
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const data = await getCategoryData(slug);

    if (!data) notFound();

    const { category, products } = data;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">{category.name}</h1>
                    <p className="mt-4 text-lg text-foreground/50 max-w-2xl">
                        Browse our curated selection of professional {category.name.toLowerCase()} designed for modern enterprises and high-performance environments.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
                        <p className="text-lg font-medium text-foreground/40">No products found in this category.</p>
                        <p className="mt-1 text-sm text-foreground/30">Check back later for new arrivals.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
