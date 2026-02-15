import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <Icon
                name="ChevronRightIcon"
                size={16}
                className="text-text-secondary"
              />
            )}
            {index === items.length - 1 ? (
              <span className="caption font-medium text-text-primary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.path}
                className="caption text-text-secondary transition-luxury hover:text-primary"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;