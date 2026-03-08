'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('File must be under 50MB'); return; }

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed. Please try again.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <label className="mb-1 block font-body text-sm font-medium text-text-primary">{label}</label>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted/80 disabled:opacity-50"
        >
          {uploading ? (
            <><Icon name="ArrowPathIcon" size={16} className="animate-spin" /> Uploading...</>
          ) : (
            <><Icon name="ArrowUpTrayIcon" size={16} /> Upload</>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {error && <p className="mt-1 font-body text-xs text-error">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="mt-3 flex items-start gap-3">
          <div className="relative h-24 w-40 overflow-hidden rounded-md border border-border">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-1 rounded p-1 text-error hover:bg-error/10"
            title="Remove image"
          >
            <Icon name="TrashIcon" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
