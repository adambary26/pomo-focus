'use client';

import { useState, useEffect } from 'react';
import { PLANS } from '@/features/billing/plans';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-provider';
import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';

export default function PricingPage() {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    supabase
      .from('subscriptions')
      .select('status, plan, current_period_end')
      .eq('user_id', user.id)
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.status === 'active' && data?.plan === 'premium' && data?.current_period_end && new Date(data.current_period_end) > new Date()) {
          setIsPremium(true);
        }
      });
  }, [user]);

  const handleSubscribe = async (planSlug: string) => {
    if (planSlug === 'free') {
      window.location.href = '/signup';
      return;
    }

    setLoading(planSlug);
    const plan = PLANS[planSlug as keyof typeof PLANS];
    const priceId = billingInterval === 'monthly'
      ? ('stripePriceIds' in plan ? plan.stripePriceIds?.monthly : undefined)
      : ('stripePriceIds' in plan ? plan.stripePriceIds?.yearly : undefined);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, billingInterval }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const savings = billingInterval === 'yearly' ? '$3' : null;

  return (
    <div className="pricing-page">
      {/* Hero */}
      <div className="pricing-hero">
        <div className="pricing-badge">
          <Sparkles size={14} />
          <span>Unlock your full potential</span>
        </div>
        <h1>Focus smarter, not harder</h1>
        <p>Start free. Upgrade when you're ready. No limits on your productivity.</p>

        {/* Billing toggle */}
        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billingInterval === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billingInterval === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingInterval('yearly')}
          >
            Yearly
            <span className="save-badge">Save {savings}</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="pricing-grid">
        {Object.entries(PLANS).map(([slug, plan]) => {
          const price = billingInterval === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const perMonth = billingInterval === 'yearly' ? (plan.price.yearly / 12).toFixed(2) : plan.price.monthly.toFixed(2);

          return (
            <div
              key={slug}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Zap size={12} />
                  <span>Most Popular</span>
                </div>
              )}

              <div className="card-header">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>

              <div className="price-block">
                <div className="price-main">
                  <span className="currency">$</span>
                  <span className="amount">{price}</span>
                </div>
                {price > 0 && (
                  <div className="price-sub">
                    <span>${perMonth}/mo</span>
                    {billingInterval === 'yearly' && <span className="billing-note">billed yearly</span>}
                  </div>
                )}
              </div>

              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`cta-btn ${plan.popular ? 'primary' : 'secondary'}`}
                onClick={() => handleSubscribe(slug)}
                disabled={loading === slug || (isPremium && plan.slug === 'premium')}
              >
                {loading === slug ? (
                  <span className="spinner" />
                ) : isPremium && plan.slug === 'premium' ? (
                  'Already Active'
                ) : (
                  <>
                    {plan.cta}
                    {plan.popular && <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust bar */}
      <div className="trust-bar">
        <div className="trust-item">
          <Shield size={16} />
          <span>14-day money-back guarantee</span>
        </div>
        <a href="/policy/refund" className="trust-link">
          Read refund policy
        </a>
      </div>
    </div>
  );
}
