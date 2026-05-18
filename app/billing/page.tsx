'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';
import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

function BillingContent() {
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  const supabase = getSupabaseBrowserClient();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) setMessage('✅ Payment successful! Your Premium plan is now active.');
    if (canceled) setMessage('❌ Payment was canceled. You can try again anytime.');
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setSubscription(data);
      setLoading(false);
    };

    fetchSubscription();
  }, [user, supabase]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to manage your billing</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    );
  }

  const isPremium =
    subscription?.status === 'active' &&
    subscription?.plan === 'premium' &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end) > new Date();

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    active: { icon: CheckCircle, color: 'oklch(65% 0.18 145)', label: 'Active' },
    past_due: { icon: Clock, color: 'oklch(65% 0.18 50)', label: 'Past Due' },
    canceled: { icon: XCircle, color: 'oklch(55% 0.15 25)', label: 'Canceled' },
    free: { icon: Clock, color: 'var(--muted)', label: 'Free Plan' },
  };

  const status = statusConfig[subscription?.status || 'free'] || statusConfig.free;
  const StatusIcon = status.icon;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Billing</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Manage your subscription and payment methods</p>

        {message && (
          <div style={{
            background: message.includes('✅') ? 'oklch(65% 0.18 145 / 0.1)' : 'oklch(55% 0.15 25 / 0.1)',
            color: message.includes('✅') ? 'oklch(65% 0.18 145)' : 'oklch(55% 0.15 25)',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 24,
          }}>
            {message}
          </div>
        )}

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 28,
          border: '1px solid var(--border)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                {user?.email}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: status.color,
              fontWeight: 700,
              fontSize: 13,
            }}>
              <StatusIcon size={16} />
              {status.label}
            </div>
          </div>

          {subscription?.current_period_end && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              background: 'var(--bg)',
              borderRadius: 12,
              fontSize: 13,
              color: 'var(--muted)',
            }}>
              <Calendar size={14} />
              Next billing:{' '}
              <strong style={{ color: 'var(--fg)' }}>
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </div>
          )}

          {subscription?.cancel_at_period_end && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'oklch(65% 0.18 50 / 0.1)',
              borderRadius: 12,
              fontSize: 12,
              color: 'oklch(65% 0.18 50)',
              fontWeight: 700,
            }}>
              ⚠️ Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {isPremium ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--fg)',
                fontWeight: 800,
                fontSize: 14,
                cursor: portalLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <CreditCard size={16} />
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          ) : (
            <a
              href="/pricing"
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: 14,
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <CreditCard size={16} />
              Upgrade to Premium
            </a>
          )}

          <button
            onClick={signOut}
            style={{
              padding: '14px 20px',
              borderRadius: 14,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--muted)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--muted)' }}>
          Need help? Contact us at{' '}
          <a href="mailto:support@pomofocus.app" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            support@pomofocus.app
          </a>
        </p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><p style={{ color: 'var(--muted)' }}>Loading...</p></div>}>
      <BillingContent />
    </Suspense>
  );
}
