import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*), scent_notes(*), product_occasions(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { sizes, scent_notes, occasions, ...productData } = body;

  // Insert product
  const { data: product, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Insert sizes
  if (sizes?.length) {
    await supabase.from('product_sizes').insert(
      sizes.map((s: { volume_ml: number; price: number }) => ({
        product_id: product.id,
        volume_ml: s.volume_ml,
        price: s.price,
      }))
    );
  }

  // Insert scent notes
  if (scent_notes?.length) {
    await supabase.from('scent_notes').insert(
      scent_notes.map((n: { note_type: string; note_name: string }) => ({
        product_id: product.id,
        note_type: n.note_type,
        note_name: n.note_name,
      }))
    );
  }

  // Insert occasions
  if (occasions?.length) {
    await supabase.from('product_occasions').insert(
      occasions.map((o: string) => ({
        product_id: product.id,
        occasion: o,
      }))
    );
  }

  return NextResponse.json(product, { status: 201 });
}
