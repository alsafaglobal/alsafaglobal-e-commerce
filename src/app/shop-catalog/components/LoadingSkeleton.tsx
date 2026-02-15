import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg bg-card shadow-luxury"
          role="status"
          aria-label="Loading product"
        >
          <div className="aspect-[3/4] animate-pulse bg-muted" />
          <div className="p-4">
            <div className="mb-2 h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="mb-2 h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;