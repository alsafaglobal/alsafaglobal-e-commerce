import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('tax_rates')
    .select('*')
    .order('country_name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const { country_name, tax_percent } = await req.json();

  const { data, error } = await supabase
    .from('tax_rates')
    .insert({ country_name: country_name.trim(), tax_percent: Number(tax_percent), is_active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
