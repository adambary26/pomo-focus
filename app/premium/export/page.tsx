'use client';

import { useAuth } from '@/features/auth/auth-provider';
import { Download } from 'lucide-react';

export default function ExportPage() {
  const { user } = useAuth();

  const exportData = (format: 'csv' | 'json') => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: user?.email,
      pomodoros: 0,
      focusTime: '0m',
      tasks: [],
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pomo-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = `Date,Pomodoros,Focus Time\n${new Date().toISOString().split('T')[0]},0,0m`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pomo-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Please sign in to export data</p>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Export Data</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Download your focus data in your preferred format</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <button
            onClick={() => exportData('json')}
            style={{
              background: 'var(--surface)',
              borderRadius: 20,
              padding: 32,
              border: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>JSON</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Full data export</p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>
              <Download size={16} /> Download
            </div>
          </button>

          <button
            onClick={() => exportData('csv')}
            style={{
              background: 'var(--surface)',
              borderRadius: 20,
              padding: 32,
              border: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>CSV</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Spreadsheet format</p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>
              <Download size={16} /> Download
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
