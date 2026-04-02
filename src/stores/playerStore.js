import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      /** { name, email } or null if not registered */
      player: null,

      /**
       * Collections keyed by hunt slug:
       * { [huntSlug]: [{ stopId, stopName, photoUrl, collectedAt }] }
       */
      collections: {},

      register: ({ name, email }) =>
        set({ player: { name, email, registeredAt: new Date().toISOString() } }),

      logout: () => set({ player: null }),

      collectStop: (huntSlug, stopData) =>
        set((s) => {
          const existing = s.collections[huntSlug] || [];
          if (existing.some((c) => c.stopId === stopData.stopId)) return s;
          return {
            collections: {
              ...s.collections,
              [huntSlug]: [...existing, stopData],
            },
          };
        }),

      getCollected: (huntSlug) => get().collections[huntSlug] || [],
    }),
    { name: 'mbs-player' },
  ),
);
