'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ currentUrl, onUpload, label = 'Product Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        setError(data.error || 'Upload failed');
        setPreview(currentUrl || '');
      }
    } catch {
      setError('Upload failed. Please try again.');
      setPreview(currentUrl || '');
    }

    setUploading(false);
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <label className="mb-1 block font-body text-sm font-medium text-text-primary">
        {label}
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-40 rounded-lg border border-border object-cover"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 font-body text-xs font-medium text-text-primary transition-luxury hover:bg-muted/80"
            >
              <Icon name="ArrowPathIcon" size={14} />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-md bg-error/10 px-3 py-1.5 font-body text-xs font-medium text-error transition-luxury hover:bg-error/20"
            >
              <Icon name="TrashIcon" size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-40 w-full max-w-xs flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-luxury hover:border-primary hover:bg-muted"
        >
          {uploading ? (
            <>
              <Icon name="ArrowPathIcon" size={24} className="mb-2 animate-spin text-primary" />
              <span className="font-body text-sm text-text-secondary">Uploading...</span>
            </>
          ) : (
            <>
              <Icon name="PhotoIcon" size={32} className="mb-2 text-text-secondary" />
              <span className="font-body text-sm font-medium text-primary">Click to upload</span>
              <span className="mt-1 font-body text-xs text-text-secondary">PNG, JPG up to 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 font-body text-xs text-error">{error}</p>
      )}
    </div>
  );
}
