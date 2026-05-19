import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    });
  }
  return stripeInstance;
}

export const STRIPE_PRICE_IDS = {
  premiumMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || '',
  premiumYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || '',
};
