"use client";

import { useState, useEffect } from 'react';
import {
    Package,
    ShoppingCart,
    TrendingUp,
    ArrowUpRight,
    CreditCard,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/products')
            ]);
            const orders = await ordersRes.json();
            const products = await productsRes.json();

            const isOrdersArray = Array.isArray(orders);
            const isProductsArray = Array.isArray(products);

            const revenue = isOrdersArray ? orders.reduce((sum, o) => sum + (o.status === 'paid' ? o.totalAmount : 0), 0) : 0;
            const activeProds = isProductsArray ? products.filter(p => p.isActive).length : 0;
            const pendingO = isOrdersArray ? orders.filter(o => o.status === 'pending').length : 0;

            setStats({
                totalOrders: isOrdersArray ? orders.length : 0,
                totalRevenue: revenue,
                activeProducts: activeProds,
                pendingOrders: pendingO
            });
            setRecentOrders(isOrdersArray ? orders.slice(0, 5) : []);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Products', value: stats.activeProducts, icon: Package, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    if (loading) return <div className="text-slate-400 p-8">Loading dashboard analytics...</div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-foreground/40">Welcome back, Admin. Here's your platform status.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={cn("rounded-lg p-2", card.bg)}>
                                <card.icon className={cn("h-6 w-6", card.color)} />
                            </div>
                            <span className="flex items-center text-xs font-semibold text-green-600">
                                +12% <ArrowUpRight className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-foreground/50">{card.label}</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4">
                        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:text-primary-hover">View All</Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <CreditCard className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{order.customer?.name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-foreground/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                    <p className={cn("text-[10px] font-bold uppercase", order.status === 'paid' ? 'text-green-600' : 'text-amber-600')}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="px-6 py-10 text-center text-sm text-foreground/40">No orders captured yet.</div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <h2 className="text-xl font-bold">Platform Health</h2>
                    <p className="mt-2 text-indigo-100 text-sm leading-relaxed">Everything is running smoothly. Your business catalogue is live and payment processing is secure.</p>

                    <div className="mt-8 space-y-4">
                        {[
                            { label: 'Active Channels', value: 'Web' },
                            { label: 'Auth Provider', value: 'JWT Standard' },
                            { label: 'DB Service', value: 'MongoDB Managed' }
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-sm font-medium text-indigo-200">{item.label}</span>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
