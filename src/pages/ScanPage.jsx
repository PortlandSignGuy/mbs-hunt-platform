import { useParams, Navigate, Link } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';

export default function ScanPage() {
  const { huntSlug, stopId } = useParams();
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.slug === huntSlug));
  const player = usePlayerStore((s) => s.player);
  const collectStop = usePlayerStore((s) => s.collectStop);
  const collected = usePlayerStore((s) => s.getCollected(huntSlug));
  const addToast = useUiStore((s) => s.addToast);

  if (!player) return <Navigate to="/register" replace />;
  if (!hunt) return <Navigate to="/home" replace />;

  const stop = hunt.stops?.find((s) => s.id === stopId);
  if (!stop) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">❓</div>
        <h1 className="font-display text-2xl font-bold text-surface-800 mb-2">Stop not found</h1>
        <Link to={`/hunt/${huntSlug}`} className="text-primary-600 hover:underline">
          Back to Hunt
        </Link>
      </div>
    );
  }

  const alreadyCollected = collected.some((c) => c.stopId === stopId);
  const totalStops = hunt.stops?.length || 0;
  const newCount = collected.length + (alreadyCollected ? 0 : 1);
  const allDone = newCount >= totalStops;

  function handleCollect() {
    collectStop(huntSlug, {
      stopId: stop.id,
      stopName: stop.name,
      photoUrl: stop.photoUrl || null,
      collectedAt: new Date().toISOString(),
    });

    if (allDone) {
      addToast({ type: 'success', message: '🎉 You collected them all! Claim your reward!' });
    } else {
      addToast({ type: 'success', message: `📸 ${stop.name} collected! (${newCount}/${totalStops})` });
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-card shadow-lg border border-surface-200 overflow-hidden">
        {/* Stop photo */}
        {stop.photoUrl ? (
          <img src={stop.photoUrl} alt={stop.name} className="w-full h-56 object-cover" />
        ) : (
          <div className="h-56 bg-gradient-to-br from-joy-200 via-primary-200 to-accent-200 flex items-center justify-center">
            <span className="text-7xl">🎨</span>
          </div>
        )}

        <div className="p-6 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-surface-800">{stop.name}</h1>
          {stop.artist && (
            <p className="text-surface-500">by {stop.artist}</p>
          )}
          {stop.description && (
            <p className="text-surface-600 text-sm">{stop.description}</p>
          )}

          {alreadyCollected ? (
            <div className="bg-nature-50 border border-nature-200 rounded-card p-4">
              <p className="text-nature-700 font-medium">✅ Already in your collection!</p>
            </div>
          ) : (
            <button
              onClick={handleCollect}
              className="w-full bg-gradient-to-r from-primary-500 via-joy-500 to-secondary-500 text-white font-display font-bold text-lg py-3 rounded-button shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              📸 Collect This Photo!
            </button>
          )}

          <Link
            to={`/hunt/${huntSlug}`}
            className="block text-primary-600 hover:underline text-sm font-medium no-underline"
          >
            ← Back to Hunt
          </Link>
        </div>
      </div>
    </div>
  );
}
