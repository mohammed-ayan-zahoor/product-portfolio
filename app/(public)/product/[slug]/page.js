import { notFound } from "next/navigation";
import { ShoppingCart, Shield, ArrowRight } from "lucide-react";

// Mock data for initial UI
const allProducts = [
    {
        _id: '1',
        title: 'Enterprise Server Pro',
        slug: 'enterprise-server-pro',
        description: 'A powerful enterprise-grade server designed for high-availability workloads and mission-critical applications. Features dual Xeon processors, 128GB ECC RAM, and redundant power supplies.',
        price: 150000,
        images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop'],
        categoryName: 'Hardware'
    },
    {
        _id: '2',
        title: 'Cloud Security Suite',
        slug: 'cloud-security-suite',
        description: 'Comprehensive cloud security platform providing end-to-end encryption, identity management, and real-time threat detection for your modern cloud infrastructure.',
        price: 45000,
        images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'],
        categoryName: 'Software'
    }
];

export default async function ProductDetailsPage({ params }) {
    const { slug } = await params;
    const product = allProducts.find(p => p.slug === slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
                {/* Image gallery */}
                <div className="flex flex-col">
                    <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border bg-slate-50">
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                </div>

                {/* Product info */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <p className="text-sm font-medium text-primary uppercase tracking-wider">{product.categoryName}</p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">{product.title}</h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-primary font-bold">₹{product.price.toLocaleString()}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="space-y-6 text-base text-foreground/70 leading-relaxed">
                            {product.description}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary-hover transition-all duration-200">
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </button>
                    </div>

                    <section aria-labelledby="details-heading" className="mt-12 border-t border-border pt-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Verified Quality</h4>
                                    <p className="text-xs text-foreground/50">Enterprise grade testing and certification.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ArrowRight className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Fast Delivery</h4>
                                    <p className="text-xs text-foreground/50">Express shipping for hardware and instant access for software.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
