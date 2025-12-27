"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        images: [],
        features: []
    });
    const [isEditing, setIsEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setCategories([]);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
                toast.success('Image added to gallery');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (err) {
            toast.error('Network error during upload');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const loadingToast = toast.loading(isEditing ? 'Updating product...' : 'Creating product...');

        try {
            const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                price: Number(formData.price),
                categoryId: formData.categoryId?._id || formData.categoryId,
                isActive: formData.isActive,
                images: formData.images || [],
                features: (formData.features || []).filter(f => f && f.trim() !== '')
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(isEditing ? 'Product updated' : 'Product created', { id: loadingToast });
                setShowModal(false);
                setIsEditing(null);
                setFormData({
                    title: '',
                    slug: '',
                    description: '',
                    price: '',
                    categoryId: '',
                    isActive: true,
                    images: [],
                    features: []
                });
                await fetchProducts();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Error processing request', { id: loadingToast });
            }
        } catch (err) {
            toast.error('Network error', { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const handleFeatureChange = (index, value) => {
        setFormData(prev => {
            const updatedFeatures = [...(prev.features || [])];
            updatedFeatures[index] = value;
            return { ...prev, features: updatedFeatures };
        });
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const loadingToast = toast.loading('Deleting product...');
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Product deleted', { id: loadingToast });
            fetchProducts();
        } else {
            toast.error('Error deleting product', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
                <button
                    onClick={() => {
                        setIsEditing(null);
                        setFormData({
                            title: '',
                            slug: '',
                            description: '',
                            price: '',
                            categoryId: '',
                            isActive: true,
                            images: [],
                            features: []
                        });
                        setShowModal(true);
                    }}
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
                                        onClick={() => {
                                            setIsEditing(product._id);
                                            setFormData({
                                                ...product,
                                                categoryId: product.categoryId?._id || product.categoryId,
                                                features: product.features || [],
                                                images: product.images || []
                                            });
                                            setShowModal(true);
                                        }}
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
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4 flex-none">
                            <h2 className="text-lg font-bold text-foreground">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-foreground/40 hover:text-foreground"><X className="h-5 w-5" /></button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate} className="flex flex-col flex-1 min-h-0">
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    {/* Left Column: Media & Features */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-foreground/50 uppercase mb-3">Product Media (Gallery)</label>
                                            <div className="flex flex-wrap gap-3">
                                                {formData.images?.map((img, idx) => (
                                                    <div key={idx} className="relative group h-20 w-20 flex-none overflow-hidden rounded-xl border border-border shadow-sm">
                                                        <img src={img} className="h-full w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <div className="relative group flex h-20 w-20 flex-none items-center justify-center rounded-xl border-2 border-dashed border-border bg-slate-50 transition-all hover:border-primary hover:bg-slate-100/50">
                                                    <div className="text-center">
                                                        {uploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Plus className="h-5 w-5 mx-auto text-foreground/20 group-hover:text-primary transition-colors" />}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                        disabled={uploading}
                                                    />
                                                </div>
                                            </div>
                                            <p className="mt-2 text-[10px] text-foreground/40 italic">Support multiple JPG/PNG up to 5MB.</p>
                                        </div>

                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="block text-xs font-semibold text-foreground/50 uppercase">Key Features</label>
                                                <button
                                                    type="button"
                                                    onClick={handleAddFeature}
                                                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {formData.features?.map((feature, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 4K Ultra HD"
                                                            className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none transition-all"
                                                            value={feature}
                                                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFeature(idx)}
                                                            className="p-1.5 text-foreground/20 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.features?.length === 0 && (
                                                    <div
                                                        onClick={handleAddFeature}
                                                        className="rounded-lg border border-dashed border-border p-4 text-center cursor-pointer hover:bg-white transition-colors"
                                                    >
                                                        <p className="text-[11px] text-foreground/40 font-medium italic">Click to add highlights.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: General Info */}
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Product Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold text-primary"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-foreground/50 uppercase mb-1">Category</label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                                                    >
                                                        <span className={formData.categoryId ? "text-foreground font-medium" : "text-foreground/40"}>
                                                            {categories.find(c => c._id === (formData.categoryId?._id || formData.categoryId))?.name || 'Select'}
                                                        </span>
                                                        <ChevronDown className={cn("h-4 w-4 text-foreground/40 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isDropdownOpen && (
                                                            <>
                                                                <div className="fixed inset-0 z-[60]" onClick={() => setIsDropdownOpen(false)} />
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    className="absolute left-0 right-0 z-[70] mt-2 max-h-48 overflow-auto rounded-xl border border-border bg-white p-1 shadow-2xl"
                                                                >
                                                                    {categories.map((c) => {
                                                                        const isSelected = (formData.categoryId?._id || formData.categoryId) === c._id;
                                                                        return (
                                                                            <button
                                                                                key={c._id}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setFormData({ ...formData, categoryId: c._id });
                                                                                    setIsDropdownOpen(false);
                                                                                }}
                                                                                className={cn(
                                                                                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm transition-colors",
                                                                                    isSelected ? "bg-primary/5 text-primary font-semibold" : "text-foreground/70 hover:bg-slate-50 hover:text-foreground"
                                                                                )}
                                                                            >
                                                                                {c.name}
                                                                                {isSelected && <Check className="h-4 w-4" />}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Width Description & Guide (Now inside scrollable area) */}
                                <div className="mt-8 pt-8 border-t border-slate-100 pb-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Description</label>
                                        <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 shadow-inner">
                                            <button
                                                type="button"
                                                onClick={() => setIsPreview(false)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all text-nowrap",
                                                    !isPreview ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                )}
                                            >
                                                Edit Mode
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsPreview(true)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all text-nowrap",
                                                    isPreview ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                )}
                                            >
                                                Preview Result
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col xl:flex-row gap-8">
                                        {/* Main Workspace */}
                                        <div className="flex-1 min-w-0">
                                            <div className="relative min-h-[400px]">
                                                {isPreview ? (
                                                    <div className="min-h-[400px] w-full rounded-2xl border border-slate-100 bg-slate-50/30 p-8 overflow-hidden shadow-inner">
                                                        <div className="prose prose-slate prose-sm max-w-none break-words">
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0 text-slate-600 font-medium leading-relaxed" {...props} />,
                                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                                                                    h2: ({ node, ...props }) => <h2 className="text-lg font-black mt-6 mb-3 text-slate-900" {...props} />,
                                                                    h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2 text-slate-900" {...props} />,
                                                                    table: ({ node, ...props }) => (
                                                                        <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                                                                            <table className="w-full border-collapse bg-white text-left text-xs" {...props} />
                                                                        </div>
                                                                    ),
                                                                    thead: ({ node, ...props }) => <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900" {...props} />,
                                                                    th: ({ node, ...props }) => <th className="px-4 py-3" {...props} />,
                                                                    td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-slate-50 text-slate-600" {...props} />,
                                                                }}
                                                            >
                                                                {formData.description?.replace(/^(#{1,6}|[-*])(?!\s)/gm, '$1 ')}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <textarea
                                                        required
                                                        rows={15}
                                                        className="w-full h-full min-h-[400px] rounded-2xl border border-slate-200 px-6 py-6 text-sm focus:border-primary focus:outline-none transition-all leading-relaxed font-mono bg-white shadow-xl shadow-slate-200/20 resize-none"
                                                        placeholder="# Main Heading\n\nWrite your professional technical description here...\n\n- Highlight 1\n- Highlight 2"
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Rules Sidebar (Stick to right) */}
                                        <div className="xl:w-80 bg-white rounded-2xl border border-slate-100 p-6 shrink-0 h-fit shadow-lg shadow-slate-100/50">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                    <p className="text-[10px] font-black uppercase text-slate-900 tracking-[0.1em]">Formatting Engine</p>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">V2.0</span>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <code className="text-primary font-black text-xs"># Title</code>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">Header 1</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <code className="text-primary font-black text-xs">## Title</code>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">Header 2</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <code className="text-primary font-black text-xs">- list</code>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">Bullets</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <code className="text-primary font-black text-xs">**bold**</code>
                                                    <span className="text-[9px] uppercase font-bold text-slate-400">Emphasis</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-slate-50">
                                                <p className="text-[10px] font-black text-slate-900 uppercase mb-4 px-1">Technical Table Syntax</p>
                                                <div className="bg-slate-900 rounded-xl p-4 shadow-xl shadow-slate-900/10">
                                                    <code className="text-indigo-300 text-[11px] leading-relaxed block whitespace-pre">
                                                        | Feature | Value |<br />
                                                        |---|---|<br />
                                                        | Version | 1.0 |
                                                    </code>
                                                </div>
                                                <div className="mt-6 space-y-3 px-1 text-[10px] text-slate-400 leading-relaxed font-medium">
                                                    <p className="text-amber-500 font-black">⚠️ PIPES MUST MATCH:</p>
                                                    <p>• If header has 2 columns, separator MUST have 2 segments <code>|---|---|</code>.</p>
                                                    <p>• Only ONE separator line after header.</p>
                                                    <p>• Use the <span className="text-primary font-black">Preview Result</span> tab to check alignment.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="productActive"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-bold text-slate-700">Display Product on Storefront</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Status: {formData.isActive ? 'Active' : 'Draft'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-slate-50/50 flex-none">
                                <div className="text-[10px] text-foreground/40 font-mono hidden sm:block">
                                    SLUG: {formData.slug || 'auto-generated'}
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 sm:flex-none rounded-xl px-6 py-2.5 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-slate-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 sm:flex-none rounded-xl bg-primary px-10 py-2.5 text-sm font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Product'}
                                    </button>
                                </div>
                            </div>
                        </form >
                    </div >
                </div >
            )
            }
        </div >
    );
}
