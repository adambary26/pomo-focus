import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId || !session.subscription) break;

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const sub = subscription as any;

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: session.customer as string,
          stripe_price_id: sub.items?.data?.[0]?.price?.id,
          status: sub.status,
          plan: 'premium',
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
          cancel_at_period_end: sub.cancel_at_period_end || false,
        }, { onConflict: 'user_id' });

        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;

        if (!userId) break;

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_price_id: sub.items?.data?.[0]?.price?.id,
          status: sub.status,
          plan: sub.status === 'active' || sub.status === 'trialing' ? 'premium' : 'free',
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
          cancel_at_period_end: sub.cancel_at_period_end || false,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const userId = sub.metadata?.userId;

        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
            cancel_at_period_end: false,
            updated_at: new Date(),
          })
          .eq('stripe_subscription_id', sub.id);

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;
        if (!subscriptionId) break;

        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const sub = subscription as any;
        const userId = sub.metadata?.userId;

        if (!userId) break;

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;
        if (!subscriptionId) break;

        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const sub = subscription as any;
        const userId = sub.metadata?.userId;

        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date(),
          })
          .eq('stripe_subscription_id', sub.id);

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
