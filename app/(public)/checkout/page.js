"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import Script from 'next/script';

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (parsedCart.length === 0) {
                router.push('/cart');
            }
            setCart(parsedCart);
        } else {
            router.push('/cart');
        }
        setLoading(false);
    }, [router]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Create Razorpay Order
            const res = await fetch("/api/payments/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });
            const order = await res.json();

            // 2. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setSubmitting(false);
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_ID || "rzp_test_your_id",
                amount: order.amount,
                currency: order.currency,
                name: "TechFlow",
                description: "Purchase of Premium Offerings",
                order_id: order.id,
                handler: async function (response) {
                    // 4. Verify Payment
                    const verifyRes = await fetch("/api/payments/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });

                    if (verifyRes.ok) {
                        // 5. Save Order to Database
                        await fetch("/api/orders", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                items: cart.map(item => ({
                                    productId: item._id,
                                    quantity: item.quantity,
                                    price: item.price
                                })),
                                totalAmount: total,
                                paymentId: response.razorpay_payment_id,
                                status: 'paid',
                                customer: formData
                            }),
                        });

                        localStorage.removeItem("cart");
                        alert("Payment successful! Order placed.");
                        router.push("/");
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#4f46e5",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-20 text-center text-slate-500">Loading checkout...</div>;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                {/* Contact/Shipping Form */}
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Checkout Details</h2>
                            <p className="mt-2 text-sm text-foreground/50">Please provide your contact and delivery information.</p>

                            <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-border px-4 py-3 bg-white text-foreground focus:border-primary focus:ring-primary focus:outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-border px-4 py-3 bg-white text-foreground focus:border-primary focus:ring-primary focus:outline-none transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-border px-4 py-3 bg-white text-foreground focus:border-primary focus:ring-primary focus:outline-none transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-foreground">Delivery Address</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="mt-1 block w-full rounded-lg border border-border px-4 py-3 bg-white text-foreground focus:border-primary focus:ring-primary focus:outline-none transition-all"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border p-6 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <h3 className="text-lg font-bold text-foreground">Secure Payment</h3>
                            </div>
                            <p className="mt-2 text-xs text-foreground/50">Your transaction is encrypted and secured via Razorpay.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-primary-hover disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-6 w-6" />
                                    Pay ₹{total.toLocaleString()}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="mt-16 lg:col-span-5 lg:mt-0">
                    <div className="sticky top-24 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border bg-slate-50/50">
                            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
                        </div>
                        <ul className="divide-y divide-border px-6">
                            {cart.map((item) => (
                                <li key={item._id} className="flex py-6">
                                    <img src={item.images[0]} className="h-20 w-20 flex-none rounded-lg border bg-slate-50 object-cover" />
                                    <div className="ml-4 flex flex-auto flex-col">
                                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-xs text-foreground/50">Qty: {item.quantity}</p>
                                        <p className="mt-auto text-sm font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="p-6 bg-slate-50/50 space-y-4">
                            <div className="flex items-center justify-between text-base font-bold text-foreground">
                                <span>Total Amount</span>
                                <span className="text-xl text-primary font-extrabold">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
