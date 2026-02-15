'use client';

import React from 'react';

interface FilterChipsProps {
  selectedFilters: string[];
  onFilterToggle: (filter: string) => void;
  filterCounts: Record<string, number>;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  selectedFilters,
  onFilterToggle,
  filterCounts,
}) => {
  const scentTypes = ['Floral', 'Woody', 'Fresh', 'Oriental'];

  return (
    <div className="flex flex-wrap gap-3">
      {scentTypes.map((scent) => {
        const isSelected = selectedFilters.includes(scent);
        const count = filterCounts[scent] || 0;

        return (
          <button
            key={scent}
            onClick={() => onFilterToggle(scent)}
            disabled={count === 0 && !isSelected}
            className={`rounded-full px-5 py-2.5 font-body text-sm font-medium transition-luxury disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-luxury-sm'
                : 'bg-muted text-text-secondary hover:bg-secondary hover:text-secondary-foreground'
            }`}
            aria-pressed={isSelected}
          >
            {scent}
            <span className="ml-2 font-data text-xs opacity-75">({count})</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;