'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt: string;
  sort_order: number;
}

interface MediaGalleryManagerProps {
  productId: string;
  initialMedia?: MediaItem[];
}

export default function MediaGalleryManager({ productId, initialMedia = [] }: MediaGalleryManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const addMedia = async (url: string, type: 'image' | 'video', alt = '') => {
    const res = await fetch(`/api/admin/products/${productId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type, alt, sort_order: media.length }),
    });
    if (res.ok) {
      const newItem = await res.json();
      setMedia((prev) => [...prev, newItem]);
    }
  };

  const removeMedia = async (id: string) => {
    if (!confirm('Remove this media?')) return;
    await fetch(`/api/admin/products/${productId}/media/${id}`, { method: 'DELETE' });
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Please select an image or video file');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be less than 50MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok && data.url) {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        await addMedia(data.url, type, file.name.replace(/\.[^.]+$/, ''));
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed. Please try again.');
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;
    await addMedia(videoUrl.trim(), 'video', 'Product video');
    setVideoUrl('');
    setAddingVideo(false);
  };

  return (
    <div>
      {/* Grid of existing media */}
      {media.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              {item.type === 'video' ? (
                <div className="flex h-full flex-col items-center justify-center bg-black/80 p-2">
                  <Icon name="PlayCircleIcon" size={32} className="text-white" />
                  <p className="mt-1 truncate font-body text-xs text-white/70 w-full text-center">{item.url.split('/').pop()}</p>
                </div>
              ) : (
                <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
              )}
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute right-1 top-1 rounded-full bg-error p-1 text-white opacity-0 shadow transition-all group-hover:opacity-100"
              >
                <Icon name="XMarkIcon" size={12} />
              </button>
              {item.type === 'video' && (
                <span className="absolute bottom-1 left-1 rounded-full bg-black/70 px-2 py-0.5 font-body text-xs text-white">
                  Video
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/50 px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-luxury hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? (
            <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
          ) : (
            <Icon name="PhotoIcon" size={16} />
          )}
          {uploading ? 'Uploading...' : 'Upload Photo / Video'}
        </button>

        <button
          type="button"
          onClick={() => setAddingVideo(!addingVideo)}
          className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/50 px-4 py-2.5 font-body text-sm font-medium text-text-secondary transition-luxury hover:border-primary hover:text-primary"
        >
          <Icon name="LinkIcon" size={16} />
          Add Video URL
        </button>
      </div>

      {addingVideo && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube or video URL..."
            className="flex-1 rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={handleAddVideo}
            disabled={!videoUrl.trim()}
            className="rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAddingVideo(false)}
            className="rounded-md border border-border px-4 py-2.5 font-body text-sm text-text-primary transition-luxury hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />

      {error && <p className="mt-2 font-body text-xs text-error">{error}</p>}

      {media.length === 0 && !uploading && (
        <p className="mt-2 font-body text-xs text-text-secondary">
          No additional media yet. Upload photos or videos to build a gallery for this product.
        </p>
      )}
    </div>
  );
}
