import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  premiumMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  premiumYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
};
