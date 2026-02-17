import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*), scent_notes(*), product_occasions(*)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const body = await req.json();

  const { sizes, scent_notes, occasions, ...productData } = body;

  // Update product
  const { data: product, error } = await supabase
    .from('products')
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace sizes
  if (sizes) {
    await supabase.from('product_sizes').delete().eq('product_id', id);
    if (sizes.length) {
      await supabase.from('product_sizes').insert(
        sizes.map((s: { volume_ml: number; price: number }) => ({
          product_id: id,
          volume_ml: s.volume_ml,
          price: s.price,
        }))
      );
    }
  }

  // Replace scent notes
  if (scent_notes) {
    await supabase.from('scent_notes').delete().eq('product_id', id);
    if (scent_notes.length) {
      await supabase.from('scent_notes').insert(
        scent_notes.map((n: { note_type: string; note_name: string }) => ({
          product_id: id,
          note_type: n.note_type,
          note_name: n.note_name,
        }))
      );
    }
  }

  // Replace occasions
  if (occasions) {
    await supabase.from('product_occasions').delete().eq('product_id', id);
    if (occasions.length) {
      await supabase.from('product_occasions').insert(
        occasions.map((o: string) => ({
          product_id: id,
          occasion: o,
        }))
      );
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
