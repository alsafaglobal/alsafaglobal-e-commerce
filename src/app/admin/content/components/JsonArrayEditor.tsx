'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea';
}

interface JsonArrayEditorProps {
  value: string;
  onChange: (value: string) => void;
  fields: FieldDef[];
  label: string;
}

export default function JsonArrayEditor({ value, onChange, fields, label }: JsonArrayEditorProps) {
  let items: Record<string, string>[] = [];
  try {
    items = JSON.parse(value || '[]');
  } catch {
    items = [];
  }

  const update = (newItems: Record<string, string>[]) => {
    onChange(JSON.stringify(newItems));
  };

  const handleFieldChange = (index: number, fieldName: string, fieldValue: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [fieldName]: fieldValue };
    update(updated);
  };

  const addItem = () => {
    const blank: Record<string, string> = {};
    fields.forEach((f) => { blank[f.name] = ''; });
    update([...items, blank]);
  };

  const removeItem = (index: number) => {
    update(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    update(updated);
  };

  return (
    <div>
      <label className="mb-2 block font-body text-sm font-semibold text-text-primary">{label}</label>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-data text-xs text-text-secondary">Item {idx + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                  className="rounded p-1 text-text-secondary hover:bg-muted disabled:opacity-30">
                  <Icon name="ChevronUpIcon" size={14} />
                </button>
                <button type="button" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1}
                  className="rounded p-1 text-text-secondary hover:bg-muted disabled:opacity-30">
                  <Icon name="ChevronDownIcon" size={14} />
                </button>
                <button type="button" onClick={() => removeItem(idx)}
                  className="rounded p-1 text-error hover:bg-error/10">
                  <Icon name="TrashIcon" size={14} />
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="mb-1 block font-body text-xs text-text-secondary">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.name] || ''}
                      onChange={(e) => handleFieldChange(idx, field.name, e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-md border border-border bg-input px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <input
                      value={item[field.name] || ''}
                      onChange={(e) => handleFieldChange(idx, field.name, e.target.value)}
                      className="w-full rounded-md border border-border bg-input px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 font-body text-xs font-medium text-text-primary hover:bg-muted/80">
        <Icon name="PlusIcon" size={14} />
        Add Item
      </button>
    </div>
  );
}
