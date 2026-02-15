import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  alt: string;
  scentType: string;
}

const FeaturedProducts: React.FC = () => {
  const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Midnight Rose",
    brand: "Maison de Luxe",
    price: 185.00,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png",
    alt: "Elegant black perfume bottle with gold accents and rose design on white marble surface",
    scentType: "Floral"
  },
  {
    id: "2",
    name: "Ocean Breeze",
    brand: "Aqua Essence",
    price: 165.00,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14023ba79-1764719212053.png",
    alt: "Blue gradient perfume bottle with silver cap on light blue background with water droplets",
    scentType: "Fresh"
  },
  {
    id: "3",
    name: "Amber Woods",
    brand: "Forest & Co",
    price: 210.00,
    image: "https://images.unsplash.com/photo-1707539159913-c905e3f80b99",
    alt: "Brown glass perfume bottle with wooden cap surrounded by amber crystals and dried leaves",
    scentType: "Woody"
  },
  {
    id: "4",
    name: "Silk Oud",
    brand: "Oriental Treasures",
    price: 245.00,
    image: "https://images.unsplash.com/photo-1714637641172-76bd99501a1a",
    alt: "Ornate gold perfume bottle with intricate patterns on burgundy silk fabric",
    scentType: "Oriental"
  },
  {
    id: "5",
    name: "Citrus Bloom",
    brand: "Garden Fresh",
    price: 145.00,
    image: "https://images.unsplash.com/photo-1606116637300-ee0d90b14b99",
    alt: "Clear glass perfume bottle with yellow liquid surrounded by fresh citrus fruits and white flowers",
    scentType: "Fresh"
  },
  {
    id: "6",
    name: "Velvet Jasmine",
    brand: "Fleur de Paris",
    price: 195.00,
    image: "https://images.unsplash.com/photo-1615711954374-d3f04c1e9f18",
    alt: "Pink perfume bottle with silver details on soft pink velvet with jasmine flowers",
    scentType: "Floral"
  }];


  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            Featured Collection
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            Handpicked luxury fragrances that define elegance and sophistication
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) =>
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            image={product.image}
            alt={product.alt}
            scentType={product.scentType} />

          )}
        </div>
      </div>
    </section>);

};

export default FeaturedProducts;