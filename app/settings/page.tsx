'use client';

import { useAuth } from '@/features/auth/auth-provider';
import { User, Bell, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to access settings</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Manage your account and preferences</p>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 24,
          border: '1px solid var(--border)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
            }}>
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{user.email}</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Account</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: User, label: 'Profile', desc: 'Update your name and avatar' },
            { icon: Bell, label: 'Notifications', desc: 'Manage notification preferences' },
            { icon: Globe, label: 'Language', desc: 'Choose your preferred language' },
            { icon: Shield, label: 'Privacy', desc: 'Control your data and privacy' },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              style={{
                background: 'var(--surface)',
                borderRadius: 14,
                padding: '16px 20px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <Icon size={18} style={{ color: 'var(--muted)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{desc}</div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>→</span>
            </div>
          ))}
        </div>

        <button
          onClick={signOut}
          style={{
            width: '100%',
            marginTop: 24,
            padding: '14px 24px',
            borderRadius: 14,
            border: '1px solid oklch(55% 0.15 25 / 0.3)',
            background: 'oklch(55% 0.15 25 / 0.05)',
            color: 'oklch(55% 0.15 25)',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
