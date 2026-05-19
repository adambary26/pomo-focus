import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from '@/features/notifications/toast-store';

interface Reward {
  type: 'bonus-xp' | 'motivation' | 'streak-freeze' | 'theme-unlock';
  title: string;
  description: string;
  icon: string;
  value?: number;
}

const REWARD_POOL: Omit<Reward, 'type'>[] = [
  { title: 'Double Focus!', description: 'This session counts as 2x progress', icon: '⚡', value: 2 },
  { title: 'Flow State!', description: 'You earned bonus focus minutes', icon: '🌊', value: 5 },
  { title: 'Lucky Break!', description: '+10 minutes credited to your day', icon: '🍀', value: 10 },
  { title: 'Focus Burst!', description: 'Triple progress this session', icon: '💥', value: 3 },
  { title: 'Zen Mode', description: 'You found inner focus', icon: '🧘', value: 1 },
  { title: 'Streak Shield!', description: 'Your streak is protected for tomorrow', icon: '🛡️' },
  { title: 'Focus Master', description: 'Your brain is leveling up', icon: '🧠', value: 1 },
  { title: 'Deep Work!', description: 'Quality focus detected', icon: '🎯', value: 2 },
];

const MOTIVATIONAL_MESSAGES = [
  { title: 'Keep it up!', description: 'You\'re building a powerful habit', icon: '🔥' },
  { title: 'Great focus!', description: 'Your future self will thank you', icon: '⭐' },
  { title: 'On fire!', description: 'Nothing can stop you now', icon: '💪' },
  { title: 'Well done!', description: 'Another session conquered', icon: '🏆' },
  { title: 'Momentum!', description: 'You\'re in the zone', icon: '🚀' },
  { title: 'Focus champion!', description: 'One more step to mastery', icon: '👑' },
];

interface RewardsState {
  totalRewardsEarned: number;
  streakFreezes: number;
  bonusMultiplier: number | null;
  lastRewardTime: number | null;
  triggerReward: (sessionCount: number) => void;
  consumeStreakFreeze: () => boolean;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      totalRewardsEarned: 0,
      streakFreezes: 0,
      bonusMultiplier: null,
      lastRewardTime: null,

      triggerReward: (sessionCount) => {
        const now = Date.now();
        const roll = Math.random();

        let reward: Reward;

        if (roll < 0.25) {
          const base = getRandomItem(REWARD_POOL);
          reward = { ...base, type: base.title.includes('Shield') ? 'streak-freeze' : 'bonus-xp' };
        } else if (roll < 0.55) {
          const msg = getRandomItem(MOTIVATIONAL_MESSAGES);
          reward = { ...msg, type: 'motivation' };
        } else {
          return;
        }

        if (reward.type === 'streak-freeze') {
          set((s) => ({ streakFreezes: s.streakFreezes + 1 }));
        }

        if (reward.type === 'bonus-xp' && reward.value) {
          set({ bonusMultiplier: reward.value, lastRewardTime: now });
          setTimeout(() => set({ bonusMultiplier: null }), 30 * 60 * 1000);
        }

        set((s) => ({ totalRewardsEarned: s.totalRewardsEarned + 1 }));

        const { addToast } = useToastStore.getState();
        addToast({
          icon: reward.icon,
          title: `🎁 ${reward.title}`,
          description: reward.description,
        });
      },

      consumeStreakFreeze: () => {
        const { streakFreezes } = get();
        if (streakFreezes > 0) {
          set({ streakFreezes: streakFreezes - 1 });
          return true;
        }
        return false;
      },
    }),
    { name: 'pomo_rewards' }
  )
);
