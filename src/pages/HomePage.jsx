import { Link } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function HomePage() {
  const hunts = useHuntStore((s) => s.hunts);
  const player = usePlayerStore((s) => s.player);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-14">
        <div className="text-6xl mb-4 animate-float">🎨</div>
        <h1 className="font-display text-5xl text-primary-600 mb-4">
          Mike Bennett Scavenger Hunts
        </h1>
        <p className="text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed">
          Discover public art in your city! Scan QR codes, collect all 15 photos,
          and unlock an exclusive coloring page reward.
        </p>
        {!player && (
          <Link
            to="/register"
            className="inline-block mt-8 bg-primary-500 text-white font-display text-xl px-10 py-4 rounded-button shadow-lg hover:bg-primary-600 hover:shadow-xl hover:scale-105 transition-all no-underline"
          >
            Start Your Adventure!
          </Link>
        )}
      </section>

      {/* Available hunts */}
      <section>
        <h2 className="font-display text-2xl text-surface-800 mb-6">
          Available Hunts
        </h2>
        {hunts.length === 0 ? (
          <div className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-12 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-surface-500 text-lg font-semibold">No hunts available yet.</p>
            <p className="text-surface-400 text-sm mt-1">Check back soon for new adventures!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hunts.filter((h) => h.status === 'published').map((hunt) => (
              <Link
                key={hunt.id}
                to={`/hunt/${hunt.slug}`}
                className="group bg-cream-50 rounded-card shadow-sm border border-cream-400 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all no-underline"
              >
                <div className="h-40 bg-gradient-to-br from-primary-200 via-secondary-200 to-nature-200 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {hunt.emoji || '🎨'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-surface-800 mb-1">
                    {hunt.name}
                  </h3>
                  <p className="text-surface-500 text-sm mb-3">{hunt.city}</p>
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-bold">
                    <span>{hunt.stops?.length || 0} stops</span>
                    <span className="text-surface-300">|</span>
                    <span>Coloring page reward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
