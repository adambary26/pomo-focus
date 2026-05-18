import type { AppState, TimerSettings, TimerStats, Task } from './types';

const STORAGE_KEY = 'pomo_state';

const DEFAULT_SETTINGS: TimerSettings = {
  workDur: 25,
  shortDur: 5,
  longDur: 15,
  interval: 4,
};

const DEFAULT_STATS: TimerStats = {
  pomodoros: 0,
  focusSeconds: 0,
  sessionCount: 0,
};

const DEFAULT_STATE: AppState = {
  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,
  tasks: [],
  theme: 'light',
  palette: 'tech',
};

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      stats: { ...DEFAULT_STATS, ...parsed.stats },
      tasks: parsed.tasks || [],
      theme: parsed.theme || 'light',
      palette: parsed.palette || 'tech',
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: Partial<AppState>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const existing = loadState();
    const merged = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Storage full or unavailable — fail silently
  }
}
