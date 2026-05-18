'use client';

import { useState } from 'react';
import { PLANS } from '@/features/billing/plans';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            Choose your plan
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 40,
          background: 'var(--surface)',
          borderRadius: 16,
          padding: 4,
          width: 'fit-content',
          margin: '0 auto 40px',
          border: '1px solid var(--border)',
        }}>
          <button
            onClick={() => setBillingInterval('monthly')}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: 'none',
              background: billingInterval === 'monthly' ? 'var(--accent)' : 'transparent',
              color: billingInterval === 'monthly' ? '#fff' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: 'none',
              background: billingInterval === 'yearly' ? 'var(--accent)' : 'transparent',
              color: billingInterval === 'yearly' ? '#fff' : 'var(--muted)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            Yearly
            {billingInterval === 'yearly' && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'oklch(70% 0.18 160)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 999,
              }}>
                -17%
              </span>
            )}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          maxWidth: 700,
          margin: '0 auto',
        }}>
          {Object.entries(PLANS).map(([slug, plan]) => (
            <div
              key={slug}
              style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 32,
                border: plan.popular
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border)',
                position: 'relative',
                boxShadow: plan.popular
                  ? '0 8px 32px oklch(from var(--accent) l c h / 0.15)'
                  : 'none',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 16px',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Most Popular
                </div>
              )}

              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{plan.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>{plan.description}</p>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800 }}>
                  ${billingInterval === 'monthly' ? plan.price.monthly : plan.price.yearly}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                  /{billingInterval === 'monthly' ? 'month' : 'year'}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                    <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(slug)}
                disabled={loading === slug}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 14,
                  border: plan.popular ? 'none' : '1px solid var(--border)',
                  background: plan.popular ? 'var(--accent)' : 'transparent',
                  color: plan.popular ? '#fff' : 'var(--fg)',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: loading === slug ? 'not-allowed' : 'pointer',
                  opacity: loading === slug ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {loading === slug ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 40,
          padding: 20,
          background: 'var(--surface)',
          borderRadius: 16,
          border: '1px solid var(--border)',
          maxWidth: 500,
          margin: '40px auto 0',
        }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            🔒 14-day money-back guarantee. Cancel anytime. No questions asked.
          </p>
          <a
            href="/policy/refund"
            style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}
          >
            Read refund policy →
          </a>
        </div>
      </div>
    </div>
  );
}
