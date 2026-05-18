'use client';

import { useAuth } from '@/features/auth/auth-provider';
import { useTheme } from '@/features/themes/theme-provider';
import { PALETTES, PREMIUM_PALETTES } from '@/features/themes/palettes';

export default function ThemesPage() {
  const { user } = useAuth();
  const { palette, setPalette } = useTheme();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to browse themes</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Premium Themes</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          {PALETTES.length} free + {PREMIUM_PALETTES.length} premium themes — click any to apply
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Free Themes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
          {PALETTES.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                title={`${p.label}${active ? ' (active)' : ''}`}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  background: p.color,
                  border: active ? '3px solid var(--fg)' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 0,
                  paddingBottom: 4,
                  outline: active ? '2px solid var(--accent)' : 'none',
                  outlineOffset: 2,
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{p.label}</span>
              </button>
            );
          })}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
          Premium Themes ({PREMIUM_PALETTES.length})
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {PREMIUM_PALETTES.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                title={`${p.label}${active ? ' (active)' : ''}`}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                  background: p.color,
                  border: active ? '3px solid var(--fg)' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 0,
                  paddingBottom: 4,
                  position: 'relative',
                  outline: active ? '2px solid var(--accent)' : 'none',
                  outlineOffset: 2,
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
