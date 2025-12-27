import { notFound } from "next/navigation";
import { ShoppingCart, Shield, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton"; // I'll create this to handle client-side logic

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.title} | TechFlow`,
        description: product.description.substring(0, 160)
    };
}

async function getProductData(slug) {
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true }).lean();
    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const product = await getProductData(slug);

    if (!product) notFound();

    return (
        <div className="min-h-screen bg-white pb-20 pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
                    {/* Image Gallery */}
                    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="h-full w-full object-cover object-center"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.title}</h1>

                        <div className="mt-4">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-primary font-bold">₹{product.price.toLocaleString()}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-foreground/70 leading-relaxed">
                                {product.description}
                            </div>
                        </div>

                        <div className="mt-10 flex items-center gap-4">
                            <AddToCartButton product={product} />
                        </div>

                        <section aria-labelledby="details-heading" className="mt-12 border-t border-slate-200 pt-10">
                            <h2 id="details-heading" className="text-sm font-bold uppercase tracking-wider text-foreground">Premium Benefits</h2>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground/70">Enterprise-grade security and reliability</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground/70">24/7 Professional technical support</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
