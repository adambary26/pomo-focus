'use client';

import { useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTimerStore } from './timer-engine';

export function TimerControls() {
  const { running, skipMode } = useTimerStore();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const skip = useTimerStore((s) => s.skip);
  const setSkipMode = useTimerStore((s) => s.setSkipMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        running ? pause() : start();
      } else if (e.code === 'KeyR') {
        reset();
      } else if (e.code === 'KeyS') {
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [running, start, pause, reset, skip]);

  return (
    <div className="timer-controls">
      <button
        className={`timer-btn btn-primary ${running ? 'running' : ''}`}
        onClick={running ? pause : start}
        title="Space"
      >
        {running ? <Pause size={18} /> : <Play size={18} />}
        <span>{running ? 'Pause' : 'Start'}</span>
      </button>
      <button className="timer-btn btn-secondary" onClick={reset} title="R">
        <RotateCcw size={16} />
        <span>Reset</span>
      </button>
      <button className="timer-btn btn-secondary" onClick={skip} title="S">
        <SkipForward size={16} />
        <span>Skip</span>
      </button>
      <div className="skip-mode-toggle">
        <button
          className={`skip-mode-btn ${skipMode === 'count' ? 'active' : ''}`}
          onClick={() => setSkipMode('count')}
        >
          Count
        </button>
        <button
          className={`skip-mode-btn ${skipMode === 'discard' ? 'active' : ''}`}
          onClick={() => setSkipMode('discard')}
        >
          Discard
        </button>
      </div>
    </div>
  );
}
