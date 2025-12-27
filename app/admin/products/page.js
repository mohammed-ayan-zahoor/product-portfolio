"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        price: '',
        categoryId: '',
        isActive: true,
        images: []
    });
    const [isEditing, setIsEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setIsEditing(null);
                setFormData({
                    title: '', slug: '', description: '', price: '',
                    categoryId: '', isActive: true, images: []
                });
                await fetchProducts();
            } else {
                const data = await res.json();
                alert(data.message || 'Error processing request');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProducts();
        else alert('Error deleting product');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
                <button
                    onClick={() => { setShowModal(true); setIsEditing(null); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            {/* Products List */}
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border text-xs font-semibold uppercase text-foreground/50">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex-none overflow-hidden rounded-lg bg-slate-100 border">
                                            {product.images?.[0] ? <img src={product.images[0]} className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-2 text-slate-300" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{product.title}</p>
                                            <p className="text-xs text-foreground/40">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-foreground/60">{product.categoryId?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm font-bold text-primary">₹{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${product.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => { setIsEditing(product._id); setFormData(product); setShowModal(true); }}
                                        className="p-1 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-sm text-foreground/40">No products found.</td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-sm text-foreground/40">Loading products...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tool/Component Interface */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-border">
                        <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4">
                            <h2 className="text-lg font-bold text-foreground">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-foreground/40 hover:text-foreground"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm bg-slate-50 focus:outline-none"
                                        value={formData.slug}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Category</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                        value={formData.categoryId?._id || formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input
                                        type="checkbox"
                                        id="productActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20"
                                    />
                                    <label htmlFor="productActive" className="text-sm font-semibold text-foreground">Is Active</label>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.images[0] || ''}
                                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg px-6 py-2.5 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
