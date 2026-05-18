'use client';

import { useAchievementsStore, BADGES } from './achievements-store';
import { Trophy, Lock } from 'lucide-react';

export function BadgeCollection() {
  const { unlockedBadges, currentStreak, longestStreak, totalPomodoros, totalFocusSeconds } = useAchievementsStore();

  const hours = Math.floor(totalFocusSeconds / 3600);
  const mins = Math.floor((totalFocusSeconds % 3600) / 60);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Achievements</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Track your progress and earn badges</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 16,
        marginBottom: 40,
      }}>
        {[
          { label: 'Current Streak', value: `${currentStreak} days`, icon: '🔥' },
          { label: 'Longest Streak', value: `${longestStreak} days`, icon: '💪' },
          { label: 'Total Pomodoros', value: totalPomodoros.toString(), icon: '🍅' },
          { label: 'Focus Time', value: `${hours}h ${mins}m`, icon: '⏰' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--surface)',
            borderRadius: 16,
            padding: 20,
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
        <Trophy size={20} style={{ display: 'inline', marginRight: 8 }} />
        Badges ({unlockedBadges.length}/{BADGES.length})
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {BADGES.map((badge) => {
          const unlocked = unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 14,
                padding: 16,
                border: unlocked ? '1px solid var(--accent)' : '1px solid var(--border)',
                opacity: unlocked ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: unlocked ? 'oklch(from var(--accent) l c h / 0.1)' : 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>
                {unlocked ? badge.icon : <Lock size={16} style={{ color: 'var(--muted)' }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{badge.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{badge.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
