import { Link, Navigate } from 'react-router-dom';
import { usePlayerStore, useCollected } from '../stores/playerStore.js';
import { useHuntStore } from '../stores/huntStore.js';

export default function CompletePage() {
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collected = useCollected(activeHuntId);

  if (!player) return <Navigate to="/join" replace />;
  if (!hunt) return <Navigate to="/" replace />;

  const totalStops = hunt.stops?.length || 0;
  const allCollected = totalStops > 0 && collected.length >= totalStops;

  if (!allCollected) {
    return (
      <div className="max-w-md mx-auto mt-8 text-center">
        <div className="bg-cream-50 rounded-card shadow-lg border border-cream-400 p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-2xl text-surface-800 mb-2">Not Yet!</h1>
          <p className="text-surface-500 mb-4">
            Collect all {totalStops} photos to unlock your coloring page.
            You have {collected.length} so far — keep going!
          </p>
          <Link to="/hunt" className="text-primary-600 hover:underline font-bold no-underline">
            ← Continue hunting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-4">
      <div className="bg-cream-50 rounded-card shadow-lg border border-cream-400 overflow-hidden">
        {/* Celebration header */}
        <div className="bg-gradient-to-r from-secondary-300 via-primary-300 to-nature-300 p-8 text-center">
          <div className="text-6xl mb-3 animate-float">🎉</div>
          <h1 className="font-display text-3xl text-white drop-shadow-md">
            Congratulations, {player.name}!
          </h1>
          <p className="text-white/90 mt-2 font-bold">
            You completed {hunt.name}!
          </p>
        </div>

        {/* Reward */}
        <div className="p-6 text-center space-y-5">
          <div>
            <h2 className="font-display text-xl text-surface-800 mb-2">
              Your Coloring Page Reward
            </h2>
            <p className="text-surface-500 text-sm">
              Download your exclusive coloring page featuring the public art from this hunt.
            </p>
          </div>

          {/* Preview placeholder */}
          <div className="bg-white border-2 border-dashed border-cream-400 rounded-card p-8">
            <div className="text-5xl mb-3 animate-float">🎨</div>
            <p className="text-surface-400 text-sm font-semibold">Coloring page preview</p>
          </div>

          {hunt.rewardUrl ? (
            <a
              href={hunt.rewardUrl}
              download
              className="inline-block w-full bg-nature-400 text-white font-display text-lg py-3.5 rounded-button shadow-lg hover:bg-nature-500 hover:shadow-xl transition-all no-underline"
            >
              Download Coloring Page
            </a>
          ) : (
            <p className="text-surface-400 italic">Reward file coming soon!</p>
          )}

          <Link
            to="/hunt"
            className="block text-primary-600 hover:underline text-sm font-bold no-underline"
          >
            ← View your collection
          </Link>
        </div>
      </div>
    </div>
  );
}
