export type LogLevel = 'info' | 'warn' | 'error';

export type TimerPhase = 'work' | 'short' | 'long';

export interface TimerSettings {
  workDur: number;
  shortDur: number;
  longDur: number;
  interval: number;
}

export interface TimerStats {
  pomodoros: number;
  focusSeconds: number;
  sessionCount: number;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Palette {
  id: string;
  label: string;
  color: string;
}

export interface MusicTrack {
  id: string;
  label: string;
  url: string;
}

export interface AppState {
  settings: TimerSettings;
  stats: TimerStats;
  tasks: Task[];
  theme: 'light' | 'dark';
  palette: string;
}
