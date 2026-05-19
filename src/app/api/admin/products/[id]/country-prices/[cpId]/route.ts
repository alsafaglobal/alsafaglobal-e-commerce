import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; cpId: string }> }) {
  const { cpId } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('product_country_prices').delete().eq('id', cpId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
