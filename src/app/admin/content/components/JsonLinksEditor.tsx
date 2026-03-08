'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface LinkItem { label: string; href: string; visible?: boolean }

interface JsonLinksEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function JsonLinksEditor({ value, onChange, label }: JsonLinksEditorProps) {
  let links: LinkItem[] = [];
  try {
    links = JSON.parse(value || '[]');
  } catch {
    links = [];
  }

  const update = (newLinks: LinkItem[]) => {
    onChange(JSON.stringify(newLinks));
  };

  const handleChange = (index: number, field: 'label' | 'href', val: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: val };
    update(updated);
  };

  const toggleVisible = (index: number) => {
    const updated = [...links];
    updated[index] = { ...updated[index], visible: updated[index].visible === false ? true : false };
    update(updated);
  };

  const addLink = () => {
    update([...links, { label: '', href: '', visible: true }]);
  };

  const removeLink = (index: number) => {
    update(links.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <label className="mb-2 block font-body text-sm font-semibold text-text-primary">{label}</label>}
      <div className="space-y-2">
        {links.map((link, idx) => {
          const isVisible = link.visible !== false;
          return (
            <div key={idx} className={`flex items-center gap-2 rounded-md border p-1.5 ${isVisible ? 'border-border' : 'border-dashed border-border bg-muted/50 opacity-60'}`}>
              <button
                type="button"
                title={isVisible ? 'Hide this link' : 'Show this link'}
                onClick={() => toggleVisible(idx)}
                className={`flex-shrink-0 rounded p-1 transition-colors ${isVisible ? 'text-green-600 hover:text-red-500' : 'text-text-secondary hover:text-green-600'}`}
              >
                <Icon name={isVisible ? 'EyeIcon' : 'EyeSlashIcon'} size={14} />
              </button>
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
                className="flex-shrink-0 rounded p-1.5 text-error hover:bg-error/10">
                <Icon name="TrashIcon" size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={addLink}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 font-body text-xs font-medium text-text-primary hover:bg-muted/80">
        <Icon name="PlusIcon" size={14} />
        Add Link
      </button>
    </div>
  );
}
