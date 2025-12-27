import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

// Mock data for initial UI
const allProducts = [
    {
        _id: '1',
        title: 'Enterprise Server Pro',
        slug: 'enterprise-server-pro',
        price: 150000,
        images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop'],
        categorySlug: 'hardware',
        categoryName: 'Hardware'
    },
    {
        _id: '2',
        title: 'Cloud Security Suite',
        slug: 'cloud-security-suite',
        price: 45000,
        images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'],
        categorySlug: 'software',
        categoryName: 'Software'
    },
    {
        _id: '3',
        title: 'AI & Data Science Boot Camp',
        slug: 'ai-data-science-boot-camp',
        price: 25000,
        images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop'],
        categorySlug: 'education',
        categoryName: 'Education'
    },
    {
        _id: '4',
        title: 'Precision Workstation Z4',
        slug: 'precision-workstation-z4',
        price: 85000,
        images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop'],
        categorySlug: 'hardware',
        categoryName: 'Hardware'
    }
];

const categories = {
    hardware: "Hardware Solutions",
    software: "Enterprise Software",
    education: "Professional Education",
    all: "All Offerings"
};

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    if (!categories[slug]) {
        notFound();
    }

    const filteredProducts = slug === 'all'
        ? allProducts
        : allProducts.filter(p => p.categorySlug === slug);

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {categories[slug]}
                </h1>
                <p className="mt-4 text-base text-foreground/60 max-w-2xl mx-auto">
                    Explore our range of {slug === 'all' ? 'Hardware, Software and Education' : slug} offerings designed for excellence.
                </p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-lg text-foreground/40">No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
