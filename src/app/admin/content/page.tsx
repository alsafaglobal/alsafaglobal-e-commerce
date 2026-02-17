'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ContentItem {
  key: string;
  value: string;
}

const contentSections = [
  {
    title: 'Homepage Hero',
    keys: [
      { key: 'hero_title', label: 'Headline', type: 'text' },
      { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'hero_button_text', label: 'Button Text', type: 'text' },
    ],
  },
  {
    title: 'Site Identity',
    keys: [
      { key: 'site_name', label: 'Brand Name', type: 'text' },
      { key: 'site_tagline', label: 'Tagline', type: 'text' },
      { key: 'footer_tagline', label: 'Footer Description', type: 'textarea' },
    ],
  },
  {
    title: 'Newsletter Section',
    keys: [
      { key: 'newsletter_title', label: 'Title', type: 'text' },
      { key: 'newsletter_subtitle', label: 'Subtitle', type: 'textarea' },
    ],
  },
  {
    title: 'Contact Info',
    keys: [
      { key: 'contact_email', label: 'Email', type: 'text' },
      { key: 'contact_phone', label: 'Phone', type: 'text' },
      { key: 'contact_address', label: 'Address', type: 'textarea' },
    ],
  },
  {
    title: 'SEO',
    keys: [
      { key: 'meta_title', label: 'Page Title', type: 'text' },
      { key: 'meta_description', label: 'Meta Description', type: 'textarea' },
    ],
  },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      const map: Record<string, string> = {};
      (data.items || []).forEach((item: ContentItem) => {
        map[item.key] = item.value;
      });
      setContent(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const items = Object.entries(content).map(([key, value]) => ({ key, value }));
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Site Content</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Edit all text visible on the website
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50">
          <Icon name={saved ? 'CheckIcon' : 'ArrowUpTrayIcon'} size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {contentSections.map((section) => (
          <div key={section.title} className="rounded-lg bg-card p-6 shadow-luxury-sm">
            <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.keys.map(({ key, label, type }) => (
                <div key={key}>
                  <label className="mb-1 block font-body text-sm font-medium text-text-primary">
                    {label}
                    <span className="ml-2 font-data text-xs text-text-secondary">({key})</span>
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={content[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full resize-none rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <input
                      value={content[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating save bar */}
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground shadow-luxury transition-luxury hover:opacity-90 disabled:opacity-50">
          <Icon name={saved ? 'CheckIcon' : 'ArrowUpTrayIcon'} size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
