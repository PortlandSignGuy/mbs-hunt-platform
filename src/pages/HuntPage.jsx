import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore, useCollected } from '../stores/playerStore.js';
import CharacterCard from '../components/hunt/CharacterCard.jsx';
import CharacterDetailModal from '../components/hunt/CharacterDetailModal.jsx';

export default function HuntPage() {
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collected = useCollected(activeHuntId);
  const [detailStop, setDetailStop] = useState(null);

  if (!hunt) return <Navigate to="/" replace />;

  const allStops = hunt.stops || [];
  const stops = allStops.filter((s) => s.is_active !== false);
  const baseStops = stops.filter((s) => !s.isBonus);
  const bonusStops = stops.filter((s) => s.isBonus);
  const collectedIds = new Set(collected.map((c) => c.stopId));
  const collectedCount = [...collectedIds].filter(
    (id) => baseStops.find((s) => s.id === id)
  ).length;
  const totalStops = baseStops.length;
  const allCollected = totalStops > 0 && collectedCount >= totalStops;
  const progressPct = totalStops > 0 ? (collectedCount / totalStops) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Register prompt */}
      {!player && (
        <Link
          to="/join"
          className="block bg-secondary-100 border-2 border-secondary-400 rounded-card p-4 text-center no-underline hover:bg-secondary-200 transition-colors"
        >
          <p className="font-display text-lg text-secondary-700">Join to save your progress!</p>
          <p className="text-surface-600 text-sm mt-1">Register to track your scans across devices.</p>
        </Link>
      )}

      {/* Hunt header */}
      <div className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{hunt.emoji || '🏔️'}</span>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-primary-600 leading-tight">{hunt.name}</h1>
            <p className="text-surface-500 text-sm font-semibold">{hunt.city}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between text-sm font-bold mb-1.5">
          <span className="text-surface-600">{collectedCount} of {totalStops} characters found</span>
          <span className="text-primary-600">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-3 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-nature-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {allCollected && (
          <Link
            to="/complete"
            className="block mt-4 w-full text-center bg-secondary-400 text-surface-900 font-display text-lg py-3 rounded-button shadow-md hover:bg-secondary-500 transition-all no-underline animate-bounce"
          >
            Claim Your Reward!
          </Link>
        )}
      </div>

      {/* Passport & Map */}
      <Link
        to="/passport"
        className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white font-display text-base py-3 rounded-button shadow-md hover:bg-primary-600 transition-all no-underline"
      >
        🗺️ View Passport & Map
      </Link>

      {/* Character cards — mystery or revealed */}
      <section>
        <h2 className="font-display text-lg text-surface-800 mb-3">
          Characters ({collectedCount}/{totalStops})
        </h2>
        <div className="space-y-3">
          {baseStops.map((stop) => {
            const found = collectedIds.has(stop.id);
            return (
              <CharacterCard
                key={stop.id}
                stop={stop}
                isCollected={found}
                size="md"
                onClick={() => setDetailStop(stop)}
              />
            );
          })}
        </div>

        {/* Bonus characters */}
        {bonusStops.length > 0 && (
          <div className="mt-6">
            <h3 className="font-display text-sm text-secondary-600 uppercase tracking-wider mb-3">
              Bonus Characters
            </h3>
            <div className="space-y-3">
              {bonusStops.map((stop) => {
                const found = collectedIds.has(stop.id);
                return (
                  <CharacterCard
                    key={stop.id}
                    stop={stop}
                    isCollected={found}
                    size="md"
                    onClick={() => setDetailStop(stop)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Back */}
      <div className="text-center pb-4">
        <Link to="/" className="text-primary-600 hover:underline text-sm font-bold no-underline">
          ← Back to Hunts
        </Link>
      </div>

      {/* Detail modal */}
      {detailStop && (
        <CharacterDetailModal
          stop={detailStop}
          isCollected={collectedIds.has(detailStop.id)}
          onClose={() => setDetailStop(null)}
        />
      )}
    </div>
  );
}
