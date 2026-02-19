'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import ImageUpload from '@/app/admin/components/ImageUpload';

interface SizeEntry { volume_ml: string; price: string }
interface NoteEntry { note_name: string }

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
  });

  const [sizes, setSizes] = useState<SizeEntry[]>([{ volume_ml: '', price: '' }]);
  const [topNotes, setTopNotes] = useState<NoteEntry[]>([]);
  const [heartNotes, setHeartNotes] = useState<NoteEntry[]>([]);
  const [baseNotes, setBaseNotes] = useState<NoteEntry[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);

  // Temp inputs for tag-style fields
  const [topInput, setTopInput] = useState('');
  const [heartInput, setHeartInput] = useState('');
  const [baseInput, setBaseInput] = useState('');
  const [occasionInput, setOccasionInput] = useState('');

  const inputCls = 'w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';
  const labelCls = 'mb-1 block font-body text-sm font-medium text-text-primary';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // --- Size helpers ---
  const addSize = () => setSizes((prev) => [...prev, { volume_ml: '', price: '' }]);
  const removeSize = (i: number) => setSizes((prev) => prev.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: keyof SizeEntry, value: string) =>
    setSizes((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  // --- Tag helpers ---
  const addTag = (value: string, list: NoteEntry[], setList: React.Dispatch<React.SetStateAction<NoteEntry[]>>, setInput: React.Dispatch<React.SetStateAction<string>>) => {
    const trimmed = value.trim();
    if (trimmed && !list.some((n) => n.note_name.toLowerCase() === trimmed.toLowerCase())) {
      setList((prev) => [...prev, { note_name: trimmed }]);
    }
    setInput('');
  };

  const removeTag = (i: number, setList: React.Dispatch<React.SetStateAction<NoteEntry[]>>) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const addOccasion = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !occasions.some((o) => o.toLowerCase() === trimmed.toLowerCase())) {
      setOccasions((prev) => [...prev, trimmed]);
    }
    setOccasionInput('');
  };

  const removeOccasion = (i: number) => setOccasions((prev) => prev.filter((_, idx) => idx !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      action();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const validSizes = sizes
      .filter((s) => s.volume_ml && s.price)
      .map((s) => ({ volume_ml: parseInt(s.volume_ml), price: parseFloat(s.price) }));

    const scent_notes = [
      ...topNotes.map((n) => ({ note_type: 'top', note_name: n.note_name })),
      ...heartNotes.map((n) => ({ note_type: 'heart', note_name: n.note_name })),
      ...baseNotes.map((n) => ({ note_type: 'base', note_name: n.note_name })),
    ];

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
      sizes: validSizes,
      scent_notes: scent_notes,
      occasions: occasions,
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
        <h1 className="font-heading text-2xl font-semibold text-text-primary">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Base Price ($) *</label>
              <input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Scent Type *</label>
              <select name="scent_type" value={form.scent_type} onChange={handleChange} className={inputCls}>
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
          <ImageUpload onUpload={(url) => setForm((prev) => ({ ...prev, image_url: url }))} label="Product Photo" />
          <div className="mt-4">
            <label className={labelCls}>Image Description (for accessibility)</label>
            <input name="image_alt" value={form.image_alt} onChange={handleChange} placeholder="e.g. Elegant rose perfume bottle" className={inputCls} />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Fragrance Family</label>
              <input name="fragrance_family" value={form.fragrance_family} onChange={handleChange} placeholder="e.g. Oriental Floral" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Longevity</label>
              <input name="longevity" value={form.longevity} onChange={handleChange} placeholder="e.g. 8-10 hours" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Sizes — Dynamic */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-text-primary">Sizes & Pricing</h2>
            <button type="button" onClick={addSize}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 font-body text-xs font-medium text-primary hover:bg-primary/20">
              <Icon name="PlusIcon" size={14} /> Add Size
            </button>
          </div>
          <div className="space-y-3">
            {sizes.map((s, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className={labelCls}>Volume (ml)</label>
                  <input type="number" min="1" value={s.volume_ml} onChange={(e) => updateSize(i, 'volume_ml', e.target.value)}
                    placeholder="e.g. 50" className={inputCls} />
                </div>
                <div className="flex-1">
                  <label className={labelCls}>Price ($)</label>
                  <input type="number" step="0.01" min="0" value={s.price} onChange={(e) => updateSize(i, 'price', e.target.value)}
                    placeholder="e.g. 165.00" className={inputCls} />
                </div>
                <button type="button" onClick={() => removeSize(i)}
                  className="mb-0.5 rounded-md p-2 text-error hover:bg-error/10">
                  <Icon name="TrashIcon" size={18} />
                </button>
              </div>
            ))}
            {sizes.length === 0 && (
              <p className="font-body text-sm text-text-secondary">No sizes added. Click &quot;Add Size&quot; to add one.</p>
            )}
          </div>
        </div>

        {/* Scent Notes — Tag style */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Scent Notes</h2>
          <p className="mb-3 font-body text-xs text-text-secondary">Type a note and press Enter or comma to add it</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Top Notes */}
            <div>
              <label className={labelCls}>Top Notes</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {topNotes.map((n, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-body text-xs text-primary">
                    {n.note_name}
                    <button type="button" onClick={() => removeTag(i, setTopNotes)} className="hover:text-error">
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input value={topInput} onChange={(e) => setTopInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => addTag(topInput, topNotes, setTopNotes, setTopInput))}
                onBlur={() => topInput.trim() && addTag(topInput, topNotes, setTopNotes, setTopInput)}
                placeholder="Bergamot, Pink Pepper" className={inputCls} />
            </div>
            {/* Heart Notes */}
            <div>
              <label className={labelCls}>Heart Notes</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {heartNotes.map((n, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-body text-xs text-accent">
                    {n.note_name}
                    <button type="button" onClick={() => removeTag(i, setHeartNotes)} className="hover:text-error">
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input value={heartInput} onChange={(e) => setHeartInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => addTag(heartInput, heartNotes, setHeartNotes, setHeartInput))}
                onBlur={() => heartInput.trim() && addTag(heartInput, heartNotes, setHeartNotes, setHeartInput)}
                placeholder="Rose, Jasmine" className={inputCls} />
            </div>
            {/* Base Notes */}
            <div>
              <label className={labelCls}>Base Notes</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {baseNotes.map((n, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 font-body text-xs text-text-primary">
                    {n.note_name}
                    <button type="button" onClick={() => removeTag(i, setBaseNotes)} className="hover:text-error">
                      <Icon name="XMarkIcon" size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input value={baseInput} onChange={(e) => setBaseInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => addTag(baseInput, baseNotes, setBaseNotes, setBaseInput))}
                onBlur={() => baseInput.trim() && addTag(baseInput, baseNotes, setBaseNotes, setBaseInput)}
                placeholder="Vanilla, Musk" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Occasions — Tag style */}
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">Occasions</h2>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {occasions.map((o, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 font-body text-xs text-success">
                {o}
                <button type="button" onClick={() => removeOccasion(i)} className="hover:text-error">
                  <Icon name="XMarkIcon" size={12} />
                </button>
              </span>
            ))}
          </div>
          <input value={occasionInput} onChange={(e) => setOccasionInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, () => addOccasion(occasionInput))}
            onBlur={() => occasionInput.trim() && addOccasion(occasionInput)}
            placeholder="Type an occasion and press Enter" className={inputCls} />
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
