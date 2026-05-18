import { REFUND_POLICY } from '@/lib/constants';

export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Refund Policy</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 28,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            background: 'oklch(65% 0.18 145 / 0.1)',
            borderRadius: 14,
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>
                {REFUND_POLICY.windowDays}-Day Money-Back Guarantee
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Full refund, no questions asked
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Full Refund Window</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 24 }}>
            If you're not satisfied with Pomo Focus Premium within the first{' '}
            <strong style={{ color: 'var(--fg)' }}>{REFUND_POLICY.windowDays} days</strong> of your purchase,
            we'll provide a full refund — no questions asked. Simply contact our support team
            and we'll process your refund within 3-5 business days.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>After the Refund Window</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 24 }}>
            After the {REFUND_POLICY.windowDays}-day period, prorated refunds are available based on
            the unused portion of your billing cycle. For example, if you cancel halfway through
            your monthly subscription, you'll receive 50% of your payment back.
          </p>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>How to Request a Refund</h2>
          <ol style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', paddingLeft: 20, marginBottom: 24 }}>
            <li style={{ marginBottom: 8 }}>Email us at <strong style={{ color: 'var(--fg)' }}>{REFUND_POLICY.contactEmail}</strong></li>
            <li style={{ marginBottom: 8 }}>Include your account email and order details</li>
            <li style={{ marginBottom: 8 }}>We'll process your refund within 3-5 business days</li>
          </ol>

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Cancellation</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', marginBottom: 24 }}>
            You can cancel your subscription at any time through your billing dashboard.
            After cancellation, you'll continue to have access to Premium features until
            the end of your current billing period. No partial refunds are issued for
            cancellations made mid-cycle (outside the refund window).
          </p>

          <div style={{
            padding: '16px 20px',
            background: 'var(--bg)',
            borderRadius: 14,
            fontSize: 13,
            color: 'var(--muted)',
          }}>
            <strong style={{ color: 'var(--fg)' }}>Questions?</strong>{' '}
            Reach out to us at{' '}
            <a href={`mailto:${REFUND_POLICY.contactEmail}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>
              {REFUND_POLICY.contactEmail}
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href="/billing"
            style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
          >
            ← Back to Billing
          </a>
        </div>
      </div>
    </div>
  );
}
