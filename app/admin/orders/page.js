"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, CreditCard, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-amber-500" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-50 text-green-700 border-green-100';
            case 'failed': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Order Management</h1>
            </div>

            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border text-xs font-semibold uppercase text-foreground/50">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{order.customer?.name}</p>
                                        <p className="text-xs text-foreground/40">{order.customer?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-foreground/60">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-primary">₹{order.totalAmount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold leading-5 ${getStatusClass(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/60 hover:border-primary hover:text-primary transition-all">
                                        <Eye className="h-3.5 w-3.5" />
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-sm text-foreground/40">No orders found.</td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-sm text-foreground/40">Loading orders...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
