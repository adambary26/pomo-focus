'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-provider';
import { getSupabaseBrowserClient } from '@/features/auth/supabase-client';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Shield, ArrowUpRight } from 'lucide-react';

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
      <div className="billing-page">
        <div className="billing-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Shield size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to manage your billing</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>Sign in &rarr;</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="billing-page">
        <div className="billing-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px', color: 'var(--accent)' }} />
          <p style={{ color: 'var(--muted)' }}>Loading billing info...</p>
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
    <div className="billing-page">
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing</h1>
          <p>Manage your subscription and payment methods</p>
        </div>

        {message && (
          <div className={`billing-alert ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="billing-card">
          <div className="billing-card-header">
            <div>
              <div className="billing-plan-name">
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </div>
              <div className="billing-user-email">{user?.email}</div>
            </div>
            <div className="billing-status" style={{ color: status.color }}>
              <StatusIcon size={16} />
              {status.label}
            </div>
          </div>

          {subscription?.current_period_end && (
            <div className="billing-next-billing">
              <Calendar size={14} />
              Next billing:{' '}
              <strong>
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </div>
          )}

          {subscription?.cancel_at_period_end && (
            <div className="billing-cancel-notice">
              Your subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="billing-actions">
          {isPremium ? (
            <button
              className="billing-btn secondary"
              onClick={openPortal}
              disabled={portalLoading}
            >
              <CreditCard size={16} />
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          ) : (
            <a
              href="/pricing"
              className="billing-btn primary"
            >
              <ArrowUpRight size={16} />
              Upgrade to Premium
            </a>
          )}
          <button className="billing-signout" onClick={signOut}>
            Sign Out
          </button>
        </div>

        <p className="billing-help">
          Need help? Contact us at{' '}
          <a href="mailto:support@pomofocus.app">support@pomofocus.app</a>
        </p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="billing-page">
        <div className="billing-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px', color: 'var(--accent)' }} />
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
