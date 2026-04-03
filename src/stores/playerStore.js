import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Stable empty array — returned when no collection exists to avoid new ref per call */
const EMPTY = [];

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      /** { name, email, marketingOptIn, registeredAt } or null */
      player: null,

      /** Currently active hunt ID (set when player picks a hunt) */
      activeHuntId: null,

      /**
       * Collections keyed by hunt ID:
       * { [huntId]: [{ stopId, stopName, photoUrl, collectedAt }] }
       */
      collections: {},

      register: ({ name, email, marketingOptIn }) =>
        set({
          player: {
            name,
            email,
            marketingOptIn: marketingOptIn || false,
            registeredAt: new Date().toISOString(),
          },
        }),

      logout: () => set({ player: null, activeHuntId: null }),

      setActiveHunt: (huntId) => set({ activeHuntId: huntId }),

      collectStop: (huntId, stopData) =>
        set((s) => {
          const existing = s.collections[huntId] || [];
          if (existing.some((c) => c.stopId === stopData.stopId)) return s;
          return {
            collections: {
              ...s.collections,
              [huntId]: [...existing, stopData],
            },
          };
        }),

      /** Clear all collections (keeps player registration) */
      resetProgress: () => set({ collections: {}, activeHuntId: null }),

      /** Attach a player photo to a collected stop */
      addPhoto: (huntId, stopId, photoDataUrl) =>
        set((s) => {
          const items = s.collections[huntId];
          if (!items) return s;
          return {
            collections: {
              ...s.collections,
              [huntId]: items.map((c) =>
                c.stopId === stopId
                  ? { ...c, playerPhotoUrl: photoDataUrl, photoUploadedAt: new Date().toISOString() }
                  : c,
              ),
            },
          };
        }),
    }),
    { name: 'mbs-player' },
  ),
);

/**
 * Hook to get collected stops for a hunt.
 * Returns a stable reference (won't cause re-render loops).
 */
export function useCollected(huntId) {
  return usePlayerStore((s) => s.collections[huntId] || EMPTY);
}
