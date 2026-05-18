import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerPhase, TimerSettings, TimerStats } from '@/shared/types';
import { loadState, saveState } from '@/shared/storage';
import { playBeep } from '@/features/audio/audio-engine';
import { useAchievementsStore, BADGES } from '@/features/achievements/achievements-store';
import { pushSyncData } from '@/features/sync/sync-engine';
import { useToastStore } from '@/features/notifications/toast-store';

interface TimerState {
  phase: TimerPhase;
  seconds: number;
  running: boolean;
  currentSession: number;
  skipMode: 'count' | 'discard';

  settings: TimerSettings;
  stats: TimerStats;

  setSettings: (settings: TimerSettings) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setSkipMode: (mode: 'count' | 'discard') => void;
  tick: () => void;
  advancePhase: () => void;
}

const initialState = loadState();

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: 'work',
      seconds: initialState.settings.workDur * 60,
      running: false,
      currentSession: 1,
      skipMode: 'count',

      settings: initialState.settings,
      stats: initialState.stats,

      setSettings: (settings) => {
        set({ settings });
        saveState({ settings });
        pushSyncData('settings', settings).catch(() => {});
        const { phase } = get();
        if (!get().running) {
          const dur = phase === 'work' ? settings.workDur : phase === 'long' ? settings.longDur : settings.shortDur;
          set({ seconds: dur * 60 });
        }
      },

      start: () => set({ running: true }),
      pause: () => set({ running: false }),
      reset: () => {
        set({
          running: false,
          phase: 'work',
          seconds: get().settings.workDur * 60,
          currentSession: 1,
        });
      },

      skip: () => {
        const { phase, skipMode, stats, settings } = get();
        let newStats = { ...stats };
        let newSession = get().currentSession;

        if (skipMode === 'count' && phase === 'work') {
          newStats.pomodoros++;
          newStats.focusSeconds += settings.workDur * 60;
          newStats.sessionCount++;
          newSession++;

          const achievements = useAchievementsStore.getState();
          achievements.recordSession(settings.workDur * 60);
          achievements.checkBadges();

          pushSyncData('stats', newStats).catch(() => {});
        }

        const nextPhase = phase === 'work'
          ? (newStats.sessionCount % settings.interval === 0 ? 'long' : 'short')
          : 'work';

        const nextSeconds = nextPhase === 'work'
          ? settings.workDur * 60
          : nextPhase === 'long'
            ? settings.longDur * 60
            : settings.shortDur * 60;

        set({
          running: false,
          phase: nextPhase,
          seconds: nextSeconds,
          currentSession: newSession,
          stats: newStats,
        });
        saveState({ stats: newStats });
      },

      setSkipMode: (mode) => set({ skipMode: mode }),

      advancePhase: () => {
        const { phase, stats, settings } = get();
        playBeep();

        let newStats = { ...stats };
        let newSession = get().currentSession;

        if (phase === 'work') {
          newStats.pomodoros++;
          newStats.focusSeconds += settings.workDur * 60;
          newStats.sessionCount++;
          newSession++;

          const achievements = useAchievementsStore.getState();
          achievements.recordSession(settings.workDur * 60);
          const newBadges = achievements.checkBadges();

          if (newBadges.length > 0) {
            const { addToast } = useToastStore.getState();
            for (const badgeId of newBadges) {
              const badge = BADGES.find((b) => b.id === badgeId);
              if (badge) {
                addToast({ icon: badge.icon, title: badge.name, description: badge.description });
              }
            }
          }

          pushSyncData('stats', newStats).catch(() => {});
        }

        const nextPhase = phase === 'work'
          ? (newStats.sessionCount % settings.interval === 0 ? 'long' : 'short')
          : 'work';

        const nextSeconds = nextPhase === 'work'
          ? settings.workDur * 60
          : nextPhase === 'long'
            ? settings.longDur * 60
            : settings.shortDur * 60;

        set({
          running: false,
          phase: nextPhase,
          seconds: nextSeconds,
          currentSession: newSession,
          stats: newStats,
        });
        saveState({ stats: newStats });
      },

      tick: () => {
        const { seconds, advancePhase } = get();
        if (seconds <= 1) {
          advancePhase();
        } else {
          set({ seconds: seconds - 1 });
        }
      },
    }),
    {
      name: 'pomo_timer_state',
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        skipMode: state.skipMode,
      }),
    }
  )
);
