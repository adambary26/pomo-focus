'use client';

import { useAuth } from '@/features/auth/auth-provider';

export default function SoundsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to manage sounds</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Sound Library</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Ambient sounds for focused work sessions</p>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 28,
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Coming Soon</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
            Custom sound upload and premium sound library are being prepared.
            You'll be able to upload your own ambient sounds and choose from
            a curated collection of focus-enhancing audio.
          </p>
        </div>
      </div>
    </div>
  );
}
