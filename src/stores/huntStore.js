import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHuntStore = create(
  persist(
    (set, get) => ({
      hunts: [],

      setHunts: (hunts) => set({ hunts }),

      addHunt: (hunt) =>
        set((s) => {
          const idx = s.hunts.findIndex((h) => h.id === hunt.id);
          if (idx >= 0) {
            const updated = [...s.hunts];
            updated[idx] = { ...updated[idx], ...hunt };
            return { hunts: updated };
          }
          return { hunts: [hunt, ...s.hunts] };
        }),

      updateHunt: (id, patch) =>
        set((s) => ({
          hunts: s.hunts.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      removeHunt: (id) =>
        set((s) => ({ hunts: s.hunts.filter((h) => h.id !== id) })),

      addStop: (huntId, stop) =>
        set((s) => ({
          hunts: s.hunts.map((h) =>
            h.id === huntId ? { ...h, stops: [...(h.stops || []), stop] } : h,
          ),
        })),

      removeStop: (huntId, stopId) =>
        set((s) => ({
          hunts: s.hunts.map((h) =>
            h.id === huntId
              ? { ...h, stops: (h.stops || []).filter((st) => st.id !== stopId) }
              : h,
          ),
        })),

      publishHunt: (id) =>
        set((s) => ({
          hunts: s.hunts.map((h) =>
            h.id === id ? { ...h, status: 'published' } : h,
          ),
        })),
    }),
    { name: 'mbs-hunts' },
  ),
);
