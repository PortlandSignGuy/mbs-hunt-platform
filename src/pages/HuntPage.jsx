import { useParams, Link, Navigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function HuntPage() {
  const { huntSlug } = useParams();
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.slug === huntSlug));
  const player = usePlayerStore((s) => s.player);
  const collected = usePlayerStore((s) => s.getCollected(huntSlug));

  if (!hunt) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-display text-2xl font-bold text-surface-800 mb-2">Hunt not found</h1>
        <Link to="/home" className="text-primary-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  if (!player) return <Navigate to="/register" replace />;

  const stops = hunt.stops || [];
  const collectedIds = new Set(collected.map((c) => c.stopId));
  const totalStops = stops.length;
  const collectedCount = collectedIds.size;
  const allCollected = totalStops > 0 && collectedCount >= totalStops;
  const progressPct = totalStops > 0 ? (collectedCount / totalStops) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Hunt header */}
      <div className="bg-white rounded-card shadow-sm border border-surface-200 p-6">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{hunt.emoji || '🎨'}</span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-surface-800">{hunt.name}</h1>
            <p className="text-surface-500 mt-1">{hunt.city}</p>
            {hunt.description && (
              <p className="text-surface-600 mt-3">{hunt.description}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-surface-600">{collectedCount} of {totalStops} collected</span>
            <span className="text-primary-600">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-4 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 via-joy-400 to-accent-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {allCollected && (
          <Link
            to={`/hunt/${huntSlug}/reward`}
            className="inline-block mt-4 bg-gradient-to-r from-accent-400 to-accent-500 text-white font-display font-bold px-6 py-2.5 rounded-button shadow-md hover:shadow-lg transition-all no-underline animate-bounce"
          >
            🎉 Claim Your Reward!
          </Link>
        )}
      </div>

      {/* Stops grid */}
      <section>
        <h2 className="font-display text-xl font-bold text-surface-800 mb-4">Stops</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stops.map((stop, i) => {
            const found = collectedIds.has(stop.id);
            return (
              <div
                key={stop.id}
                className={`relative rounded-card border-2 p-5 transition-all ${
                  found
                    ? 'bg-nature-50 border-nature-300 shadow-sm'
                    : 'bg-white border-surface-200 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    found ? 'bg-nature-500 text-white' : 'bg-surface-200 text-surface-500'
                  }`}>
                    {found ? '✓' : i + 1}
                  </span>
                  <h3 className="font-display font-bold text-surface-800">{stop.name}</h3>
                </div>
                {stop.hint && (
                  <p className="text-surface-500 text-sm">{stop.hint}</p>
                )}
                {found && stop.photoUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img src={stop.photoUrl} alt={stop.name} className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* View collection link */}
      {collectedCount > 0 && (
        <div className="text-center">
          <Link
            to={`/hunt/${huntSlug}/collection`}
            className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
          >
            View your full collection →
          </Link>
        </div>
      )}
    </div>
  );
}
