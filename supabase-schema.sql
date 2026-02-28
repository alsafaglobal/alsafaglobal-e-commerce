-- =============================================
-- AL SAFA GLOBAL — COMPLETE DATABASE SCHEMA
-- Safe to run on a fresh or existing database.
-- All statements use IF NOT EXISTS / ON CONFLICT
-- so re-running will never break existing data.
-- =============================================

-- =============================================
-- 1. TABLES
-- =============================================

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  scent_type TEXT,
  fragrance_family TEXT,
  longevity TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- New columns added for Fast Moving / Best Selling / Stock features
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_fast_moving BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_selling BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT NULL;

CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  volume_ml INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS scent_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL,
  note_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_occasions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  occasion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  filter_param TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Product media gallery (multiple photos + videos per product)
CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  alt TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Offers / promotions
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount TEXT,
  badge TEXT,
  link TEXT,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  bg_color TEXT DEFAULT 'from-amber-900 to-amber-700',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. ROW LEVEL SECURITY
-- =============================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scent_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies (wrapped in DO blocks so re-running is safe)
DO $$ BEGIN
  CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read scent_notes" ON scent_notes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read product_occasions" ON product_occasions FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read product_media" ON product_media FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read offers" ON offers FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Service role has full access (bypasses RLS automatically)

-- =============================================
-- 3. SEED DATA — SITE CONTENT
-- =============================================

INSERT INTO site_content (key, value) VALUES
  ('hero_title', 'Discover Your Signature Scent'),
  ('hero_subtitle', 'Explore our curated collection of luxury perfumes crafted by master perfumers from around the world'),
  ('hero_button_text', 'Explore Collection'),
  ('site_name', 'Al Safa Global'),
  ('site_tagline', 'Premium Fragrances'),
  ('newsletter_title', 'Join Our Exclusive Circle'),
  ('newsletter_subtitle', 'Subscribe to receive early access to new collections, exclusive offers, and fragrance tips from our experts'),
  ('contact_email', 'info@alsafaglobal.com'),
  ('contact_phone', '00971 4 3741 969'),
  ('contact_address', 'Al Safa Global General Trading FZ LLC FDBC3472
Compass Building, Al Shohada Road
Al Hamra Industrial Zone-FZ
P.O. Box 10055
Ras Al Khaimah, United Arab Emirates'),
  ('footer_tagline', 'Discover luxury fragrances crafted by master perfumers. Each scent tells a unique story of elegance and sophistication.'),
  ('meta_title', 'Al Safa Global - Premium Fragrances'),
  ('meta_description', 'Discover luxury perfumes crafted by master perfumers. Shop our exclusive collection of premium fragrances from Al Safa Global.')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 4. SEED DATA — CATEGORIES
-- =============================================

INSERT INTO categories (name, description, image_url, image_alt, filter_param, sort_order) VALUES
  ('Floral', 'Delicate and romantic fragrances with rose, jasmine, and lily notes', 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff', 'Floral perfume with roses', 'Floral', 1),
  ('Woody', 'Warm and earthy scents featuring sandalwood, cedar, and vetiver', 'https://images.unsplash.com/photo-1590736969955-71cc94801759', 'Woody fragrance with sandalwood', 'Woody', 2),
  ('Fresh', 'Clean and invigorating fragrances with citrus and aquatic notes', 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc', 'Fresh citrus cologne', 'Fresh', 3),
  ('Oriental', 'Rich and exotic scents with amber, spices, and precious woods', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', 'Oriental perfume with amber', 'Oriental', 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. SEED DATA — PRODUCTS
-- =============================================

-- Product 1: Midnight Rose Elegance
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Midnight Rose Elegance', 'Maison de Luxe', 'A captivating blend of midnight roses with delicate undertones of vanilla and musk, perfect for evening occasions.', 125.00, 'https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png', 'Elegant rose perfume bottle', 'Floral', 'Floral Oriental', '6-8 hours', 4.7, 128, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 125.00 FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 185.00 FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Bergamot' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Pink Pepper' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Rose' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Jasmine' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Vanilla' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Musk' FROM products WHERE name = 'Midnight Rose Elegance' ON CONFLICT DO NOTHING;

-- Product 2: Cedarwood Noir
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Cedarwood Noir', 'Forest & Co', 'Deep woody fragrance with rich cedarwood and smoky vetiver, embodying strength and sophistication.', 145.00, 'https://images.unsplash.com/photo-1594035910387-fea081fad114', 'Dark woody cologne bottle', 'Woody', 'Woody Aromatic', '8-10 hours', 4.8, 95, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 145.00 FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 210.00 FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Black Pepper' FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Cedarwood' FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Leather' FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Vetiver' FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Amber' FROM products WHERE name = 'Cedarwood Noir' ON CONFLICT DO NOTHING;

-- Product 3: Ocean Breeze Aqua
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Ocean Breeze Aqua', 'Aqua Essence', 'A refreshing marine fragrance that captures the essence of ocean waves and sea breeze.', 95.00, 'https://images.unsplash.com/photo-1725182524566-e640cc061a27', 'Blue ocean cologne bottle', 'Fresh', 'Fresh Aquatic', '4-6 hours', 4.5, 210, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 95.00 FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 165.00 FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Sea Salt' FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Lemon' FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Marine Accord' FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Driftwood' FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'White Musk' FROM products WHERE name = 'Ocean Breeze Aqua' ON CONFLICT DO NOTHING;

-- Product 4: Amber Mystique
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Amber Mystique', 'Oriental Treasures', 'An exotic oriental fragrance with warm amber, precious spices, and a hint of saffron.', 165.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', 'Amber oriental perfume', 'Oriental', 'Oriental Spicy', '10-12 hours', 4.9, 76, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 165.00 FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 245.00 FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Saffron' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Cardamom' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Amber' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Oud' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Sandalwood' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Benzoin' FROM products WHERE name = 'Amber Mystique' ON CONFLICT DO NOTHING;

-- Product 5: Lavender Fields Forever
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Lavender Fields Forever', 'Fleur de Paris', 'A serene floral fragrance inspired by the lavender fields of Provence.', 110.00, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75', 'Lavender perfume bottle', 'Floral', 'Floral Herbal', '5-7 hours', 4.6, 154, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 110.00 FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 195.00 FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Lavender' FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Iris' FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Violet' FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Tonka Bean' FROM products WHERE name = 'Lavender Fields Forever' ON CONFLICT DO NOTHING;

-- Product 6: Sandalwood Serenity
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Sandalwood Serenity', 'Forest & Co', 'Smooth and creamy sandalwood blended with warm spices for a timeless fragrance.', 135.00, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569', 'Sandalwood perfume', 'Woody', 'Woody Creamy', '7-9 hours', 4.7, 89, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 135.00 FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 200.00 FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Bergamot' FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Sandalwood' FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Cardamom' FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Vanilla' FROM products WHERE name = 'Sandalwood Serenity' ON CONFLICT DO NOTHING;

-- Product 7: Citrus Sunrise
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Citrus Sunrise', 'Garden Fresh', 'An energizing blend of citrus fruits that awakens your senses with every spray.', 85.00, 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc', 'Citrus cologne bottle', 'Fresh', 'Fresh Citrus', '3-5 hours', 4.4, 178, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 85.00 FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 145.00 FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Orange' FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Grapefruit' FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Neroli' FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'White Cedar' FROM products WHERE name = 'Citrus Sunrise' ON CONFLICT DO NOTHING;

-- Product 8: Spice Bazaar
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Spice Bazaar', 'Oriental Treasures', 'A vibrant blend of exotic spices from the markets of Istanbul and Marrakech.', 155.00, 'https://images.unsplash.com/photo-1590736969955-71cc94801759', 'Exotic spice perfume', 'Oriental', 'Oriental Warm', '8-10 hours', 4.8, 63, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 155.00 FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 230.00 FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Cinnamon' FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Nutmeg' FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Rose Absolute' FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Frankincense' FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Patchouli' FROM products WHERE name = 'Spice Bazaar' ON CONFLICT DO NOTHING;

-- Product 9: White Gardenia Dream
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('White Gardenia Dream', 'Fleur de Paris', 'A pure and elegant white floral fragrance that captures the beauty of gardenia blossoms.', 120.00, 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff', 'White gardenia perfume', 'Floral', 'White Floral', '6-8 hours', 4.6, 112, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 120.00 FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 180.00 FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Pear' FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Gardenia' FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Tuberose' FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Cashmeran' FROM products WHERE name = 'White Gardenia Dream' ON CONFLICT DO NOTHING;

-- Product 10: Pine Forest Escape
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Pine Forest Escape', 'Forest & Co', 'An invigorating scent that transports you to a serene pine forest after rainfall.', 130.00, 'https://images.unsplash.com/photo-1594035910387-fea081fad114', 'Pine forest cologne', 'Woody', 'Woody Fresh', '6-8 hours', 4.5, 67, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 130.00 FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 195.00 FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Pine Needle' FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Eucalyptus' FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Cypress' FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Oakmoss' FROM products WHERE name = 'Pine Forest Escape' ON CONFLICT DO NOTHING;

-- Product 11: Mint Mojito Fresh
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Mint Mojito Fresh', 'Garden Fresh', 'A playful and refreshing blend inspired by the classic mojito cocktail.', 90.00, 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc', 'Mint fresh cologne', 'Fresh', 'Fresh Aromatic', '3-5 hours', 4.3, 201, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 90.00 FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 150.00 FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Spearmint' FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Lime' FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Green Tea' FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'White Musk' FROM products WHERE name = 'Mint Mojito Fresh' ON CONFLICT DO NOTHING;

-- Product 12: Velvet Oud Royale
INSERT INTO products (name, brand, description, price, image_url, image_alt, scent_type, fragrance_family, longevity, rating, review_count, is_active, is_featured)
VALUES ('Velvet Oud Royale', 'Oriental Treasures', 'The crown jewel of oriental perfumery — rich oud blended with velvety rose and deep resins.', 185.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', 'Luxury oud perfume', 'Oriental', 'Oriental Floral', '10-12 hours', 4.9, 342, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 50, 185.00 FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO product_sizes (product_id, volume_ml, price) SELECT id, 100, 285.00 FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Bergamot' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Pink Pepper' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'top', 'Mandarin' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Rose' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Jasmine' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'heart', 'Violet' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Oud' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Sandalwood' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Musk' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO scent_notes (product_id, note_type, note_name) SELECT id, 'base', 'Amber' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;

INSERT INTO product_occasions (product_id, occasion) SELECT id, 'Evening Events' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO product_occasions (product_id, occasion) SELECT id, 'Special Occasions' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;
INSERT INTO product_occasions (product_id, occasion) SELECT id, 'Date Night' FROM products WHERE name = 'Velvet Oud Royale' ON CONFLICT DO NOTHING;

-- =============================================
-- DONE. Schema is fully up to date.
-- =============================================
