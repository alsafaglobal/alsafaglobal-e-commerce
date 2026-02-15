import React from 'react';

interface ScentNotesProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

const ScentNotes: React.FC<ScentNotesProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
}) => {
  return (
    <div className="space-y-6 rounded-lg bg-card p-6 shadow-luxury-sm">
      <h2 className="font-heading text-2xl font-semibold text-text-primary">
        Scent Notes
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="caption font-medium text-text-secondary">Top Notes</h3>
          <p className="mt-2 font-body text-text-primary">
            {topNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="caption font-medium text-text-secondary">
            Heart Notes
          </h3>
          <p className="mt-2 font-body text-text-primary">
            {heartNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="caption font-medium text-text-secondary">
            Base Notes
          </h3>
          <p className="mt-2 font-body text-text-primary">
            {baseNotes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScentNotes;