'use client';

import { useTimerStore } from '../timer/timer-engine';

export function StatsPanel() {
  const { stats, settings } = useTimerStore();

  const hours = Math.floor(stats.focusSeconds / 3600);
  const minutes = Math.floor((stats.focusSeconds % 3600) / 60);
  const focusTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const progress = stats.sessionCount % settings.interval;
  const progressPercent = (progress / settings.interval) * 100;

  return (
    <div>
      <div className="card-title">Today</div>
      <div className="stat-row">
        <span className="stat-label">Pomodoros</span>
        <span className="stat-value">{stats.pomodoros}</span>
      </div>
      <div className="stat-row">
        <span className="stat-label">Focus time</span>
        <span className="stat-value">{focusTime}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
        {progress} / {settings.interval} sessions
      </div>
    </div>
  );
}
