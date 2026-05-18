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

  return (
    <>
      <div className={`timer-state${isBreak ? ' break-state' : ''}`}>
        {phase.toUpperCase()}
      </div>
      <div className="timer-display">{display}</div>
      <div className="timer-session">
        Session {currentSession} of {settings.interval}
      </div>
    </>
  );
}
