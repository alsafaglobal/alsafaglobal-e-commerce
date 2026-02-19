'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ImageUpload from '@/app/admin/components/ImageUpload';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  filter_param: string;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image_url: '', image_alt: '', filter_param: '', sort_order: 0 });
  const [showNew, setShowNew] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => setForm({ name: '', description: '', image_url: '', image_alt: '', filter_param: '', sort_order: 0 });

  const handleSave = async () => {
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { id: editId, ...form } : form;
    await fetch('/api/admin/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    setEditId(null);
    setShowNew(false);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '', image_alt: cat.image_alt || '', filter_param: cat.filter_param || '', sort_order: cat.sort_order });
    setShowNew(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">Categories</h1>
        <button onClick={() => { resetForm(); setEditId(null); setShowNew(!showNew); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
          <Icon name={showNew ? 'XMarkIcon' : 'PlusIcon'} size={16} />
          {showNew ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showNew && (
        <div className="mt-6 rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            {editId ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Filter Param</label>
              <input value={form.filter_param} onChange={(e) => setForm({ ...form, filter_param: e.target.value })}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                currentUrl={form.image_url}
                onUpload={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
                label="Category Photo"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button onClick={handleSave}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
            <Icon name="CheckIcon" size={16} />
            {editId ? 'Update' : 'Create'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (
        <div className="mt-6 space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-lg bg-card px-5 py-4 shadow-luxury-sm">
              <div>
                <p className="font-body text-sm font-medium text-text-primary">{cat.name}</p>
                <p className="font-body text-xs text-text-secondary">{cat.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 font-data text-xs text-text-secondary">#{cat.sort_order}</span>
                <button onClick={() => handleEdit(cat)} className="rounded-md p-1.5 text-text-secondary hover:bg-muted hover:text-primary">
                  <Icon name="PencilIcon" size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="rounded-md p-1.5 text-text-secondary hover:bg-error/10 hover:text-error">
                  <Icon name="TrashIcon" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
