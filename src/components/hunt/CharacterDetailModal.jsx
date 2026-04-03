import { useEffect } from 'react';
import { RevealedCard, MysteryCard } from './CharacterCard.jsx';

/**
 * CharacterDetailModal — Full-screen card detail view.
 * Opens when tapping a collected card in the passport or hunt page.
 * Shows full art, name, species, backstory, mike_note, fun facts.
 */

const ANIMAL_EMOJI = {
  'Black Bear': '🐻',
  'Northern Flying Squirrel': '🐿️',
  'North American Porcupine': '🦔',
  'Chinook Salmon': '🐟',
  'Gray Wolf': '🐺',
  'Bald Eagle': '🦅',
  'Western Rattlesnake': '🐍',
  'Mallard Duck': '🦆',
  'Great Blue Heron': '🦩',
  'North American River Otter': '🦦',
  'Yellow-bellied Marmot (Rock Chuck)': '🦫',
  'Mountain Lion (Cougar)': '🐱',
  'Mule Deer': '🦌',
  'Great Horned Owl': '🦉',
  'Roosevelt Elk': '🫎',
  'Human (Public Joy Creator)': '🎨',
};

export default function CharacterDetailModal({ stop, isCollected, onClose }) {
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const emoji = ANIMAL_EMOJI[stop.character_species] || '❓';

  return (
    <div
      className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-cream-50 w-full sm:max-w-md sm:rounded-card rounded-t-[1.5rem] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-surface-300 rounded-full" />
        </div>

        {/* Close button */}
        <div className="flex justify-end px-4 pt-2 sm:pt-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center text-surface-500 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Character art area */}
        <div className={`mx-4 flex items-center justify-center rounded-xl h-48 ${
          isCollected
            ? stop.isBonus
              ? 'bg-gradient-to-br from-secondary-200 via-secondary-100 to-accent-200'
              : 'bg-gradient-to-br from-nature-200 via-primary-100 to-secondary-100'
            : 'bg-gradient-to-br from-surface-200 via-cream-300 to-surface-200'
        }`}>
          {isCollected ? (
            <span className="text-8xl">{emoji}</span>
          ) : (
            <div className="text-center">
              <span className="text-7xl grayscale opacity-30">❓</span>
              <p className="text-surface-400 text-sm font-bold mt-2">Not yet discovered</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isCollected ? (
            <>
              {/* Name + species */}
              <div>
                <h2 className="font-display text-2xl text-surface-800">
                  {stop.character_name}
                </h2>
                <p className="text-surface-500 font-semibold text-sm">{stop.character_species}</p>
                {stop.sponsor_business && (
                  <p className="text-surface-400 text-xs mt-1">
                    Found at <span className="font-semibold">{stop.sponsor_business}</span>
                    {stop.install_type && ` · ${stop.install_type}`}
                  </p>
                )}
                {stop.isBonus && (
                  <span className="inline-block mt-2 bg-secondary-200 text-secondary-700 text-xs font-bold px-3 py-1 rounded-badge">
                    BONUS CHARACTER
                  </span>
                )}
              </div>

              {/* Fun facts */}
              <div className="space-y-2">
                <h3 className="font-display text-sm text-surface-700">Fun Facts</h3>
                {stop.animal_fun_fact_1 && (
                  <div className="flex gap-2 items-start">
                    <span className="text-nature-500 mt-0.5">•</span>
                    <p className="text-surface-600 text-sm">{stop.animal_fun_fact_1}</p>
                  </div>
                )}
                {stop.animal_fun_fact_2 && (
                  <div className="flex gap-2 items-start">
                    <span className="text-nature-500 mt-0.5">•</span>
                    <p className="text-surface-600 text-sm">{stop.animal_fun_fact_2}</p>
                  </div>
                )}
              </div>

              {/* Backstory */}
              {stop.character_backstory && (
                <div className="bg-cream-200 rounded-xl p-4">
                  <h3 className="font-display text-sm text-surface-700 mb-2">Backstory</h3>
                  <p className="text-surface-600 text-sm leading-relaxed">{stop.character_backstory}</p>
                </div>
              )}

              {/* Mike's note */}
              {stop.mike_note && (
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <h3 className="font-display text-sm text-primary-700 mb-2">From Mike</h3>
                  <p className="text-primary-600 text-sm italic leading-relaxed">
                    "{stop.mike_note}"
                  </p>
                </div>
              )}

              {/* Riddle (show after collected as a fun callback) */}
              {stop.riddle_clue && (
                <div className="text-center pt-2">
                  <p className="text-surface-400 text-xs italic">
                    Riddle: "{stop.riddle_clue}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Mystery state — show species + facts + riddle */}
              <div>
                <h2 className="font-display text-xl text-surface-700 flex items-center gap-2">
                  <span>{emoji}</span>
                  {stop.character_species || 'Mystery Animal'}
                </h2>
                {stop.isBonus && (
                  <span className="inline-block mt-2 bg-secondary-200 text-secondary-700 text-xs font-bold px-3 py-1 rounded-badge">
                    BONUS
                  </span>
                )}
              </div>

              {stop.animal_fun_fact_1 && (
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-primary-700 text-sm">
                    <span className="font-bold">Fun fact:</span> {stop.animal_fun_fact_1}
                  </p>
                </div>
              )}
              {stop.animal_fun_fact_2 && (
                <div className="bg-secondary-50 rounded-xl p-4">
                  <p className="text-secondary-700 text-sm">
                    <span className="font-bold">Did you know?</span> {stop.animal_fun_fact_2}
                  </p>
                </div>
              )}

              {stop.riddle_clue && (
                <div className="bg-cream-200 rounded-xl p-4 text-center">
                  <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mb-2">Riddle Clue</p>
                  <p className="text-surface-700 text-base italic leading-relaxed font-display">
                    "{stop.riddle_clue}"
                  </p>
                </div>
              )}

              <p className="text-center text-surface-400 text-sm">
                Find and scan this character to reveal their full story!
              </p>
            </>
          )}
        </div>

        {/* Bottom padding for mobile safe area */}
        <div className="h-6" />
      </div>
    </div>
  );
}
