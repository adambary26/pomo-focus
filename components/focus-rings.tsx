'use client';

import { useAchievementsStore } from '@/features/achievements/achievements-store';
import { useTimerStore } from '@/features/timer/timer-engine';
import { useState, useEffect } from 'react';

interface RingConfig {
  label: string;
  color: string;
  current: number;
  target: number;
  unit: string;
}

function CircularProgress({ ring, index, total }: { ring: RingConfig; index: number; total: number }) {
  const progress = Math.min(ring.current / ring.target, 1);
  const radius = 70 - index * 18;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOffset(offset), 100 + index * 150);
    return () => clearTimeout(timer);
  }, [offset, index]);

  return (
    <>
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={ring.color}
        strokeWidth={strokeWidth}
        opacity={0.15}
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={ring.color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={animatedOffset}
        strokeLinecap="round"
        transform={`rotate(-90 100 100)`}
        style={{
          transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: progress >= 1 ? `drop-shadow(0 0 6px ${ring.color})` : 'none',
        }}
      />
    </>
  );
}

export function FocusRings() {
  const { totalPomodoros, totalFocusSeconds, lastActiveDate } = useAchievementsStore();
  const { stats } = useTimerStore();
  const [todayPomodoros, setTodayPomodoros] = useState(0);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const dailyData = JSON.parse(localStorage.getItem('pomo_daily_tracking') || '{}');
    const todayData = dailyData[today] || { pomodoros: 0, focusMinutes: 0, tasks: 0 };
    setTodayPomodoros(todayData.pomodoros || 0);
    setTodayFocusMinutes(todayData.focusMinutes || 0);
    setTodayTasks(todayData.tasks || 0);
  }, [today, totalPomodoros, totalFocusSeconds, stats]);

  if (!mounted) return null;

  useEffect(() => {
    const dailyData = JSON.parse(localStorage.getItem('pomo_daily_tracking') || '{}');
    const todayData = dailyData[today] || { pomodoros: 0, focusMinutes: 0, tasks: 0 };
    setTodayPomodoros(todayData.pomodoros || 0);
    setTodayFocusMinutes(todayData.focusMinutes || 0);
    setTodayTasks(todayData.tasks || 0);
  }, [today, totalPomodoros, totalFocusSeconds, stats]);

  const rings: RingConfig[] = [
    { label: 'Focus Sessions', color: '#ff6b6b', current: todayPomodoros, target: 8, unit: 'sessions' },
    { label: 'Focus Time', color: '#4ecdc4', current: Math.round(todayFocusMinutes), target: 120, unit: 'min' },
    { label: 'Tasks Done', color: '#ffe66d', current: todayTasks, target: 5, unit: 'tasks' },
  ];

  const allComplete = rings.every((r) => r.current >= r.target);

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 20,
      padding: 24,
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {allComplete && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, oklch(from var(--accent) l c h / 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
          {rings.map((ring, i) => (
            <CircularProgress key={ring.label} ring={ring} index={i} total={rings.length} />
          ))}
          <text x="100" y="95" textAnchor="middle" fill="var(--fg)" fontSize="28" fontWeight="800">
            {rings.reduce((sum, r) => sum + Math.min(r.current, r.target), 0)}/
            {rings.reduce((sum, r) => sum + r.target, 0)}
          </text>
          <text x="100" y="115" textAnchor="middle" fill="var(--muted)" fontSize="11" fontWeight="600">
            {allComplete ? 'All complete!' : 'Keep going!'}
          </text>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Today's Focus</h3>
          {rings.map((ring) => {
            const progress = Math.min(ring.current / ring.target, 1);
            return (
              <div key={ring.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: ring.color,
                      boxShadow: progress >= 1 ? `0 0 8px ${ring.color}` : 'none',
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{ring.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: progress >= 1 ? ring.color : 'var(--muted)' }}>
                    {ring.current}/{ring.target} {ring.unit}
                  </span>
                </div>
                <div style={{
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--bg)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress * 100}%`,
                    background: ring.color,
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
