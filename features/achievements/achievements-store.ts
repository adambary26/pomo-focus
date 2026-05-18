import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: any) => boolean;
}

export const BADGES: Badge[] = [
  { id: 'first_pomo', name: 'First Step', description: 'Complete your first Pomodoro', icon: '🌱', condition: (s) => s.total_pomodoros >= 1 },
  { id: 'ten_pomos', name: 'Getting Started', description: 'Complete 10 Pomodoros', icon: '🔥', condition: (s) => s.total_pomodoros >= 10 },
  { id: 'fifty_pomos', name: 'Focus Master', description: 'Complete 50 Pomodoros', icon: '⭐', condition: (s) => s.total_pomodoros >= 50 },
  { id: 'hundred_pomos', name: 'Legend', description: 'Complete 100 Pomodoros', icon: '👑', condition: (s) => s.total_pomodoros >= 100 },
  { id: 'streak_3', name: 'On Fire', description: '3-day streak', icon: '🔥', condition: (s) => s.current_streak >= 3 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '💪', condition: (s) => s.current_streak >= 7 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '🏆', condition: (s) => s.current_streak >= 30 },
  { id: 'hours_10', name: 'Dedicated', description: '10 hours of focus', icon: '⏰', condition: (s) => s.total_focus_seconds >= 36000 },
  { id: 'hours_50', name: 'Centurion', description: '50 hours of focus', icon: '🎯', condition: (s) => s.total_focus_seconds >= 180000 },
  { id: 'hours_100', name: 'Immortal', description: '100 hours of focus', icon: '💎', condition: (s) => s.total_focus_seconds >= 360000 },
];

interface AchievementsState {
  unlockedBadges: string[];
  currentStreak: number;
  longestStreak: number;
  totalPomodoros: number;
  totalFocusSeconds: number;
  lastActiveDate: string | null;

  recordSession: (focusSeconds: number) => void;
  checkBadges: () => string[];
  resetStreak: () => void;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlockedBadges: [],
      currentStreak: 0,
      longestStreak: 0,
      totalPomodoros: 0,
      totalFocusSeconds: 0,
      lastActiveDate: null,

      recordSession: (focusSeconds) => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, currentStreak, longestStreak, totalPomodoros, totalFocusSeconds } = get();

        let newStreak = currentStreak;
        if (lastActiveDate) {
          const last = new Date(lastActiveDate);
          const now = new Date(today);
          const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = currentStreak + 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          totalPomodoros: totalPomodoros + 1,
          totalFocusSeconds: totalFocusSeconds + focusSeconds,
          lastActiveDate: today,
        });
      },

      checkBadges: () => {
        const state = get();
        const stats = {
          total_pomodoros: state.totalPomodoros,
          total_focus_seconds: state.totalFocusSeconds,
          current_streak: state.currentStreak,
        };

        const newBadges: string[] = [];
        for (const badge of BADGES) {
          if (!state.unlockedBadges.includes(badge.id) && badge.condition(stats)) {
            newBadges.push(badge.id);
          }
        }

        if (newBadges.length > 0) {
          set({ unlockedBadges: [...state.unlockedBadges, ...newBadges] });
        }

        return newBadges;
      },

      resetStreak: () => set({ currentStreak: 0 }),
    }),
    { name: 'pomo_achievements' }
  )
);
