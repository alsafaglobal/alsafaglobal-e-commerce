'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface ProductImageGalleryProps {
  images: Array<{ url: string; alt: string }>;
  productName: string;
}

const isVideoUrl = (url: string) =>
  /\.(mp4|webm|ogg|mov)$/i.test(url) ||
  url.includes('youtube.com') ||
  url.includes('youtu.be') ||
  url.includes('vimeo.com');

const getYouTubeEmbedId = (url: string) => {
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
};

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="w-full">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <div className="h-full w-full animate-pulse bg-muted" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
              <div className="h-full w-full animate-pulse bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selected = images[selectedImageIndex];
  const selectedIsVideo = isVideoUrl(selected.url);
  const ytId = selectedIsVideo ? getYouTubeEmbedId(selected.url) : null;

  return (
    <div className="w-full">
      {/* Main display */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-card shadow-luxury">
        {selectedIsVideo ? (
          ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={selected.alt}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={selected.url}
              controls
              className="h-full w-full object-cover"
              title={selected.alt}
            />
          )
        ) : (
          <AppImage
            src={selected.url}
            alt={selected.alt}
            className="h-full w-full object-cover transition-luxury hover:scale-105"
          />
        )}
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((image, index) => {
            const isVideo = isVideoUrl(image.url);
            return (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square overflow-hidden rounded-md transition-luxury ${
                  selectedImageIndex === index
                    ? 'ring-2 ring-accent'
                    : 'ring-1 ring-border hover:ring-2 hover:ring-primary'
                }`}
              >
                {isVideo ? (
                  <div className="flex h-full items-center justify-center bg-black/80">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                ) : (
                  <AppImage
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
