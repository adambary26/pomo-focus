import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Preset {
  id: string;
  name: string;
  workDur: number;
  shortDur: number;
  longDur: number;
  interval: number;
  icon: string;
}

interface PresetsState {
  presets: Preset[];
  addPreset: (preset: Omit<Preset, 'id'>) => void;
  updatePreset: (id: string, preset: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
  getPreset: (id: string) => Preset | undefined;
}

export const usePresetsStore = create<PresetsState>()(
  persist(
    (set, get) => ({
      presets: [
        { id: 'default', name: 'Classic', workDur: 25, shortDur: 5, longDur: 15, interval: 4, icon: '🍅' },
        { id: 'deep', name: 'Deep Focus', workDur: 50, shortDur: 10, longDur: 20, interval: 3, icon: '🧠' },
        { id: 'quick', name: 'Quick Sprint', workDur: 15, shortDur: 3, longDur: 10, interval: 4, icon: '⚡' },
      ],
      addPreset: (preset) =>
        set((state) => ({
          presets: [...state.presets, { ...preset, id: Date.now().toString() }],
        })),
      updatePreset: (id, updates) =>
        set((state) => ({
          presets: state.presets.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),
      getPreset: (id) => get().presets.find((p) => p.id === id),
    }),
    { name: 'pomo_presets' }
  )
);
