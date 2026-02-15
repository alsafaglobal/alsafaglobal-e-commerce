import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Commitment {
  icon: string;
  title: string;
  description: string;
}

interface CommitmentSectionProps {
  commitments: Commitment[];
}

const CommitmentSection: React.FC<CommitmentSectionProps> = ({
  commitments,
}) => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-text-primary md:text-4xl">
          Our Commitment to Quality
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base text-text-secondary md:text-lg">
          Every bottle represents our unwavering dedication to excellence and
          sustainability
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {commitments.map((commitment, index) => (
          <div
            key={index}
            className="text-center transition-luxury hover:scale-105"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Icon
                name={commitment.icon as any}
                size={32}
                className="text-success"
              />
            </div>
            <h3 className="font-heading text-xl font-semibold text-text-primary">
              {commitment.title}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
              {commitment.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommitmentSection;