'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  scent_type: string;
  is_active: boolean;
  is_featured: boolean;
  is_fast_moving: boolean;
  is_best_selling: boolean;
  stock: number | null;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleField = async (id: string, field: 'is_active' | 'is_featured' | 'is_fast_moving' | 'is_best_selling', value: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const saveStock = async (id: string) => {
    const value = parseInt(stockInput);
    if (isNaN(value) || value < 0) { setEditingStock(null); return; }
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: value }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: value } : p)));
    setEditingStock(null);
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Products
          </h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            {products.length} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
        >
          <Icon name="PlusIcon" size={16} />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-12 text-center">
          <Icon name="ShoppingBagIcon" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-body text-text-secondary">No products yet.</p>
          <Link href="/admin/products/new" className="mt-4 inline-block font-body text-sm text-primary underline">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Product</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Type</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Price</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Visibility</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Featured</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Fast Moving</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Best Selling</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Stock</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {products.map((product) => (
                <tr key={product.id} className={`transition-luxury ${!product.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <AppImage src={product.image_url || ''} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-text-primary">{product.name}</p>
                        <p className="font-body text-xs text-text-secondary">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-body text-xs text-secondary-foreground">
                      {product.scent_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-data text-sm text-text-primary">
                    AED {product.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_active', !product.is_active)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${
                        product.is_active
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-error/10 text-error hover:bg-error/20'
                      }`}
                      title={product.is_active ? 'Click to hide from shop' : 'Click to show on shop'}
                    >
                      <Icon name={product.is_active ? 'EyeIcon' : 'EyeSlashIcon'} size={14} />
                      {product.is_active ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_featured', !product.is_featured)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${
                        product.is_featured
                          ? 'bg-warning/10 text-warning hover:bg-warning/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      title={product.is_featured ? 'Remove from homepage' : 'Show on homepage'}
                    >
                      <Icon name="StarIcon" size={14} variant={product.is_featured ? 'solid' : 'outline'} />
                      {product.is_featured ? 'Featured' : 'Normal'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_fast_moving', !product.is_fast_moving)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${
                        product.is_fast_moving
                          ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      title={product.is_fast_moving ? 'Remove Fast Moving tag' : 'Mark as Fast Moving'}
                    >
                      <Icon name="BoltIcon" size={14} />
                      {product.is_fast_moving ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_best_selling', !product.is_best_selling)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-luxury ${
                        product.is_best_selling
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      title={product.is_best_selling ? 'Remove Best Selling tag' : 'Mark as Best Selling'}
                    >
                      <Icon name="TrophyIcon" size={14} />
                      {product.is_best_selling ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingStock === product.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveStock(product.id); if (e.key === 'Escape') setEditingStock(null); }}
                          className="w-16 rounded border border-border bg-input px-2 py-1 text-center font-data text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                        <button onClick={() => saveStock(product.id)} className="text-success hover:opacity-80">
                          <Icon name="CheckIcon" size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingStock(product.id); setStockInput(String(product.stock ?? '')); }}
                        className={`font-data text-sm font-medium ${product.stock !== null && product.stock <= 5 ? 'text-error' : 'text-text-primary'} hover:underline`}
                        title="Click to edit stock"
                      >
                        {product.stock === null ? '—' : product.stock === 0 ? 'Out' : product.stock}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/offers?add_product=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}`)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-body text-xs font-medium text-accent transition-luxury hover:bg-accent/10"
                        title="Add to Offers"
                      >
                        <Icon name="TagIcon" size={14} />
                        Offer
                      </button>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-body text-xs font-medium text-primary transition-luxury hover:bg-primary/10"
                      >
                        <Icon name="PencilIcon" size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-body text-xs font-medium text-error transition-luxury hover:bg-error/10"
                      >
                        <Icon name="TrashIcon" size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
