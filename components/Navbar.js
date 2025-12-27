"use client";

import Link from 'next/link';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold tracking-tight text-primary">TechFlow</span>
                    </Link>
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link href="/category/hardware" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">Hardware</Link>
                        <Link href="/category/software" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">Software</Link>
                        <Link href="/category/education" className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">Education</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative p-2 text-foreground/70 transition-colors hover:text-primary">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">0</span>
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
                        <Link href="/category/hardware" className="block py-2 text-base font-medium text-foreground/70 hover:text-primary">Hardware</Link>
                        <Link href="/category/software" className="block py-2 text-base font-medium text-foreground/70 hover:text-primary">Software</Link>
                        <Link href="/category/education" className="block py-2 text-base font-medium text-foreground/70 hover:text-primary">Education</Link>
                        <hr className="my-2 border-border" />
                        <Link href="/login" className="block py-2 text-base font-medium text-foreground/70 hover:text-primary">Login</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
