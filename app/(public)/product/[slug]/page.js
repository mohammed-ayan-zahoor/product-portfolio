import { notFound } from "next/navigation";
import { ShoppingCart, Shield, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { ImageGallery } from "./ImageGallery";
import { AddToCartButton } from "./AddToCartButton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.title} | Official Catalog`,
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
        <div className="min-h-screen bg-slate-50 pb-20 pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Product Card */}
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                    {/* Image Gallery */}
                    <ImageGallery images={product.images} title={product.title} />

                    {/* Primary Info & Quick Actions */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 flex flex-col h-full min-w-0">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Premium Tech Solution</span>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 break-words">{product.title}</h1>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-4xl font-black text-primary">₹{product.price.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Excl. GST</span>
                        </div>

                        {/* Feature Chips (Breadcrumb Style) */}
                        {product.features && product.features.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {product.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 px-4 py-1.5 transition-all hover:bg-white hover:border-primary/20 group">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-10 flex flex-col sm:flex-row items-center gap-6">
                            <AddToCartButton product={product} />

                            <div className="flex items-center gap-2 text-slate-400">
                                <Shield className="h-5 w-5" />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest">Enterprise Secured</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Section Below the Fold */}
                <div className="mt-12 lg:mt-20">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl font-black text-slate-900">Technical Deep Dive</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="bg-white rounded-[40px] p-8 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                        <div className="prose prose-slate max-w-none break-words prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium prose-p:text-lg prose-headings:font-black prose-headings:text-slate-900 prose-li:font-medium prose-li:text-slate-600 prose-strong:text-slate-900">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-8 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-8 space-y-3" {...props} />,
                                    li: ({ node, ...props }) => <li className="" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-black mt-12 mb-6 text-slate-900" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900" {...props} />,
                                    table: ({ node, ...props }) => (
                                        <div className="my-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                                            <table className="w-full border-collapse bg-white text-left text-sm" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-900" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-6 py-4" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-6 py-4 border-b border-slate-50 text-slate-600" {...props} />,
                                }}
                            >
                                {product.description?.replace(/^(#{1,6}|[-*])(?!\s)/gm, '$1 ')}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
