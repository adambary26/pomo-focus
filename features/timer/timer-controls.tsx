'use client';

import { useTimerStore } from './timer-engine';

export function TimerControls() {
  const { running, skipMode } = useTimerStore();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const skip = useTimerStore((s) => s.skip);
  const setSkipMode = useTimerStore((s) => s.setSkipMode);

  return (
    <div className="timer-controls">
      <button
        className="timer-btn btn-primary"
        onClick={running ? pause : start}
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button className="timer-btn btn-secondary" onClick={reset}>
        Reset
      </button>
      <div className="skip-wrap">
        <button className="timer-btn btn-secondary" onClick={skip}>
          Skip
        </button>
        <select
          className="skip-select"
          value={skipMode}
          onChange={(e) => setSkipMode(e.target.value as 'count' | 'discard')}
        >
          <option value="count">Count</option>
          <option value="discard">Discard</option>
        </select>
      </div>
    </div>
  );
}
