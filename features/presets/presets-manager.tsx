'use client';

import { useState } from 'react';
import { usePresetsStore } from './presets-store';
import { useTimerStore } from '@/features/timer/timer-engine';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const ICONS = ['🍅', '🧠', '⚡', '📚', '', '', '🔥', '⭐', '', '💡'];

export function PresetsManager() {
  const { presets, addPreset, updatePreset, deletePreset } = usePresetsStore();
  const { setSettings } = useTimerStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', workDur: 25, shortDur: 5, longDur: 15, interval: 4, icon: '🍅' });

  const applyPreset = (preset: any) => {
    setSettings({
      workDur: preset.workDur,
      shortDur: preset.shortDur,
      longDur: preset.longDur,
      interval: preset.interval,
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    addPreset(formData);
    setFormData({ name: '', workDur: 25, shortDur: 5, longDur: 15, interval: 4, icon: '🍅' });
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Timer Presets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Plus size={16} />
          New Preset
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 20,
          padding: 24,
          border: '1px solid var(--border)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {ICONS.map((icon) => (
              <button
                key={icon}
                onClick={() => setFormData({ ...formData, icon })}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: formData.icon === icon ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: formData.icon === icon ? 'oklch(from var(--accent) l c h / 0.1)' : 'var(--bg)',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Preset name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--fg)',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              outline: 'none',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Work (min)', key: 'workDur', min: 5, max: 60 },
              { label: 'Short Break', key: 'shortDur', min: 1, max: 15 },
              { label: 'Long Break', key: 'longDur', min: 5, max: 30 },
              { label: 'Interval', key: 'interval', min: 2, max: 8 },
            ].map((field) => (
              <div key={field.key}>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                  {field.label}
                </label>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: parseInt(e.target.value) || field.min })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--fg)',
                    fontSize: 14,
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--muted)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Check size={14} /> Save
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {presets.map((preset) => (
          <div
            key={preset.id}
            style={{
              background: 'var(--surface)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{preset.icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800 }}>{preset.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {preset.workDur}m work / {preset.shortDur}m break
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => applyPreset(preset)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={() => deletePreset(preset.id)}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--muted)' }}>
              <span>Long: {preset.longDur}m</span>
              <span>Interval: {preset.interval}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
