'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { COUNTRIES } from '@/lib/countries';

const COUNTRY_OPTIONS = COUNTRIES;

interface DeliveryCharge {
  id: string;
  country_name: string;
  charge_aed: number;
  is_active: boolean;
  created_at: string;
}

const emptyForm = { country_name: '', charge_aed: '' };

export default function DeliveryChargesPage() {
  const [charges, setCharges] = useState<DeliveryCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchCharges = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/delivery-charges');
    const data = await res.json();
    if (Array.isArray(data)) setCharges(data);
    setLoading(false);
  };

  useEffect(() => { fetchCharges(); }, []);

  const handleEdit = (charge: DeliveryCharge) => {
    setForm({ country_name: charge.country_name, charge_aed: String(charge.charge_aed) });
    setEditingId(charge.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!form.country_name || !form.charge_aed) {
      setError('Please fill in all fields.');
      return;
    }
    const charge = parseFloat(form.charge_aed);
    if (isNaN(charge) || charge < 0) {
      setError('Please enter a valid charge amount.');
      return;
    }
    setSaving(true);
    setError('');

    const url = editingId ? `/api/admin/delivery-charges/${editingId}` : '/api/admin/delivery-charges';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country_name: form.country_name, charge_aed: charge }),
    });

    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await fetchCharges();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, country: string) => {
    if (!confirm(`Remove delivery charge for ${country}?`)) return;
    await fetch(`/api/admin/delivery-charges/${id}`, { method: 'DELETE' });
    await fetchCharges();
  };

  const toggleActive = async (charge: DeliveryCharge) => {
    await fetch(`/api/admin/delivery-charges/${charge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country_name: charge.country_name,
        charge_aed: charge.charge_aed,
        is_active: !charge.is_active,
      }),
    });
    await fetchCharges();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const usedCountries = charges.map((c) => c.country_name);
  const availableCountries = COUNTRY_OPTIONS.filter(
    (c) => !usedCountries.includes(c) || c === form.country_name
  );

  const inputCls = 'w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';
  const labelCls = 'mb-1.5 block font-body text-sm font-medium text-text-primary';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Delivery Charges</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Set delivery charges per country (in AED). Toggle visibility to enable or disable per country.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
          >
            <Icon name="PlusIcon" size={16} />
            Add Country
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            {editingId ? 'Edit Delivery Charge' : 'New Delivery Charge'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Country</label>
              <select
                value={form.country_name}
                onChange={(e) => setForm((p) => ({ ...p, country_name: e.target.value }))}
                className={inputCls}
                disabled={!!editingId}
              >
                <option value="">Select a country…</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Delivery Charge (AED)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.charge_aed}
                onChange={(e) => setForm((p) => ({ ...p, charge_aed: e.target.value }))}
                placeholder="e.g. 25.00"
                className={inputCls}
              />
            </div>
          </div>

          {error && <p className="mt-3 font-body text-sm text-error">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <><Icon name="ArrowPathIcon" size={14} className="animate-spin" /> Saving…</> : <><Icon name="CheckIcon" size={14} /> Save</>}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-md border border-border px-5 py-2.5 font-body text-sm text-text-primary transition-luxury hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg bg-card shadow-luxury-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-body text-sm text-text-secondary">Loading…</div>
        ) : charges.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-heading text-lg font-semibold text-text-primary">No delivery charges set</p>
            <p className="mt-1 font-body text-sm text-text-secondary">Add charges for each country you ship to. Countries without a charge set will have free delivery.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Country</th>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Charge (AED)</th>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Status</th>
                <th className="px-6 py-3 text-right font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {charges.map((charge) => (
                <tr key={charge.id} className={`hover:bg-muted/30 transition-luxury ${!charge.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-body text-sm font-medium text-text-primary">
                    {charge.country_name}
                  </td>
                  <td className="px-6 py-4 font-data text-sm text-text-primary">
                    AED {Number(charge.charge_aed).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(charge)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium transition-luxury ${
                        charge.is_active
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-muted text-text-secondary hover:bg-muted/80'
                      }`}
                    >
                      <Icon name={charge.is_active ? 'EyeIcon' : 'EyeSlashIcon'} size={12} />
                      {charge.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(charge)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 font-body text-xs font-medium text-primary transition-luxury hover:bg-primary/20"
                      >
                        <Icon name="PencilSquareIcon" size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(charge.id, charge.country_name)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-error/10 px-3 py-1.5 font-body text-xs font-medium text-error transition-luxury hover:bg-error hover:text-white"
                      >
                        <Icon name="TrashIcon" size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="font-body text-xs text-text-secondary">
          <strong className="text-text-primary">Note:</strong> Charges are stored in AED and automatically converted to the customer's local currency at checkout. Hidden countries will have free delivery applied.
        </p>
      </div>
    </div>
  );
}
