import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsafaglobal.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/home`,        lastModified: now, changeFrequency: 'daily',   priority: 1   },
    { url: `${siteUrl}/shop-catalog`,lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic product pages
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_active', true);

    const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${siteUrl}/product-detail?id=${p.id}`,
      lastModified: new Date(p.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
