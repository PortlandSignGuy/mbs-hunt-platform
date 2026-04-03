import { useState, useEffect } from 'react';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

/**
 * Returns true once all persisted Zustand stores have rehydrated from localStorage.
 * Checks synchronously first (already hydrated?), then subscribes for late hydration.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(
    () => useHuntStore.persist.hasHydrated() && usePlayerStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (hydrated) return;

    function check() {
      if (useHuntStore.persist.hasHydrated() && usePlayerStore.persist.hasHydrated()) {
        setHydrated(true);
      }
    }

    // Subscribe to both stores
    const unsub1 = useHuntStore.persist.onFinishHydration(check);
    const unsub2 = usePlayerStore.persist.onFinishHydration(check);

    // Check immediately in case both already hydrated between render and effect
    check();

    return () => {
      if (typeof unsub1 === 'function') unsub1();
      if (typeof unsub2 === 'function') unsub2();
    };
  }, [hydrated]);

  return hydrated;
}
