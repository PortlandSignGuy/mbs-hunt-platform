import { Link, Navigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function HuntPage() {
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collected = usePlayerStore((s) => s.getCollected(activeHuntId));

  if (!player) return <Navigate to="/join" replace />;
  if (!hunt) return <Navigate to="/" replace />;

  const stops = hunt.stops || [];
  const collectedIds = new Set(collected.map((c) => c.stopId));
  const totalStops = stops.length;
  const collectedCount = collectedIds.size;
  const allCollected = totalStops > 0 && collectedCount >= totalStops;
  const progressPct = totalStops > 0 ? (collectedCount / totalStops) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Hunt header */}
      <div className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{hunt.emoji || '🎨'}</span>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl text-primary-600 leading-tight">{hunt.name}</h1>
            <p className="text-surface-500 text-sm font-semibold">{hunt.city}</p>
          </div>
        </div>

        {hunt.description && (
          <p className="text-surface-600 text-sm mb-4">{hunt.description}</p>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm font-bold mb-1.5">
            <span className="text-surface-600">{collectedCount} of {totalStops} collected</span>
            <span className="text-primary-600">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-3.5 bg-cream-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-nature-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {allCollected && (
          <Link
            to="/complete"
            className="inline-block mt-4 w-full text-center bg-secondary-400 text-surface-900 font-display text-lg py-3 rounded-button shadow-md hover:bg-secondary-500 hover:shadow-lg transition-all no-underline animate-bounce"
          >
            Claim Your Reward!
          </Link>
        )}
      </div>

      {/* Stops list */}
      <section>
        <h2 className="font-display text-lg text-surface-800 mb-3">Stops</h2>
        <div className="space-y-3">
          {stops.map((stop, i) => {
            const found = collectedIds.has(stop.id);
            return (
              <div
                key={stop.id}
                className={`flex items-center gap-3 rounded-card border-2 p-4 transition-all ${
                  found
                    ? 'bg-nature-50 border-nature-400'
                    : 'bg-cream-50 border-cream-400 opacity-70'
                }`}
              >
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  found ? 'bg-nature-400 text-white' : 'bg-cream-300 text-surface-500'
                }`}>
                  {found ? '✓' : i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-surface-800 text-sm">{stop.name}</h3>
                  {stop.hint && !found && (
                    <p className="text-surface-400 text-xs mt-0.5 truncate">{stop.hint}</p>
                  )}
                </div>
                {found && (
                  <span className="text-nature-600 text-xs font-bold shrink-0">Found!</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Passport + back */}
      <div className="flex items-center justify-between pb-4">
        <Link to="/" className="text-primary-600 hover:underline text-sm font-bold no-underline">
          ← Back to Hunts
        </Link>
        <Link
          to="/passport"
          className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 font-bold text-sm px-4 py-2 rounded-button hover:bg-primary-200 transition-colors no-underline"
        >
          🗺️ Passport & Map
        </Link>
      </div>
    </div>
  );
}
