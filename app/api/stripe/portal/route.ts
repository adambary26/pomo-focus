import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getServerSession, createServerSupabaseClient } from '@/lib/supabase';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
