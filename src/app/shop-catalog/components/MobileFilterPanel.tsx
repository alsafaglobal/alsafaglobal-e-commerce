'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MobileFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterToggle: (filter: string) => void;
  filterCounts: Record<string, number>;
  onClearAll: () => void;
}

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
  isOpen,
  onClose,
  selectedFilters,
  onFilterToggle,
  filterCounts,
  onClearAll,
}) => {
  const scentTypes = ['Floral', 'Woody', 'Fresh', 'Oriental'];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card shadow-luxury-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-panel-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 id="filter-panel-title" className="font-heading text-xl font-semibold text-text-primary">
            Filter Perfumes
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-luxury hover:bg-muted"
            aria-label="Close filter panel"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-primary" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-body text-sm text-text-secondary">
              {selectedFilters.length} {selectedFilters.length === 1 ? 'filter' : 'filters'} applied
            </p>
            {selectedFilters.length > 0 && (
              <button
                onClick={onClearAll}
                className="font-body text-sm font-medium text-primary transition-luxury hover:text-accent"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-text-secondary">
              Scent Type
            </h3>
            {scentTypes.map((scent) => {
              const isSelected = selectedFilters.includes(scent);
              const count = filterCounts[scent] || 0;

              return (
                <button
                  key={scent}
                  onClick={() => onFilterToggle(scent)}
                  disabled={count === 0 && !isSelected}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-luxury disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-luxury-sm'
                      : 'bg-muted text-text-primary hover:bg-secondary'
                  }`}
                >
                  <span className="font-body text-base font-medium">{scent}</span>
                  <span className="font-data text-sm opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-primary px-6 py-3 font-body text-base font-semibold text-primary-foreground shadow-luxury transition-luxury hover:opacity-90"
          >
            View Results
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterPanel;