"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar({ categories = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const count = cart.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        };

        updateCartCount();
        window.addEventListener('cart-updated', updateCartCount);
        window.addEventListener('storage', updateCartCount); // Sync across tabs

        return () => {
            window.removeEventListener('cart-updated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    const navLinks = [
        ...categories.map(cat => ({ href: `/category/${cat.slug}`, label: cat.name })),
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tight text-primary">TechFlow</span>
                    </Link>
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link
                            href="/category/all"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === '/category/all' ? "text-primary" : "text-foreground/70"
                            )}
                        >
                            All
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-foreground/70"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative p-2 text-foreground/70 transition-colors hover:text-primary">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/login" className="hidden p-2 text-foreground/70 transition-colors hover:text-primary md:block">
                        <User className="h-5 w-5" />
                    </Link>
                    <button
                        className="p-2 text-foreground md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-b border-border bg-background md:hidden">
                    <div className="space-y-1 px-4 py-4">
                        <Link
                            href="/category/all"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "block py-2 text-base font-medium transition-colors hover:text-primary",
                                pathname === '/category/all' ? "text-primary" : "text-foreground/70"
                            )}
                        >
                            All Offerings
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block py-2 text-base font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-foreground/70"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-2 border-border" />
                        <Link href="/login" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-foreground/70 hover:text-primary">Login</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
