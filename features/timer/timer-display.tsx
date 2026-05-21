'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from './timer-engine';

export function TimerDisplay() {
  const { phase, seconds, currentSession, settings } = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const running = useTimerStore((s) => s.running);
  const tick = useTimerStore((s) => s.tick);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const isBreak = phase !== 'work';

  const totalSeconds = phase === 'work'
    ? settings.workDur * 60
    : phase === 'long'
      ? settings.longDur * 60
      : settings.shortDur * 60;
  const progress = 1 - (seconds / totalSeconds);
  const radius = 140;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const phaseColors: Record<string, { stroke: string; glow: string; bg: string }> = {
    work: { stroke: 'var(--accent)', glow: 'oklch(from var(--accent) l c h / 0.15)', bg: 'oklch(from var(--accent) l c h / 0.05)' },
    short: { stroke: 'var(--break-color)', glow: 'oklch(from var(--break-color) l c h / 0.15)', bg: 'oklch(from var(--break-color) l c h / 0.05)' },
    long: { stroke: 'var(--break-color)', glow: 'oklch(from var(--break-color) l c h / 0.15)', bg: 'oklch(from var(--break-color) l c h / 0.05)' },
  };
  const colors = phaseColors[phase] || phaseColors.work;

  return (
    <>
      <div className={`timer-phase-label ${isBreak ? 'break' : 'work'}`}>
        <span className="phase-dot" style={{ background: colors.stroke }} />
        {phase === 'work' ? 'Focus Time' : phase === 'long' ? 'Long Break' : 'Short Break'}
      </div>

      <div className="timer-ring-container">
        <svg className="timer-ring" viewBox="0 0 300 300">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke={colors.bg}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 150 150)"
            filter="url(#glow)"
            style={{
              transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
            }}
          />
          {running && (
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={strokeWidth + 4}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 150 150)"
              opacity="0.15"
              style={{
                transition: 'stroke-dashoffset 1s linear',
              }}
            />
          )}
        </svg>
        <div className="timer-ring-content">
          <div className="timer-display">{display}</div>
          <div className="timer-session">
            Session {currentSession} / {settings.interval}
          </div>
        </div>
      </div>
    </>
  );
}
