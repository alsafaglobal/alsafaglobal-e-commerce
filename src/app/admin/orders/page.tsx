'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

interface OrderItem {
  id: string | number;
  name: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  total: number;
  payment_intent_id: string;
  payment_status: string;
  created_at: string;
}

type SortOption =
  | 'newest'
  | 'oldest'
  | 'amount_high'
  | 'amount_low'
  | 'paid_first'
  | 'pending_first';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  amount_high: 'Highest Amount',
  amount_low: 'Lowest Amount',
  paid_first: 'Paid First',
  pending_first: 'Pending First',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Analytics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const now = new Date();
    const thisMonth = orders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthRevenue = thisMonth.reduce((sum, o) => sum + (o.total || 0), 0);
    const today = orders.filter((o) => new Date(o.created_at).toDateString() === now.toDateString());
    return { total: orders.length, totalRevenue, monthCount: thisMonth.length, monthRevenue, todayCount: today.length };
  }, [orders]);

  // Sorted orders
  const sortedOrders = useMemo(() => {
    const arr = [...orders];
    switch (sortBy) {
      case 'newest':     return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':     return arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'amount_high':return arr.sort((a, b) => (b.total || 0) - (a.total || 0));
      case 'amount_low': return arr.sort((a, b) => (a.total || 0) - (b.total || 0));
      case 'paid_first': return arr.sort((a, b) => (a.payment_status === 'paid' ? -1 : 1) - (b.payment_status === 'paid' ? -1 : 1));
      case 'pending_first': return arr.sort((a, b) => (a.payment_status !== 'paid' ? -1 : 1) - (b.payment_status !== 'paid' ? -1 : 1));
      default: return arr;
    }
  }, [orders, sortBy]);

  const exportCSV = () => {
    const header = ['Order #', 'Customer', 'Email', 'Phone', 'Address', 'City', 'Country', 'Total (AED)', 'Status', 'Date'];
    const rows = sortedOrders.map((o) => [
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.customer_phone || '',
      o.shipping_address?.address || '',
      o.shipping_address?.city || '',
      o.shipping_address?.country || '',
      o.total?.toFixed(2),
      o.payment_status,
      new Date(o.created_at).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const dateStr = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' });
    const rows = sortedOrders.map((o) => `
      <tr>
        <td>${o.order_number}</td>
        <td>${o.customer_name}<br/><small>${o.customer_email}</small><br/><small>${o.customer_phone || ''}</small></td>
        <td>${o.shipping_address?.city || ''}, ${o.shipping_address?.country || ''}</td>
        <td style="text-align:right">AED ${o.total?.toFixed(2)}</td>
        <td style="text-align:center">
          <span style="padding:2px 8px;border-radius:99px;font-size:11px;background:${o.payment_status === 'paid' ? '#dcfce7' : '#fef9c3'};color:${o.payment_status === 'paid' ? '#16a34a' : '#a16207'}">
            ${o.payment_status}
          </span>
        </td>
        <td>${new Date(o.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Orders Report — Al Safa Global</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 28px; }
    .stat { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 20px; flex: 1; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .stat-value { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
    td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    td small { color: #6b7280; font-size: 11px; }
    tr:last-child td { border-bottom: none; }
    .footer { margin-top: 32px; text-align: center; color: #9ca3af; font-size: 11px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Al Safa Global — Orders Report</h1>
  <p class="meta">Generated on ${dateStr} · Sorted by: ${SORT_LABELS[sortBy]}</p>

  <div class="stats">
    <div class="stat"><div class="stat-label">Total Orders</div><div class="stat-value">${stats.total}</div></div>
    <div class="stat"><div class="stat-label">Total Revenue</div><div class="stat-value" style="color:#7c3aed">AED ${stats.totalRevenue.toFixed(2)}</div></div>
    <div class="stat"><div class="stat-label">This Month</div><div class="stat-value">${stats.monthCount} <small style="font-size:13px;font-weight:400">/ AED ${stats.monthRevenue.toFixed(2)}</small></div></div>
    <div class="stat"><div class="stat-label">Today</div><div class="stat-value">${stats.todayCount}</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Order #</th>
        <th>Customer</th>
        <th>Location</th>
        <th style="text-align:right">Total</th>
        <th style="text-align:center">Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Al Safa Global General Trading FZ LLC · info@alsafaglobal.com</div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Orders & Analytics</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">All customer orders from your store</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
            >
              <Icon name="AdjustmentsHorizontalIcon" size={16} />
              {SORT_LABELS[sortBy]}
              <Icon name="ChevronDownIcon" size={14} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-card shadow-luxury">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setSortOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm transition-luxury first:rounded-t-lg last:rounded-b-lg hover:bg-muted ${sortBy === key ? 'text-primary font-medium' : 'text-text-primary'}`}
                  >
                    {SORT_LABELS[key]}
                    {sortBy === key && <Icon name="CheckIcon" size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
          >
            <Icon name="TableCellsIcon" size={16} />
            CSV
          </button>

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
          >
            <Icon name="DocumentTextIcon" size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-card p-5 shadow-luxury-sm">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Total Orders</p>
          <p className="mt-2 font-data text-3xl font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-card p-5 shadow-luxury-sm">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Total Revenue</p>
          <p className="mt-2 font-data text-2xl font-bold text-primary">AED {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-card p-5 shadow-luxury-sm">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-text-secondary">This Month</p>
          <p className="mt-2 font-data text-3xl font-bold text-text-primary">{stats.monthCount}</p>
          <p className="font-data text-sm text-primary">AED {stats.monthRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-card p-5 shadow-luxury-sm">
          <p className="font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Today</p>
          <p className="mt-2 font-data text-3xl font-bold text-text-primary">{stats.todayCount}</p>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <Icon name="ShoppingBagIcon" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-body text-text-secondary">No orders yet. Orders will appear here after customers checkout.</p>
        </div>
      ) : (
        <>
          {/* Close dropdown when clicking outside */}
          {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
          <div className="mt-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Order</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Customer</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Location</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-right">Total</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Status</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Date</th>
                  <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary text-center">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {sortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className="cursor-pointer transition-luxury hover:bg-muted/50"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-data text-sm font-medium text-text-primary">{order.order_number}</p>
                        <p className="max-w-[120px] truncate font-data text-xs text-text-secondary">{order.payment_intent_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-body text-sm font-medium text-text-primary">{order.customer_name}</p>
                        <p className="font-body text-xs text-text-secondary">{order.customer_email}</p>
                        <p className="font-body text-xs text-text-secondary">{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-text-secondary">
                        {order.shipping_address?.city}, {order.shipping_address?.country}
                      </td>
                      <td className="px-4 py-3 text-right font-data text-sm font-semibold text-primary">
                        AED {order.total?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 font-body text-xs font-medium ${
                          order.payment_status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-text-secondary">
                        {new Date(order.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-data text-xs text-primary">
                          {(order.items || []).length} items
                          <Icon name={expandedId === order.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} />
                        </span>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-muted/30">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="space-y-2">
                            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-text-secondary">Order Items</p>
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-md bg-card px-4 py-2.5">
                                <div>
                                  <p className="font-body text-sm font-medium text-text-primary">{item.name}</p>
                                  <p className="font-body text-xs text-text-secondary">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                                </div>
                                <p className="font-data text-sm font-semibold text-primary">AED {(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                            <div className="mt-3 flex justify-end">
                              <p className="font-body text-sm font-semibold text-text-primary">
                                Total: <span className="text-primary">AED {order.total?.toFixed(2)}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
