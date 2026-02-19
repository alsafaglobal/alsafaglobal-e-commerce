'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface JsonLinksEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function JsonLinksEditor({ value, onChange, label }: JsonLinksEditorProps) {
  let links: { label: string; href: string }[] = [];
  try {
    links = JSON.parse(value || '[]');
  } catch {
    links = [];
  }

  const update = (newLinks: { label: string; href: string }[]) => {
    onChange(JSON.stringify(newLinks));
  };

  const handleChange = (index: number, field: 'label' | 'href', val: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: val };
    update(updated);
  };

  const addLink = () => {
    update([...links, { label: '', href: '' }]);
  };

  const removeLink = (index: number) => {
    update(links.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="mb-2 block font-body text-sm font-semibold text-text-primary">{label}</label>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={link.label}
              onChange={(e) => handleChange(idx, 'label', e.target.value)}
              placeholder="Link text"
              className="w-1/3 rounded-md border border-border bg-input px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={link.href}
              onChange={(e) => handleChange(idx, 'href', e.target.value)}
              placeholder="/page-path"
              className="flex-1 rounded-md border border-border bg-input px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => removeLink(idx)}
              className="rounded p-1.5 text-error hover:bg-error/10">
              <Icon name="TrashIcon" size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addLink}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 font-body text-xs font-medium text-text-primary hover:bg-muted/80">
        <Icon name="PlusIcon" size={14} />
        Add Link
      </button>
    </div>
  );
}
