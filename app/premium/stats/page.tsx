'use client';

import { useAuth } from '@/features/auth/auth-provider';

export default function StatsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to view statistics</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = 12;
  const heatmapData = Array.from({ length: weeks * 7 }, () => Math.random());

  const getColor = (value: number) => {
    if (value < 0.2) return 'var(--bg)';
    if (value < 0.4) return 'oklch(from var(--accent) l c h / 0.2)';
    if (value < 0.6) return 'oklch(from var(--accent) l c h / 0.4)';
    if (value < 0.8) return 'oklch(from var(--accent) l c h / 0.6)';
    return 'var(--accent)';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Advanced Statistics</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Your focus activity over time</p>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 28,
          border: '1px solid var(--border)',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Activity Heatmap</h2>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginRight: 8, flexShrink: 0 }}>
              {days.map((d) => (
                <div key={d} style={{ height: 14, fontSize: 10, color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateRows: `repeat(7, 14px)`, gridAutoFlow: 'column', gap: 4 }}>
              {heatmapData.map((value, i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: getColor(value),
                  }}
                  title={`Week ${Math.floor(i / 7) + 1}, ${days[i % 7]}`}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>Less</span>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
              <div key={v} style={{ width: 14, height: 14, borderRadius: 3, background: getColor(v) }} />
            ))}
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>More</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>This Week</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>12</div>
            <div style={{ fontSize: 12, color: 'oklch(65% 0.18 145)', fontWeight: 700 }}>+3 from last week</div>
          </div>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>This Month</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>48</div>
            <div style={{ fontSize: 12, color: 'oklch(65% 0.18 145)', fontWeight: 700 }}>+12 from last month</div>
          </div>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>Best Day</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>8</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Pomodoros in one day</div>
          </div>
        </div>
      </div>
    </div>
  );
}
