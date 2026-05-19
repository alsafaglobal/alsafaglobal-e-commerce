import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('product_country_prices')
    .select('*')
    .eq('product_id', id)
    .order('country_name')
    .order('volume_ml');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { country_name, currency_code, volume_ml, price } = await req.json();

  const { data, error } = await supabase
    .from('product_country_prices')
    .upsert(
      { product_id: id, country_name, currency_code, volume_ml: Number(volume_ml), price: Number(price) },
      { onConflict: 'product_id,country_name,volume_ml' }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
