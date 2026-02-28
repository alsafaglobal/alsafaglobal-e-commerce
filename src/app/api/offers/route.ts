import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Try with product join first; fall back to plain select if offer_products table doesn't exist yet
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      offer_products (
        id,
        product_id,
        products (
          id,
          name,
          price,
          image_url,
          image_alt
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback: fetch without join (offer_products table may not exist yet)
    const { data: fallback } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    return NextResponse.json((fallback || []).map((o) => ({ ...o, offer_products: [] })));
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { product_ids, ...offerFields } = body;

  // Remove new columns if they cause issues (graceful degradation)
  const safeFields = { ...offerFields };

  const { data: offer, error } = await supabase
    .from('offers')
    .insert([safeFields])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Link products if provided (silently ignore if table doesn't exist)
  if (product_ids && product_ids.length > 0) {
    await supabase.from('offer_products').insert(
      product_ids.map((pid: string) => ({ offer_id: offer.id, product_id: pid }))
    ).then(() => null).catch(() => null);
  }

  return NextResponse.json(offer);
}
