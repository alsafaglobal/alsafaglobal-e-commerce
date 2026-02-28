import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
  const supabase = createAdminClient();
  const body = await req.json();
  const { product_ids, ...offerFields } = body;

  // Try insert with all fields first
  let { data: offer, error } = await supabase
    .from('offers')
    .insert([offerFields])
    .select()
    .single();

  // If new columns don't exist yet, retry without them
  if (error) {
    const { offer_type, discount_percent, ...legacyFields } = offerFields;
    void offer_type; void discount_percent;
    const retry = await supabase
      .from('offers')
      .insert([legacyFields])
      .select()
      .single();
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
    offer = retry.data;
    error = null;
  }

  // Link products if provided (silently ignore if table doesn't exist)
  if (offer && product_ids && product_ids.length > 0) {
    await supabase.from('offer_products').insert(
      product_ids.map((pid: string) => ({ offer_id: offer!.id, product_id: pid }))
    ).then(() => null).catch(() => null);
  }

  return NextResponse.json(offer);
}
