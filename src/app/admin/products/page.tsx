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
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleField = async (id: string, field: 'is_active' | 'is_featured', value: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
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
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Active</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Featured</th>
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
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_active', !product.is_active)}
                      className={`rounded-full px-3 py-1 font-body text-xs font-medium transition-luxury ${
                        product.is_active
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(product.id, 'is_featured', !product.is_featured)}
                      className={`transition-luxury ${product.is_featured ? 'text-warning' : 'text-muted-foreground'}`}
                    >
                      <Icon name={product.is_featured ? 'StarIcon' : 'StarIcon'} size={20} variant={product.is_featured ? 'solid' : 'outline'} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-md p-1.5 text-text-secondary transition-luxury hover:bg-muted hover:text-primary"
                      >
                        <Icon name="PencilIcon" size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="rounded-md p-1.5 text-text-secondary transition-luxury hover:bg-error/10 hover:text-error"
                      >
                        <Icon name="TrashIcon" size={16} />
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
