'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface LinkedProduct {
  id: string;
  product_id: string;
  products: ProductOption;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  discount_percent: number | null;
  offer_type: 'banner' | 'product' | 'combo';
  badge: string;
  link: string;
  valid_until: string;
  is_active: boolean;
  bg_color: string;
  offer_products: LinkedProduct[];
}

const inputCls = 'w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';
const labelCls = 'mb-1 block font-body text-sm font-medium text-text-primary';

type OfferType = 'banner' | 'product' | 'combo';

interface FormState {
  title: string;
  description: string;
  offer_type: OfferType;
  discount_percent: string;
  badge: string;
  link: string;
  valid_until: string;
  is_active: boolean;
  bg_color: string;
  discount: string;
  selected_product_ids: string[];
}

const emptyForm: FormState = {
  title: '',
  description: '',
  offer_type: 'product',
  discount_percent: '',
  badge: '',
  link: '',
  valid_until: '',
  is_active: true,
  bg_color: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
  discount: '',
  selected_product_ids: [],
};

function OffersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const fetchOffers = useCallback(async () => {
    const res = await fetch('/api/offers');
    const data = await res.json();
    setOffers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data.map((p: ProductOption & { price: number }) => ({
      id: p.id, name: p.name, price: p.price, image_url: p.image_url,
    })) : []);
  }, []);

  const fetchVisibility = useCallback(async () => {
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    const key = data?.find?.((d: { key: string; value: string }) => d.key === 'section_visible_offers');
    setSectionVisible(key ? key.value !== 'false' : true);
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchProducts();
    fetchVisibility();
  }, [fetchOffers, fetchProducts, fetchVisibility]);

  // Handle ?add_product= redirect from products page
  useEffect(() => {
    const addProductId = searchParams.get('add_product');
    const addProductName = searchParams.get('name');
    if (addProductId && addProductName) {
      setForm({ ...emptyForm, offer_type: 'product', title: `${addProductName} Offer`, selected_product_ids: [addProductId] });
      setShowForm(true);
      router.replace('/admin/offers');
    }
  }, [searchParams, router]);

  const handleEdit = (offer: Offer) => {
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      offer_type: offer.offer_type || 'product',
      discount_percent: offer.discount_percent != null ? String(offer.discount_percent) : '',
      badge: offer.badge || '',
      link: offer.link || '',
      valid_until: offer.valid_until ? offer.valid_until.slice(0, 10) : '',
      is_active: offer.is_active,
      bg_color: offer.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)',
      discount: offer.discount || '',
      selected_product_ids: (offer.offer_products || []).map((lp) => lp.product_id),
    });
    setEditingId(offer.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSectionVisibility = async () => {
    setVisibilityLoading(true);
    const newVal = !sectionVisible;
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ key: 'section_visible_offers', value: String(newVal) }]),
    });
    setSectionVisible(newVal);
    setVisibilityLoading(false);
  };

  const getOriginalPrice = () =>
    form.selected_product_ids.reduce((sum, pid) => {
      const p = products.find((pr) => pr.id === pid);
      return sum + (p?.price || 0);
    }, 0);

  const getDiscountedPrice = () => {
    const original = getOriginalPrice();
    const pct = parseFloat(form.discount_percent);
    if (!original || isNaN(pct)) return null;
    return original * (1 - pct / 100);
  };

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      offer_type: form.offer_type,
      badge: form.badge,
      valid_until: form.valid_until || null,
      is_active: form.is_active,
      bg_color: form.bg_color,
      link: form.link,
    };
    if (form.offer_type === 'banner') {
      payload.discount = form.discount;
      payload.discount_percent = null;
      payload.product_ids = [];
    } else {
      payload.discount_percent = form.discount_percent ? parseFloat(form.discount_percent) : null;
      payload.discount = form.discount_percent ? `${form.discount_percent}% OFF` : '';
      payload.product_ids = form.selected_product_ids;
    }
    await fetch(editingId ? `/api/offers/${editingId}` : '/api/offers', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setForm(emptyForm);
    setEditingId(null);
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

  const toggleProductSelection = (pid: string) => {
    setForm((prev) => {
      const already = prev.selected_product_ids.includes(pid);
      if (already) return { ...prev, selected_product_ids: prev.selected_product_ids.filter((id) => id !== pid) };
      if (prev.offer_type === 'product') return { ...prev, selected_product_ids: [pid] };
      return { ...prev, selected_product_ids: [...prev.selected_product_ids, pid] };
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const originalPrice = getOriginalPrice();
  const discountedPrice = getDiscountedPrice();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Offers & Promotions</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">Manage homepage offer banners and product discounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSectionVisibility}
            disabled={visibilityLoading}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-body text-sm font-medium transition-luxury disabled:opacity-50 ${
              sectionVisible
                ? 'border-success/30 bg-success/10 text-success hover:bg-success/20'
                : 'border-border bg-muted text-text-secondary hover:bg-muted/80'
            }`}
          >
            <Icon name={sectionVisible ? 'EyeIcon' : 'EyeSlashIcon'} size={16} />
            {sectionVisible ? 'Section Visible' : 'Section Hidden'}
          </button>
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
          >
            <Icon name="PlusIcon" size={16} /> Add Offer
          </button>
        </div>
      </div>

      {/* New Offer Form */}
      {showForm && (
        <div className="mt-6 rounded-lg bg-card p-6 shadow-luxury">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">{editingId ? 'Edit Offer' : 'New Offer'}</h2>

          {/* Offer Type Selector */}
          <div className="mb-5">
            <label className={labelCls}>Offer Type</label>
            <div className="flex gap-3">
              {(['product', 'combo', 'banner'] as OfferType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, offer_type: type, selected_product_ids: [] }))}
                  className={`flex-1 rounded-md border py-2.5 font-body text-sm font-medium transition-luxury ${
                    form.offer_type === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {type === 'product' ? 'Single Product' : type === 'combo' ? 'Combo Bundle' : 'Banner Only'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Summer Sale"
                className={inputCls}
              />
            </div>

            {form.offer_type === 'banner' ? (
              <div>
                <label className={labelCls}>Discount Label</label>
                <input
                  value={form.discount}
                  onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
                  placeholder="20% OFF"
                  className={inputCls}
                />
              </div>
            ) : (
              <div>
                <label className={labelCls}>Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.discount_percent}
                  onChange={(e) => setForm((p) => ({ ...p, discount_percent: e.target.value }))}
                  placeholder="e.g. 20"
                  className={inputCls}
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Limited time deal on our finest fragrances"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Badge Text</label>
              <input
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="HOT DEAL"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Valid Until</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm((p) => ({ ...p, valid_until: e.target.value }))}
                className={inputCls}
              />
            </div>

            {form.offer_type === 'banner' && (
              <>
                <div>
                  <label className={labelCls}>Link</label>
                  <input
                    value={form.link}
                    onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                    placeholder="/shop-catalog"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Background (CSS gradient or color)</label>
                  <input
                    value={form.bg_color}
                    onChange={(e) => setForm((p) => ({ ...p, bg_color: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="h-4 w-4"
              />
              <label className="font-body text-sm text-text-primary">Active (show on homepage)</label>
            </div>
          </div>

          {/* Product Picker */}
          {form.offer_type !== 'banner' && (
            <div className="mt-5">
              <label className={labelCls}>
                {form.offer_type === 'product' ? 'Select Product' : 'Select Products for Bundle'}
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className={`${inputCls} mb-3`}
              />
              <div className="max-h-60 overflow-y-auto rounded-md border border-border">
                {filteredProducts.map((p) => {
                  const selected = form.selected_product_ids.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProductSelection(p.id)}
                      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-luxury last:border-0 ${
                        selected ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${selected ? 'border-primary bg-primary' : 'border-border'}`}>
                        {selected && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                      </div>
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="font-body text-sm font-medium text-text-primary">{p.name}</p>
                        <p className="font-body text-xs text-text-secondary">AED {p.price?.toFixed(2)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Price Preview */}
              {form.selected_product_ids.length > 0 && (
                <div className="mt-4 rounded-lg bg-muted px-5 py-4">
                  <p className="mb-2 font-body text-xs uppercase tracking-wide text-text-secondary">Price Preview</p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-body text-sm text-text-secondary line-through">
                      AED {originalPrice.toFixed(2)}
                    </span>
                    {discountedPrice !== null ? (
                      <>
                        <span className="font-heading text-2xl font-bold text-primary">
                          AED {discountedPrice.toFixed(2)}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-xs font-bold text-primary">
                          {form.discount_percent}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="font-heading text-2xl font-bold text-primary">
                        AED {originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {form.offer_type === 'combo' && form.selected_product_ids.length > 1 && (
                    <p className="mt-1 font-body text-xs text-text-secondary">
                      Bundle of {form.selected_product_ids.length} products
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.title || (form.offer_type !== 'banner' && form.selected_product_ids.length === 0)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50"
            >
              <Icon name="CheckIcon" size={16} /> {saving ? 'Saving...' : 'Save Offer'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
              className="rounded-md border border-border px-5 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
            >
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
          {offers.map((offer) => {
            const linked = offer.offer_products || [];
            const origTotal = linked.reduce((s, lp) => s + (lp.products?.price || 0), 0);
            const discTotal = offer.discount_percent ? origTotal * (1 - offer.discount_percent / 100) : null;
            return (
              <div
                key={offer.id}
                className={`rounded-lg border border-border bg-card p-4 shadow-luxury-sm ${!offer.is_active ? 'opacity-60' : ''}`}
              >
                {/* Top row: color swatch + info */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg" style={{ background: offer.bg_color || '#1a1a2e' }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-body text-sm font-semibold text-text-primary">{offer.title}</p>
                      {offer.badge && <span className="rounded-full bg-accent/10 px-2 py-0.5 font-body text-xs text-accent">{offer.badge}</span>}
                      <span className={`rounded-full px-2 py-0.5 font-body text-xs font-medium ${
                        offer.offer_type === 'combo' ? 'bg-purple-100 text-purple-700' :
                        offer.offer_type === 'product' ? 'bg-blue-100 text-blue-700' :
                        'bg-muted text-text-secondary'
                      }`}>
                        {offer.offer_type === 'combo' ? 'Combo' : offer.offer_type === 'product' ? 'Product' : 'Banner'}
                      </span>
                    </div>

                    {offer.offer_type !== 'banner' && linked.length > 0 && (
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-body text-xs text-text-secondary line-through">AED {origTotal.toFixed(2)}</span>
                        {discTotal !== null && (
                          <>
                            <span className="font-body text-sm font-bold text-primary">AED {discTotal.toFixed(2)}</span>
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-body text-xs font-bold text-primary">{offer.discount_percent}% OFF</span>
                          </>
                        )}
                      </div>
                    )}

                    {offer.offer_type === 'banner' && offer.discount && (
                      <span className="font-body text-sm font-bold text-primary">{offer.discount}</span>
                    )}

                    {linked.length > 0 && (
                      <p className="font-body text-xs text-text-secondary">
                        {linked.map((lp) => lp.products?.name).filter(Boolean).join(' + ')}
                      </p>
                    )}

                    {offer.description && (
                      <p className="font-body text-xs text-text-secondary">{offer.description}</p>
                    )}

                    {offer.valid_until && (
                      <p className="font-body text-xs text-text-secondary">Valid until: {new Date(offer.valid_until).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                {/* Bottom row: action buttons */}
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <button
                    onClick={() => toggleActive(offer)}
                    className={`rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${
                      offer.is_active ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-error/10 text-error hover:bg-error/20'
                    }`}
                  >
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleEdit(offer)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-4 py-1.5 font-body text-xs font-semibold text-primary transition-luxury hover:bg-primary/20"
                  >
                    <Icon name="PencilSquareIcon" size={14} />
                    Edit Offer
                  </button>
                  <button
                    onClick={() => deleteOffer(offer.id, offer.title)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-xs font-medium text-error transition-luxury hover:bg-error/10"
                  >
                    <Icon name="TrashIcon" size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminOffersPage() {
  return (
    <Suspense fallback={<div className="h-8 w-48 animate-pulse rounded bg-muted" />}>
      <OffersPageContent />
    </Suspense>
  );
}
