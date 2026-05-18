'use client';

import { useTheme } from './theme-provider';
import { PALETTES } from './palettes';

export function ThemeStrip() {
  const { palette, setPalette } = useTheme();

  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <div className="card-title" style={{ marginBottom: 8 }}>Themes</div>
      <div className="theme-strip">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            className={`theme-dot${p.id === palette ? ' active' : ''}`}
            style={{ background: p.color }}
            onClick={() => setPalette(p.id)}
            title={p.label}
          />
        ))}
      </div>
    </div>
  );
}
