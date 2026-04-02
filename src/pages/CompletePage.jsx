import { Link, Navigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore.js';
import { getSession } from '../lib/session.js';

export default function CompletePage() {
  const player = usePlayerStore((s) => s.player);
  const session = getSession();

  if (!player) return <Navigate to="/join" replace />;

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-cream-50 rounded-card shadow-lg border border-cream-400 overflow-hidden">
        {/* Celebration header */}
        <div className="bg-gradient-to-r from-secondary-300 via-primary-300 to-nature-300 p-8 text-center">
          <div className="text-6xl mb-3 animate-float">🎉</div>
          <h1 className="font-display text-3xl text-white drop-shadow-md">
            Congratulations, {player.name}!
          </h1>
          <p className="text-white/90 mt-2 font-bold">
            You completed the hunt!
          </p>
        </div>

        {/* Reward content */}
        <div className="p-8 text-center space-y-6">
          <div>
            <h2 className="font-display text-xl text-surface-800 mb-2">
              Your Coloring Page Reward
            </h2>
            <p className="text-surface-500">
              Download your exclusive coloring page featuring the public art from this hunt.
            </p>
          </div>

          {/* Coloring page preview placeholder */}
          <div className="bg-white border-2 border-dashed border-cream-400 rounded-card p-8">
            <div className="text-5xl mb-3 animate-float">🎨</div>
            <p className="text-surface-400 text-sm font-semibold">Coloring page preview</p>
          </div>

          <p className="text-surface-400 italic">Reward file coming soon!</p>

          <Link
            to="/hunt"
            className="block text-primary-600 hover:underline text-sm font-bold no-underline"
          >
            View your collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
