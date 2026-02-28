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
-- DONE. Schema is fully up to date.
-- =============================================
