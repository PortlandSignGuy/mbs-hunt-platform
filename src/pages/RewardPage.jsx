import { useParams, Link, Navigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function RewardPage() {
  const { huntSlug } = useParams();
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.slug === huntSlug));
  const player = usePlayerStore((s) => s.player);
  const collected = usePlayerStore((s) => s.getCollected(huntSlug));

  if (!player) return <Navigate to="/register" replace />;
  if (!hunt) return <Navigate to="/home" replace />;

  const totalStops = hunt.stops?.length || 0;
  const allCollected = totalStops > 0 && collected.length >= totalStops;

  if (!allCollected) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <div className="bg-white rounded-card shadow-lg border border-surface-200 p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-display text-2xl font-bold text-surface-800 mb-2">
            Not Yet!
          </h1>
          <p className="text-surface-500 mb-4">
            Collect all {totalStops} photos to unlock your coloring page reward.
            You have {collected.length} so far!
          </p>
          <Link
            to={`/hunt/${huntSlug}`}
            className="text-primary-600 hover:underline font-medium no-underline"
          >
            ← Continue hunting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-white rounded-card shadow-lg border border-surface-200 overflow-hidden">
        {/* Celebration header */}
        <div className="bg-gradient-to-r from-accent-300 via-secondary-300 to-joy-300 p-8 text-center">
          <div className="text-6xl mb-3 animate-bounce">🎉</div>
          <h1 className="font-display text-3xl font-bold text-white drop-shadow-md">
            Congratulations, {player.name}!
          </h1>
          <p className="text-white/90 mt-2 font-medium">
            You collected all {totalStops} photos in {hunt.name}!
          </p>
        </div>

        {/* Reward content */}
        <div className="p-8 text-center space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-surface-800 mb-2">
              Your Coloring Page Reward
            </h2>
            <p className="text-surface-500">
              Download your exclusive coloring page featuring the public art from this hunt.
            </p>
          </div>

          {/* Coloring page preview placeholder */}
          <div className="bg-surface-50 border-2 border-dashed border-surface-300 rounded-card p-8">
            <div className="text-5xl mb-3">🎨</div>
            <p className="text-surface-400 text-sm">Coloring page preview</p>
          </div>

          {hunt.rewardUrl ? (
            <a
              href={hunt.rewardUrl}
              download
              className="inline-block bg-gradient-to-r from-nature-500 to-nature-600 text-white font-display font-bold text-lg px-8 py-3 rounded-button shadow-lg hover:shadow-xl transition-all no-underline"
            >
              Download Coloring Page
            </a>
          ) : (
            <p className="text-surface-400 italic">Reward file coming soon!</p>
          )}

          <Link
            to={`/hunt/${huntSlug}/collection`}
            className="block text-primary-600 hover:underline text-sm font-medium no-underline"
          >
            View your collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
