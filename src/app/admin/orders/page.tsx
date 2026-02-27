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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    const today = orders.filter((o) => {
      const d = new Date(o.created_at);
      return d.toDateString() === now.toDateString();
    });
    return {
      total: orders.length,
      totalRevenue,
      monthCount: thisMonth.length,
      monthRevenue,
      todayCount: today.length,
    };
  }, [orders]);

  const exportCSV = () => {
    const header = ['Order #', 'Customer', 'Email', 'Phone', 'City', 'Country', 'Total (AED)', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.customer_phone,
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Orders & Analytics</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">All customer orders from your store</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
        >
          <Icon name="ArrowDownTrayIcon" size={16} />
          Export CSV
        </button>
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
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="cursor-pointer transition-luxury hover:bg-muted/50"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-data text-sm font-medium text-text-primary">{order.order_number}</p>
                      <p className="font-data text-xs text-text-secondary truncate max-w-[120px]">{order.payment_intent_id}</p>
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
                        order.payment_status === 'paid'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
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
                          <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Order Items</p>
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
      )}
    </div>
  );
}
