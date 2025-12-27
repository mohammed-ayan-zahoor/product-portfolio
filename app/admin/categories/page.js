"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', isActive: true });
    const [editData, setEditData] = useState({ name: '', slug: '', isActive: true });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });
            if (res.ok) {
                toast.success('Category created');
                setNewCategory({ name: '', slug: '', isActive: true });
                await fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Error creating category');
            }
        } catch (err) {
            toast.error('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id) => {
        setSubmitting(true);
        const loadingToast = toast.loading('Updating category...');
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        });
        if (res.ok) {
            toast.success('Category updated', { id: loadingToast });
            setIsEditing(null);
            fetchCategories();
        } else {
            toast.error('Error updating category', { id: loadingToast });
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        const loadingToast = toast.loading('Deleting category...');
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Category deleted', { id: loadingToast });
            fetchCategories();
        } else {
            toast.error('Error deleting category', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
            </div>

            {/* Create New Category Form */}
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
                    <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                            value={newCategory.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                                setNewCategory(prev => ({ ...prev, name, slug }));
                            }}
                            placeholder="e.g. Hardware"
                        />
                    </div>
                    <div className="sm:col-span-1">
                        <label className="block text-xs font-medium text-foreground/50 uppercase mb-1">Slug</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            value={newCategory.slug}
                            onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                            placeholder="hardware"
                        />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={newCategory.isActive}
                            onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-foreground">Active</label>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 inline mr-2" />}
                        Add Category
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border text-xs font-semibold uppercase text-foreground/50">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    {isEditing === category._id ? (
                                        <input
                                            type="text"
                                            className="w-full rounded border border-border px-2 py-1 text-sm focus:outline-none"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-foreground">{category.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {isEditing === category._id ? (
                                        <input
                                            type="text"
                                            className="w-full rounded border border-border px-2 py-1 text-sm focus:outline-none"
                                            value={editData.slug}
                                            onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-sm text-foreground/60">{category.slug}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {isEditing === category._id ? (
                                        <input
                                            type="checkbox"
                                            checked={editData.isActive}
                                            onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                                        />
                                    ) : (
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${category.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {isEditing === category._id ? (
                                        <>
                                            <button onClick={() => handleUpdate(category._id)} className="p-1 text-primary hover:text-primary-hover">
                                                <Save className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setIsEditing(null)} className="p-1 text-foreground/40 hover:text-foreground">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setIsEditing(category._id); setEditData(category); }} className="p-1 text-slate-400 hover:text-primary">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(category._id)} className="p-1 text-slate-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-sm text-foreground/40">No categories found.</td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-sm text-foreground/40">Loading categories...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
