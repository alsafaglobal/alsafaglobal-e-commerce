import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();

  const {
    orderNumber,
    customer,
    shipping,
    items,
    totals,
    paymentIntentId,
  } = body;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: shipping,
      items: items,
      subtotal: totals.subtotal,
      total: totals.total,
      payment_intent_id: paymentIntentId,
      payment_status: 'paid',
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrement stock for each ordered item (fire-and-forget, don't block response)
  if (Array.isArray(items)) {
    const decrements = (items as Array<{ id: string; quantity: number }>).map(async (item) => {
      if (!item.id) return;
      const { data: prod } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();
      if (prod && prod.stock !== null) {
        await supabase
          .from('products')
          .update({ stock: Math.max(0, prod.stock - (item.quantity || 1)) })
          .eq('id', item.id);
      }
    });
    await Promise.all(decrements);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
