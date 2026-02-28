import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await req.json();
  const { product_ids, ...offerFields } = body;

  const { data, error } = await supabase
    .from('offers')
    .update(offerFields)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace product links if product_ids provided
  if (product_ids !== undefined) {
    await supabase.from('offer_products').delete().eq('offer_id', id);
    if (product_ids.length > 0) {
      await supabase.from('offer_products').insert(
        product_ids.map((pid: string) => ({ offer_id: id, product_id: pid }))
      );
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
