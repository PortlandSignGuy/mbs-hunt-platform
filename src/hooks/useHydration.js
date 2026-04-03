import { useSyncExternalStore } from 'react';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

/**
 * Returns true once all persisted Zustand stores have rehydrated from localStorage.
 * Uses useSyncExternalStore for immediate synchronous check — no race condition.
 */
export function useHydration() {
  const huntHydrated = useSyncExternalStore(
    (cb) => useHuntStore.persist.onFinishHydration(cb),
    () => useHuntStore.persist.hasHydrated(),
  );
  const playerHydrated = useSyncExternalStore(
    (cb) => usePlayerStore.persist.onFinishHydration(cb),
    () => usePlayerStore.persist.hasHydrated(),
  );
  return huntHydrated && playerHydrated;
}
