import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

interface Category {
  name: string;
  description: string;
  image: string;
  alt: string;
  filterParam: string;
}

const CategoryShowcase: React.FC = () => {
  const categories: Category[] = [
  {
    name: "Floral",
    description: "Delicate and romantic fragrances with rose, jasmine, and lily notes",
    image: "https://images.unsplash.com/photo-1611656983819-ec1409d5cbdf",
    alt: "Close-up of pink and white roses with water droplets in soft morning light",
    filterParam: "Floral"
  },
  {
    name: "Woody",
    description: "Warm and earthy scents featuring sandalwood, cedar, and vetiver",
    image: "https://images.unsplash.com/photo-1579009798459-36c8183b90ea",
    alt: "Stack of natural wood logs with rich brown tones and visible grain texture",
    filterParam: "Woody"
  },
  {
    name: "Fresh",
    description: "Clean and invigorating fragrances with citrus and aquatic notes",
    image: "https://images.unsplash.com/photo-1639989224133-5ec0e3a9ed36",
    alt: "Fresh citrus fruits including lemons and oranges with green leaves on white background",
    filterParam: "Fresh"
  },
  {
    name: "Oriental",
    description: "Rich and exotic scents with amber, spices, and precious woods",
    image: "https://images.unsplash.com/photo-1589711836722-79bdb44125a8",
    alt: "Golden amber resin pieces and exotic spices arranged on dark wooden surface",
    filterParam: "Oriental"
  }];


  return (
    <section className="w-full bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            Explore by Scent
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            Find your perfect fragrance family
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) =>
          <Link
            key={category.name}
            href={`/shop-catalog?filters=${category.filterParam}`}
            className="group overflow-hidden rounded-xl bg-card shadow-luxury transition-luxury hover:shadow-luxury-lg">

              <div className="relative h-64 w-full overflow-hidden">
                <AppImage
                src={category.image}
                alt={category.alt}
                className="h-full w-full object-cover transition-spring group-hover:scale-105" />

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="mb-2 font-heading text-2xl font-semibold text-text-primary">
                    {category.name}
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

};

export default CategoryShowcase;
