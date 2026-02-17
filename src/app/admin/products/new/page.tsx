'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    image_url: '',
    image_alt: '',
    scent_type: 'Floral',
    fragrance_family: '',
    longevity: '',
    is_active: true,
    is_featured: false,
    size_50_price: '',
    size_100_price: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    occasions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizes = [];
    if (form.size_50_price) sizes.push({ volume_ml: 50, price: parseFloat(form.size_50_price) });
    if (form.size_100_price) sizes.push({ volume_ml: 100, price: parseFloat(form.size_100_price) });

    const parseNotes = (str: string, type: string) =>
      str.split(',').filter(Boolean).map((n) => ({ note_type: type, note_name: n.trim() }));

    const scent_notes = [
      ...parseNotes(form.top_notes, 'top'),
      ...parseNotes(form.heart_notes, 'heart'),
      ...parseNotes(form.base_notes, 'base'),
    ];

    const occasions = form.occasions.split(',').filter(Boolean).map((o) => o.trim());

    const body = {
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: parseFloat(form.price),
      image_url: form.image_url,
      image_alt: form.image_alt,
      scent_type: form.scent_type,
      fragrance_family: form.fragrance_family,
      longevity: form.longevity,
      is_active: form.is_active,
      is_featured: form.is_featured,
      sizes,
      scent_notes,
      occasions,
    };

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      alert('Failed to create product');
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-md p-1.5 text-text-secondary hover:bg-muted">
          <Icon name="ArrowLeftIcon" size={20} />
        </button>
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Add New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Product Name *</label>
              <input name="name" required value={form.name} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                className="w-full resize-none rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Base Price ($) *</label>
              <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Scent Type *</label>
              <select name="scent_type" value={form.scent_type} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Floral</option>
                <option>Woody</option>
                <option>Fresh</option>
                <option>Oriental</option>
              </select>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Image</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Image URL</label>
              <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..."
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Image Alt Text</label>
              <input name="image_alt" value={form.image_alt} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Fragrance Family</label>
              <input name="fragrance_family" value={form.fragrance_family} onChange={handleChange} placeholder="e.g. Oriental Floral"
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Longevity</label>
              <input name="longevity" value={form.longevity} onChange={handleChange} placeholder="e.g. 8-10 hours"
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Sizes & Pricing</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">50ml Price ($)</label>
              <input name="size_50_price" type="number" step="0.01" value={form.size_50_price} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">100ml Price ($)</label>
              <input name="size_100_price" type="number" step="0.01" value={form.size_100_price} onChange={handleChange}
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Scent Notes */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Scent Notes</h2>
          <p className="mb-3 font-body text-xs text-text-secondary">Separate multiple notes with commas</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Top Notes</label>
              <input name="top_notes" value={form.top_notes} onChange={handleChange} placeholder="Bergamot, Pink Pepper"
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Heart Notes</label>
              <input name="heart_notes" value={form.heart_notes} onChange={handleChange} placeholder="Rose, Jasmine"
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-text-primary">Base Notes</label>
              <input name="base_notes" value={form.base_notes} onChange={handleChange} placeholder="Vanilla, Musk"
                className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Occasions */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Occasions</h2>
          <div>
            <label className="mb-1 block font-body text-sm font-medium text-text-primary">Suitable For (comma separated)</label>
            <input name="occasions" value={form.occasions} onChange={handleChange} placeholder="Evening Events, Date Night, Special Occasions"
              className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Toggles */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Visibility</h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-2 font-body text-sm text-text-primary">
              <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring" />
              Active (visible on shop)
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-text-primary">
              <input name="is_featured" type="checkbox" checked={form.is_featured} onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring" />
              Featured (show on homepage)
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50">
            <Icon name="CheckIcon" size={16} />
            {saving ? 'Saving...' : 'Create Product'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-border px-6 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
