"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock initial cart load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);
    }, []);

    const updateQuantity = (id, delta) => {
        const newCart = cart.map(item => {
            if (item._id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item._id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) return <div className="min-h-screen pt-20 text-center">Loading cart...</div>;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Shopping Cart</h1>

            {cart.length > 0 ? (
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                    <section className="lg:col-span-7">
                        <ul className="divide-y divide-border border-b border-t border-border">
                            {cart.map((product) => (
                                <li key={product._id} className="flex py-6 sm:py-10">
                                    <div className="shrink-0">
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-semibold text-foreground">
                                                        <Link href={`/product/${product.slug || '#'}`} className="hover:text-primary">
                                                            {product.title}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <p className="mt-1 text-sm font-bold text-primary">₹{product.price.toLocaleString()}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(product._id, -1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground/70 hover:bg-slate-50"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-sm font-medium">{product.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(product._id, 1)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground/70 hover:bg-slate-50"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="absolute right-0 top-0">
                                                    <button
                                                        onClick={() => removeItem(product._id)}
                                                        className="-m-2 inline-flex p-2 text-foreground/40 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order summary */}
                    <section className="mt-16 rounded-2xl bg-slate-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-bold text-foreground">Order summary</h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-foreground/60">Subtotal</p>
                                <p className="text-sm font-medium text-foreground">₹{subtotal.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <p className="text-base font-bold text-foreground">Order total</p>
                                <p className="text-base font-bold text-primary">₹{subtotal.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link
                                href="/checkout"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary-hover transition-all duration-200"
                            >
                                Checkout
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="mt-20 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-foreground/20" />
                    <h2 className="mt-4 text-lg font-bold text-foreground">Your cart is empty</h2>
                    <p className="mt-2 text-sm text-foreground/60">Start exploring our premium offerings today.</p>
                    <div className="mt-8">
                        <Link
                            href="/category/all"
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
