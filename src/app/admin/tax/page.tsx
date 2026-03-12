'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { COUNTRIES } from '@/lib/countries';

interface TaxRate {
  id: string;
  country_name: string;
  tax_percent: number;
  is_active: boolean;
  created_at: string;
}

const emptyForm = { country_name: '', tax_percent: '' };

export default function TaxRatesPage() {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/tax-rates');
    const data = await res.json();
    if (Array.isArray(data)) setRates(data);
    setLoading(false);
  };

  useEffect(() => { fetchRates(); }, []);

  const handleEdit = (rate: TaxRate) => {
    setForm({ country_name: rate.country_name, tax_percent: String(rate.tax_percent) });
    setEditingId(rate.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!form.country_name || !form.tax_percent) {
      setError('Please fill in all fields.');
      return;
    }
    const percent = parseFloat(form.tax_percent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      setError('Please enter a valid percentage between 0 and 100.');
      return;
    }
    setSaving(true);
    setError('');

    const url = editingId ? `/api/admin/tax-rates/${editingId}` : '/api/admin/tax-rates';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country_name: form.country_name, tax_percent: percent }),
    });

    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await fetchRates();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, country: string) => {
    if (!confirm(`Remove tax rate for ${country}?`)) return;
    await fetch(`/api/admin/tax-rates/${id}`, { method: 'DELETE' });
    await fetchRates();
  };

  const toggleActive = async (rate: TaxRate) => {
    setTogglingId(rate.id);
    setError('');
    const res = await fetch(`/api/admin/tax-rates/${rate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country_name: rate.country_name,
        tax_percent: rate.tax_percent,
        is_active: !rate.is_active,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to update status.');
    }
    await fetchRates();
    setTogglingId(null);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const usedCountries = rates.map((r) => r.country_name);
  const availableCountries = COUNTRIES.filter(
    (c) => !usedCountries.includes(c) || c === form.country_name
  );

  const inputCls = 'w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring';
  const labelCls = 'mb-1.5 block font-body text-sm font-medium text-text-primary';

  return (
    <div className="space-y-6">
      {error && !showForm && (
        <div className="rounded-md border border-error/20 bg-error/10 px-4 py-3 font-body text-sm text-error">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Tax Rates</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Set tax percentages per country. Applied on top of the product subtotal at checkout.
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

      {showForm && (
        <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            {editingId ? 'Edit Tax Rate' : 'New Tax Rate'}
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
              <label className={labelCls}>Tax Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.tax_percent}
                onChange={(e) => setForm((p) => ({ ...p, tax_percent: e.target.value }))}
                placeholder="e.g. 5.00"
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

      <div className="overflow-hidden rounded-lg bg-card shadow-luxury-sm">
        {loading ? (
          <div className="p-8 text-center font-body text-sm text-text-secondary">Loading…</div>
        ) : rates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-heading text-lg font-semibold text-text-primary">No tax rates set</p>
            <p className="mt-1 font-body text-sm text-text-secondary">Countries without a tax rate will have 0% tax applied.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Country</th>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Tax (%)</th>
                <th className="px-6 py-3 text-left font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Status</th>
                <th className="px-6 py-3 text-right font-body text-xs font-medium uppercase tracking-wide text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rates.map((rate) => (
                <tr key={rate.id} className={`transition-luxury hover:bg-muted/30 ${!rate.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-body text-sm font-medium text-text-primary">{rate.country_name}</td>
                  <td className="px-6 py-4 font-data text-sm text-text-primary">{Number(rate.tax_percent).toFixed(2)}%</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(rate)}
                      disabled={togglingId === rate.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium transition-luxury disabled:cursor-wait disabled:opacity-50 ${
                        rate.is_active
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : 'bg-muted text-text-secondary hover:bg-muted/80'
                      }`}
                    >
                      <Icon name={togglingId === rate.id ? 'ArrowPathIcon' : rate.is_active ? 'EyeIcon' : 'EyeSlashIcon'} size={12} className={togglingId === rate.id ? 'animate-spin' : ''} />
                      {togglingId === rate.id ? 'Updating…' : rate.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 font-body text-xs font-medium text-primary transition-luxury hover:bg-primary/20"
                      >
                        <Icon name="PencilSquareIcon" size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id, rate.country_name)}
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
          <strong className="text-text-primary">Note:</strong> Tax is calculated as a percentage of the product subtotal and added to the total at checkout. Hidden countries will have 0% tax applied.
        </p>
      </div>
    </div>
  );
}
