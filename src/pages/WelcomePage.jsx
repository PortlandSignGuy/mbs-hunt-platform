import { Link, useNavigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function WelcomePage() {
  const navigate = useNavigate();
  const hunts = useHuntStore((s) => s.hunts);
  const player = usePlayerStore((s) => s.player);
  const setActiveHunt = usePlayerStore((s) => s.setActiveHunt);
  const collections = usePlayerStore((s) => s.collections);

  function handlePickHunt(hunt) {
    setActiveHunt(hunt.id);
    navigate('/hunt');
  }

  const published = hunts.filter((h) => h.status === 'published');

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-10">
        <div className="text-6xl mb-4 animate-float">🎨</div>
        <h1 className="font-display text-4xl sm:text-5xl text-primary-600 mb-3">
          Mike Bennett<br />Scavenger Hunts
        </h1>
        <p className="text-lg text-surface-600 max-w-md mx-auto leading-relaxed">
          Discover hidden PNW animal characters! Scan QR codes, collect
          every character card, and unlock an exclusive coloring page reward.
        </p>
        {!player && (
          <Link
            to="/join"
            className="inline-block mt-6 bg-primary-500 text-white font-display text-lg px-8 py-3.5 rounded-button shadow-lg hover:bg-primary-600 hover:shadow-xl active:scale-[0.98] transition-all no-underline"
          >
            Start Your Adventure!
          </Link>
        )}
      </section>

      {/* Available hunts */}
      <section>
        <h2 className="font-display text-xl text-surface-800 mb-4">
          {published.length > 0 ? 'Pick a Hunt' : 'Available Hunts'}
        </h2>
        {published.length === 0 ? (
          <div className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-10 text-center">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-surface-500 font-semibold">No hunts available yet.</p>
            <p className="text-surface-400 text-sm mt-1">Check back soon for new adventures!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {published.map((hunt) => {
              const collected = collections[hunt.id] || [];
              const baseStops = (hunt.stops || []).filter((s) => !s.isBonus && s.is_active !== false);
              const totalStops = baseStops.length;
              const collectedBase = collected.filter(
                (c) => baseStops.some((s) => s.id === c.stopId)
              ).length;
              const pct = totalStops > 0 ? (collectedBase / totalStops) * 100 : 0;
              const complete = totalStops > 0 && collectedBase >= totalStops;

              return (
                <button
                  key={hunt.id}
                  onClick={() => handlePickHunt(hunt)}
                  className="w-full text-left bg-cream-50 rounded-card shadow-sm border border-cream-400 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 via-secondary-200 to-nature-200 flex items-center justify-center shrink-0">
                      <span className="text-3xl">{hunt.emoji || '🎨'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-surface-800">{hunt.name}</h3>
                      <p className="text-surface-500 text-sm">{hunt.city}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              complete
                                ? 'bg-nature-400'
                                : 'bg-gradient-to-r from-primary-400 to-secondary-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-surface-500 shrink-0">
                          {collectedBase}/{totalStops}
                        </span>
                      </div>
                    </div>
                    {complete && (
                      <span className="bg-nature-100 text-nature-700 text-xs font-bold px-2 py-1 rounded-badge shrink-0">
                        Done!
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
