'use client';

import { useAuth } from '@/features/auth/auth-provider';
import { useTheme } from '@/features/themes/theme-provider';
import { PALETTES, PREMIUM_PALETTES } from '@/features/themes/palettes';
import { Crown, Sparkles } from 'lucide-react';

export default function ThemesPage() {
  const { user } = useAuth();
  const { palette, setPalette } = useTheme();

  if (!user) {
    return (
      <div className="premium-themes-page">
        <div className="premium-themes-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Crown size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to browse themes</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>Sign in &rarr;</a>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-themes-page">
      <div className="premium-themes-container">
        <div className="premium-themes-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <h1>Premium Themes</h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 700,
            }}>
              <Sparkles size={12} />
              {PALETTES.length + PREMIUM_PALETTES.length} total
            </div>
          </div>
          <p>Click any theme to apply it instantly</p>
        </div>

        <div className="themes-section-title">Free Themes ({PALETTES.length})</div>
        <div className="themes-grid">
          {PALETTES.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                className={`theme-swatch ${active ? 'active' : ''}`}
                style={{ background: p.color }}
                onClick={() => setPalette(p.id)}
                title={`${p.label}${active ? ' (active)' : ''}`}
              >
                <span className="theme-swatch-label">{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="themes-section-title">
          Premium Themes ({PREMIUM_PALETTES.length})
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
            <Crown size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
            Premium
          </span>
        </div>
        <div className="themes-grid">
          {PREMIUM_PALETTES.map((p) => {
            const active = palette === p.id;
            return (
              <button
                key={p.id}
                className={`theme-swatch ${active ? 'active' : ''}`}
                style={{ background: p.color }}
                onClick={() => setPalette(p.id)}
                title={`${p.label}${active ? ' (active)' : ''}`}
              >
                <span className="theme-swatch-label">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
