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

  if (!player) return <Navigate to="/join" replace />;

  // Find the stop across all hunts if no active hunt, or within active hunt
  let stop = null;
  let parentHunt = hunt;

  if (hunt) {
    stop = hunt.stops?.find((s) => s.id === slug || s.slug === slug);
  }

  // Fallback: search all published hunts for this stop
  if (!stop) {
    for (const h of hunts) {
      const found = h.stops?.find((s) => s.id === slug || s.slug === slug);
      if (found) {
        stop = found;
        parentHunt = h;
        // Auto-set active hunt when scanning from a QR code
        if (activeHuntId !== h.id) {
          setActiveHunt(h.id);
        }
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
        <Link to="/" className="text-primary-600 hover:underline font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const huntCollected = usePlayerStore.getState().getCollected(parentHunt.id);
  const alreadyCollected = huntCollected.some((c) => c.stopId === stop.id);
  const totalStops = parentHunt.stops?.length || 0;
  const newCount = huntCollected.length + (alreadyCollected ? 0 : 1);
  const allDone = newCount >= totalStops;

  function handleCollect() {
    collectStop(parentHunt.id, {
      stopId: stop.id,
      stopName: stop.name,
      photoUrl: stop.photoUrl || null,
      collectedAt: new Date().toISOString(),
    });

    if (allDone) {
      addToast({ type: 'success', message: 'You collected them all! Claim your reward!' });
    } else {
      addToast({ type: 'success', message: `${stop.name} collected! (${newCount}/${totalStops})` });
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-cream-50 rounded-card shadow-lg border border-cream-400 overflow-hidden">
        {/* Stop photo */}
        {stop.photoUrl ? (
          <img src={stop.photoUrl} alt={stop.name} className="w-full h-52 object-cover" />
        ) : (
          <div className="h-52 bg-gradient-to-br from-primary-200 via-secondary-200 to-nature-200 flex items-center justify-center">
            <span className="text-7xl animate-float">🎨</span>
          </div>
        )}

        <div className="p-6 text-center space-y-4">
          <div>
            <p className="text-primary-500 text-xs font-bold uppercase tracking-wider mb-1">
              {parentHunt.name}
            </p>
            <h1 className="font-display text-2xl text-primary-600">{stop.name}</h1>
          </div>
          {stop.artist && (
            <p className="text-surface-500 font-semibold">by {stop.artist}</p>
          )}
          {stop.description && (
            <p className="text-surface-600 text-sm">{stop.description}</p>
          )}

          {alreadyCollected ? (
            <div className="bg-nature-50 border border-nature-300 rounded-card p-4">
              <p className="text-nature-700 font-bold">Already in your collection!</p>
            </div>
          ) : (
            <button
              onClick={handleCollect}
              className="w-full bg-primary-500 text-white font-display text-lg py-3.5 rounded-button shadow-lg hover:bg-primary-600 hover:shadow-xl active:scale-[0.98] transition-all"
            >
              Collect This Photo!
            </button>
          )}

          {/* Progress indicator */}
          <div className="pt-2">
            <p className="text-surface-400 text-xs font-bold">
              {huntCollected.length + (alreadyCollected ? 0 : 0)} of {totalStops} collected
            </p>
          </div>

          <Link
            to="/hunt"
            className="block text-primary-600 hover:underline text-sm font-bold no-underline"
          >
            ← View All Stops
          </Link>
        </div>
      </div>
    </div>
  );
}
