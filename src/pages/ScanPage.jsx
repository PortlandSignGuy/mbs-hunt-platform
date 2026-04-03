import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';

export default function ScanPage() {
  const { slug } = useParams();
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collectStop = usePlayerStore((s) => s.collectStop);
  const setActiveHunt = usePlayerStore((s) => s.setActiveHunt);
  const hunts = useHuntStore((s) => s.hunts);
  const collected = usePlayerStore((s) => s.getCollected(activeHuntId));
  const addToast = useUiStore((s) => s.addToast);
  const [justCollected, setJustCollected] = useState(false);

  if (!player) return <Navigate to="/join" replace />;

  // Find the stop across all hunts
  let stop = null;
  let parentHunt = hunt;

  if (hunt) {
    stop = hunt.stops?.find((s) => s.id === slug || s.slug === slug);
  }

  if (!stop) {
    for (const h of hunts) {
      const found = h.stops?.find((s) => s.id === slug || s.slug === slug);
      if (found) {
        stop = found;
        parentHunt = h;
        if (activeHuntId !== h.id) setActiveHunt(h.id);
        break;
      }
    }
  }

  if (!stop || !parentHunt) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-5xl mb-4">❓</div>
        <h1 className="font-display text-2xl text-surface-800 mb-2">Stop not found</h1>
        <p className="text-surface-500 text-sm mb-4">This QR code doesn't match any active hunt.</p>
        <Link to="/" className="text-primary-600 hover:underline font-bold">Back to Home</Link>
      </div>
    );
  }

  const huntCollected = usePlayerStore.getState().getCollected(parentHunt.id);
  const alreadyCollected = huntCollected.some((c) => c.stopId === stop.id);
  const totalStops = (parentHunt.stops || []).filter((s) => !s.isBonus).length;
  const currentCount = huntCollected.filter(
    (c) => (parentHunt.stops || []).find((s) => s.id === c.stopId && !s.isBonus)
  ).length;
  const newCount = currentCount + (alreadyCollected || justCollected ? 0 : 1);
  const allDone = newCount >= totalStops;

  function handleCollect() {
    collectStop(parentHunt.id, {
      stopId: stop.id,
      stopName: stop.name,
      photoUrl: stop.photoUrl || null,
      collectedAt: new Date().toISOString(),
    });
    setJustCollected(true);

    if (allDone) {
      addToast({ type: 'success', message: 'You collected them all!' });
    } else {
      addToast({ type: 'success', message: `${stop.name} collected! (${newCount}/${totalStops})` });
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-cream-50 rounded-card shadow-lg border border-cream-400 overflow-hidden">
        {/* Stop photo */}
        {stop.photoUrl ? (
          <img src={stop.photoUrl} alt={stop.name} className="w-full h-44 object-cover" />
        ) : (
          <div className="h-44 bg-gradient-to-br from-primary-200 via-secondary-200 to-nature-200 flex items-center justify-center">
            <span className="text-6xl animate-float">🎨</span>
          </div>
        )}

        <div className="p-5 text-center space-y-4">
          <div>
            <p className="text-primary-500 text-xs font-bold uppercase tracking-wider mb-1">
              {parentHunt.name}
            </p>
            <h1 className="font-display text-2xl text-primary-600">{stop.name}</h1>
          </div>
          {stop.artist && (
            <p className="text-surface-600 font-semibold text-sm">by {stop.artist}</p>
          )}
          {stop.description && (
            <p className="text-surface-600 text-sm">{stop.description}</p>
          )}

          {/* Collect / Already collected / Just collected states */}
          {justCollected ? (
            <div className="space-y-3">
              <div className="bg-nature-100 border-2 border-nature-400 rounded-card p-4">
                <div className="text-3xl mb-1">✅</div>
                <p className="text-nature-700 font-bold text-lg">Collected!</p>
                <p className="text-nature-600 text-sm mt-1">{newCount} of {totalStops} found</p>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-cream-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-nature-400 rounded-full transition-all duration-700"
                  style={{ width: `${(newCount / totalStops) * 100}%` }}
                />
              </div>

              {/* Next step */}
              {allDone ? (
                <Link
                  to="/complete"
                  className="block w-full bg-secondary-400 text-surface-900 font-display text-lg py-3 rounded-button shadow-md hover:bg-secondary-500 transition-all no-underline"
                >
                  Claim Your Reward!
                </Link>
              ) : (
                <Link
                  to="/hunt"
                  className="block w-full bg-primary-500 text-white font-display text-lg py-3 rounded-button shadow-md hover:bg-primary-600 transition-all no-underline"
                >
                  Keep Hunting! ({totalStops - newCount} left)
                </Link>
              )}
            </div>
          ) : alreadyCollected ? (
            <div className="space-y-3">
              <div className="bg-nature-50 border border-nature-300 rounded-card p-4">
                <p className="text-nature-700 font-bold">Already in your collection!</p>
              </div>
              <Link
                to="/hunt"
                className="block text-primary-600 hover:underline font-bold no-underline"
              >
                ← View All Stops
              </Link>
            </div>
          ) : (
            <button
              onClick={handleCollect}
              className="w-full bg-primary-500 text-white font-display text-lg py-3.5 rounded-button shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
            >
              Collect This Photo!
            </button>
          )}

          {/* Progress (only show before collecting) */}
          {!justCollected && !alreadyCollected && (
            <p className="text-surface-500 text-xs font-bold pt-1">
              {currentCount} of {totalStops} collected so far
            </p>
          )}

          {!justCollected && (
            <Link
              to="/hunt"
              className="block text-primary-600 hover:underline text-sm font-bold no-underline"
            >
              ← View All Stops
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
