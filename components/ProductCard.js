import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={product.title}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform group-hover:translate-y-0">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                    <Link href={`/product/${product.slug}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white transition-colors">
                        <Eye className="h-5 w-5" />
                    </Link>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            <Link href={`/product/${product.slug}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.title}
                            </Link>
                        </h3>
                        <p className="mt-1 text-xs text-foreground/50">{product.categoryName || 'General'}</p>
                    </div>
                    <p className="text-sm font-bold text-primary">₹{product.price.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
