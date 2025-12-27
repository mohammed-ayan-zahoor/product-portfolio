"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Layers, label: 'Categories', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-white transition-transform">
            <div className="flex h-full flex-col px-4 py-8">
                <div className="mb-10 px-2 text-center">
                    <span className="text-2xl font-bold tracking-tight text-primary">AdminPanel</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-foreground/60 hover:bg-slate-50 hover:text-primary"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-foreground/40 group-hover:text-primary")} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-border pt-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
