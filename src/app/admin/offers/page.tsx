'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  badge: string;
  link: string;
  valid_until: string;
  is_active: boolean;
  bg_color: string;
}

const empty: Omit<Offer, 'id'> = {
  title: '', description: '', discount: '', badge: '',
  link: '/shop-catalog', valid_until: '', is_active: true,
  bg_color: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
};

const inputCls = 'w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';
const labelCls = 'mb-1 block font-body text-sm font-medium text-text-primary';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    const res = await fetch('/api/offers');
    const data = await res.json();
    setOffers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(empty);
    setShowForm(false);
    fetchOffers();
    setSaving(false);
  };

  const toggleActive = async (offer: Offer) => {
    await fetch(`/api/offers/${offer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !offer.is_active }),
    });
    setOffers((prev) => prev.map((o) => o.id === offer.id ? { ...o, is_active: !o.is_active } : o));
  };

  const deleteOffer = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Offers & Promotions</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">Manage homepage offer banners</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
        >
          <Icon name="PlusIcon" size={16} /> Add Offer
        </button>
      </div>

      {/* Add Offer Form */}
      {showForm && (
        <div className="mt-6 rounded-lg bg-card p-6 shadow-luxury">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">New Offer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Summer Sale" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Discount Label</label>
              <input name="discount" value={form.discount} onChange={handleChange} placeholder="20% OFF" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <input name="description" value={form.description} onChange={handleChange} placeholder="On all oriental fragrances" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Badge Text</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="HOT DEAL" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input name="link" value={form.link} onChange={handleChange} placeholder="/shop-catalog" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Valid Until</label>
              <input name="valid_until" type="date" value={form.valid_until} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Background (CSS gradient or color)</label>
              <input name="bg_color" value={form.bg_color} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="h-4 w-4" />
              <label className="font-body text-sm text-text-primary">Active (show on homepage)</label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.title}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50">
              <Icon name="CheckIcon" size={16} /> {saving ? 'Saving...' : 'Save Offer'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="rounded-md border border-border px-5 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : offers.length === 0 ? (
        <div className="mt-12 text-center">
          <Icon name="TagIcon" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-body text-text-secondary">No offers yet. Add your first offer above.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className={`flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-luxury-sm ${!offer.is_active ? 'opacity-50' : ''}`}>
              <div
                className="h-14 w-14 flex-shrink-0 rounded-lg"
                style={{ background: offer.bg_color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-medium text-text-primary">{offer.title}</p>
                  {offer.badge && <span className="rounded-full bg-accent/10 px-2 py-0.5 font-body text-xs text-accent">{offer.badge}</span>}
                  {offer.discount && <span className="font-data text-sm font-bold text-primary">{offer.discount}</span>}
                </div>
                <p className="font-body text-xs text-text-secondary">{offer.description}</p>
                {offer.valid_until && (
                  <p className="font-body text-xs text-text-secondary">
                    Valid until: {new Date(offer.valid_until).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(offer)}
                  className={`rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${offer.is_active ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-error/10 text-error hover:bg-error/20'}`}>
                  {offer.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => deleteOffer(offer.id, offer.title)}
                  className="rounded-md p-2 text-error transition-luxury hover:bg-error/10">
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
