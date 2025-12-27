"use client";

import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }) {
    const addToCart = () => {
        const savedCart = localStorage.getItem('cart');
        let cart = savedCart ? JSON.parse(savedCart) : [];

        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated')); // For real-time navbar update
        alert(`${product.title} added to cart!`);
    };

    return (
        <button
            onClick={addToCart}
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 font-bold"
        >
            <ShoppingCart className="h-5 w-5" />
            Add to Catalogue
        </button>
    );
}
