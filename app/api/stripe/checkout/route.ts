import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient, getServerSession } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, billingInterval } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: session.user.email,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId: session.user.id },
      subscription_data: {
        metadata: { userId: session.user.id },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
