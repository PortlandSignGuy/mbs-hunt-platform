import { useEffect, useState } from 'react';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

/**
 * Returns true once all persisted Zustand stores have rehydrated from localStorage.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubs = [
      useHuntStore.persist.onFinishHydration(() => check()),
      usePlayerStore.persist.onFinishHydration(() => check()),
    ];

    function check() {
      if (
        useHuntStore.persist.hasHydrated() &&
        usePlayerStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    }

    check();
    return () => unsubs.forEach((u) => u?.());
  }, []);

  return hydrated;
}
