import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
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

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { product_ids, ...offerFields } = body;

  const { data: offer, error } = await supabase
    .from('offers')
    .insert([offerFields])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Link products if provided
  if (product_ids && product_ids.length > 0) {
    await supabase.from('offer_products').insert(
      product_ids.map((pid: string) => ({ offer_id: offer.id, product_id: pid }))
    );
  }

  return NextResponse.json(offer);
}
