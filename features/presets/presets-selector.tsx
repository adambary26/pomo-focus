'use client';

import { useState, useRef, useEffect } from 'react';
import { usePresetsStore } from './presets-store';
import { useTimerStore } from '@/features/timer/timer-engine';
import { ChevronDown, Check } from 'lucide-react';

export function PresetsSelector() {
  const { presets } = usePresetsStore();
  const { settings, setSettings } = useTimerStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentPreset = presets.find(
    (p) => p.workDur === settings.workDur && p.shortDur === settings.shortDur && p.longDur === settings.longDur && p.interval === settings.interval
  );

  return (
    <div className="card" style={{ padding: '12px 16px', position: 'relative' }} ref={ref}>
      <div className="card-title" style={{ marginBottom: 8 }}>Presets</div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: 'var(--fg)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        <span>{currentPreset ? `${currentPreset.icon} ${currentPreset.name}` : 'Custom'}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 16,
          right: 16,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 8px 32px oklch(0% 0 0 / 0.12)',
          zIndex: 20,
          overflow: 'hidden',
        }}>
          {presets.map((preset) => {
            const active =
              preset.workDur === settings.workDur &&
              preset.shortDur === settings.shortDur &&
              preset.longDur === settings.longDur &&
              preset.interval === settings.interval;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSettings({ workDur: preset.workDur, shortDur: preset.shortDur, longDur: preset.longDur, interval: preset.interval });
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  border: 'none',
                  background: active ? 'oklch(from var(--accent) l c h / 0.1)' : 'transparent',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>{preset.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{preset.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{preset.workDur}m / {preset.shortDur}m</div>
                </div>
                {active && <Check size={14} style={{ color: 'var(--accent)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
