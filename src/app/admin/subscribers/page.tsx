'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      setSubscribers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const exportCSV = () => {
    const csv = ['Email,Subscribed Date', ...subscribers.map((s) => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Newsletter Subscribers</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
          </p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted">
            <Icon name="ArrowDownTrayIcon" size={16} />
            Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : subscribers.length === 0 ? (
        <div className="mt-12 text-center">
          <Icon name="EnvelopeIcon" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="font-body text-text-secondary">No subscribers yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">#</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Email</th>
                <th className="px-4 py-3 font-body text-xs font-medium uppercase tracking-wider text-text-secondary">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {subscribers.map((sub, i) => (
                <tr key={sub.id}>
                  <td className="px-4 py-3 font-data text-sm text-text-secondary">{i + 1}</td>
                  <td className="px-4 py-3 font-body text-sm text-text-primary">{sub.email}</td>
                  <td className="px-4 py-3 font-body text-sm text-text-secondary">
                    {new Date(sub.subscribed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
