'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';
import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Shield, ArrowUpRight, LogOut } from 'lucide-react';

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
    if (success) setMessage('Payment successful! Your Premium plan is now active.');
    if (canceled) setMessage('Payment was canceled. You can try again anytime.');
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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>Please sign in to manage your billing</p>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: 12,
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32,
            height: 32,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading billing info...</p>
        </div>
      </div>
    );
  }

  const isPremium =
    subscription?.status === 'active' &&
    subscription?.plan === 'premium' &&
    subscription?.current_period_end &&
    new Date(subscription.current_period_end) > new Date();

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
    active: { icon: CheckCircle, color: 'oklch(65% 0.18 145)', label: 'Active' },
    past_due: { icon: Clock, color: 'oklch(65% 0.18 50)', label: 'Past Due' },
    canceled: { icon: XCircle, color: 'oklch(55% 0.15 25)', label: 'Canceled' },
    free: { icon: Clock, color: 'var(--muted)', label: 'Free Plan' },
  };

  const status = statusConfig[subscription?.status || 'free'] || statusConfig.free;
  const StatusIcon = status.icon;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 500,
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Billing</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage your subscription and payment methods</p>
        </div>

        {message && (
          <div style={{
            background: message.includes('successful')
              ? 'oklch(60% 0.12 145 / 0.1)'
              : 'oklch(60% 0.15 25 / 0.1)',
            color: message.includes('successful')
              ? 'oklch(55% 0.12 145)'
              : 'oklch(55% 0.15 25)',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            marginBottom: 16,
            textAlign: 'center',
            fontWeight: 700,
          }}>
            {message}
          </div>
        )}

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 24,
          border: '1px solid var(--border)',
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user?.email}</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: status.color,
              fontSize: 13,
              fontWeight: 700,
              background: `oklch(from ${status.color} l c h / 0.1)`,
              padding: '4px 10px',
              borderRadius: 8,
            }}>
              <StatusIcon size={14} />
              {status.label}
            </div>
          </div>

          {subscription?.current_period_end && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--muted)',
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
            }}>
              <Calendar size={14} />
              Next billing:{' '}
              <span style={{ fontWeight: 700, color: 'var(--fg)' }}>
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {subscription?.cancel_at_period_end && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'oklch(60% 0.15 25 / 0.1)',
              color: 'oklch(55% 0.15 25)',
              fontSize: 13,
              fontWeight: 700,
            }}>
              <XCircle size={14} />
              Your subscription will end on{' '}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {isPremium ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--fg)',
                fontWeight: 800,
                fontSize: 14,
                cursor: portalLoading ? 'not-allowed' : 'pointer',
                opacity: portalLoading ? 0.7 : 1,
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              <ArrowUpRight size={16} />
              Upgrade to Premium
            </a>
          )}
          <button
            onClick={signOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'oklch(55% 0.15 25)',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
          Need help? Contact us at{' '}
          <a href="mailto:support@pomofocus.app" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            support@pomofocus.app
          </a>
        </p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32,
            height: 32,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
