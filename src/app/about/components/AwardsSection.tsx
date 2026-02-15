import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Award {
  year: string;
  title: string;
  organization: string;
}

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ awards }) => {
  return (
    <section className="rounded-lg bg-gradient-to-br from-secondary/20 to-accent/10 py-12 md:py-16">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <Icon name="TrophyIcon" size={48} className="text-accent" />
        </div>
        <h2 className="font-heading text-3xl font-semibold text-text-primary md:text-4xl">
          Recognition & Awards
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base text-text-secondary md:text-lg">
          Our commitment to excellence has been recognized by prestigious
          organizations worldwide
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award, index) => (
          <div
            key={index}
            className="rounded-lg bg-card p-6 shadow-luxury-sm transition-luxury hover:shadow-luxury"
          >
            <div className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1">
              <span className="font-data text-sm font-medium text-accent">
                {award.year}
              </span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-text-primary">
              {award.title}
            </h3>
            <p className="caption mt-2 text-text-secondary">
              {award.organization}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;