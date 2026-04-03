/**
 * CharacterCard — Collectible animal character card with mystery/revealed states.
 *
 * Mystery state: silhouette with species name, fun facts, riddle clue
 * Revealed state: full character art with name, backstory, mike_note
 * Flip variant: CSS 3D card flip animation for scan confirmation
 *
 * Props:
 *   stop         — stop object with character fields
 *   isCollected  — boolean
 *   isFlipping   — boolean (triggers flip animation)
 *   size         — 'sm' | 'md' | 'lg' (default 'md')
 *   onClick      — () => void
 *   playerPhoto  — optional player photo URL for the stamp
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

function getEmoji(species) {
  return ANIMAL_EMOJI[species] || '❓';
}

export default function CharacterCard({
  stop,
  isCollected,
  isFlipping = false,
  size = 'md',
  onClick,
  playerPhoto,
}) {
  const emoji = getEmoji(stop.character_species);
  const isBonus = stop.isBonus;

  const sizeClasses = {
    sm: 'w-full',
    md: 'w-full',
    lg: 'w-full max-w-sm mx-auto',
  };

  // Stamp/thumbnail mode (sm)
  if (size === 'sm') {
    return (
      <button
        onClick={onClick}
        className={`aspect-[3/4] rounded-xl overflow-hidden transition-all ${
          isCollected
            ? 'border-2 border-nature-400 shadow-md'
            : 'border-2 border-cream-400 opacity-60 mystery-shimmer'
        } ${sizeClasses.sm}`}
      >
        {isCollected ? (
          playerPhoto ? (
            <img src={playerPhoto} alt={stop.character_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-nature-100 to-primary-100 flex flex-col items-center justify-center p-1">
              <span className="text-2xl">{emoji}</span>
              <span className="text-[9px] font-bold text-surface-700 mt-1 leading-tight text-center px-0.5">
                {stop.character_name}
              </span>
            </div>
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-200 to-cream-300 flex flex-col items-center justify-center p-1">
            <span className="text-2xl grayscale opacity-40">❓</span>
            <span className="text-[9px] font-bold text-surface-400 mt-1 leading-tight text-center">
              #{stop.sortOrder}
            </span>
          </div>
        )}
      </button>
    );
  }

  // Flip animation mode (used in ScanPage reveal)
  if (isFlipping) {
    return (
      <div className={`card-flip ${sizeClasses[size]}`} style={{ minHeight: '320px' }}>
        <div className={`card-flip-inner ${isCollected ? 'flipped' : ''}`} style={{ minHeight: '320px' }}>
          {/* Front — Mystery */}
          <div className="card-front">
            <MysteryCard stop={stop} emoji={emoji} isBonus={isBonus} />
          </div>
          {/* Back — Revealed */}
          <div className="card-back">
            <RevealedCard stop={stop} emoji={emoji} isBonus={isBonus} />
          </div>
        </div>
      </div>
    );
  }

  // Standard card (md/lg)
  return (
    <button onClick={onClick} className={`text-left ${sizeClasses[size]}`}>
      {isCollected ? (
        <RevealedCard stop={stop} emoji={emoji} isBonus={isBonus} compact={size === 'md'} />
      ) : (
        <MysteryCard stop={stop} emoji={emoji} isBonus={isBonus} compact={size === 'md'} />
      )}
    </button>
  );
}

function MysteryCard({ stop, emoji, isBonus, compact }) {
  return (
    <div className={`rounded-card border-2 overflow-hidden transition-all ${
      isBonus ? 'border-secondary-400 bg-secondary-50' : 'border-cream-400 bg-cream-50'
    } mystery-shimmer`}>
      {/* Mystery header */}
      <div className={`bg-gradient-to-br from-surface-200 via-cream-300 to-surface-200 flex items-center justify-center ${
        compact ? 'h-24' : 'h-36'
      }`}>
        <div className="text-center">
          <span className={`grayscale opacity-30 ${compact ? 'text-4xl' : 'text-6xl'}`}>❓</span>
          {!compact && (
            <p className="text-surface-400 text-xs font-bold mt-2 uppercase tracking-wider">Mystery Animal</p>
          )}
        </div>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        {/* Species visible as clue */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{emoji}</span>
          <h3 className={`font-display text-surface-700 ${compact ? 'text-sm' : 'text-base'}`}>
            {stop.character_species || 'Unknown Species'}
          </h3>
          {isBonus && (
            <span className="bg-secondary-200 text-secondary-700 text-[10px] font-bold px-2 py-0.5 rounded-badge">
              BONUS
            </span>
          )}
        </div>

        {/* Fun facts as clues */}
        {stop.animal_fun_fact_1 && (
          <p className="text-surface-500 text-xs mb-1">
            <span className="text-primary-500 font-bold">Fun fact:</span> {stop.animal_fun_fact_1}
          </p>
        )}
        {!compact && stop.animal_fun_fact_2 && (
          <p className="text-surface-500 text-xs mb-2">
            <span className="text-primary-500 font-bold">Did you know?</span> {stop.animal_fun_fact_2}
          </p>
        )}

        {/* Riddle clue */}
        {stop.riddle_clue && (
          <div className={`bg-primary-50 border border-primary-200 rounded-lg ${compact ? 'p-2 mt-2' : 'p-3 mt-3'}`}>
            <p className="text-primary-700 text-xs italic leading-relaxed">
              "{stop.riddle_clue}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RevealedCard({ stop, emoji, isBonus, compact }) {
  return (
    <div className={`rounded-card border-2 overflow-hidden transition-all ${
      isBonus ? 'border-secondary-400 bg-white shadow-lg' : 'border-nature-400 bg-white shadow-lg'
    }`}>
      {/* Character art header */}
      <div className={`bg-gradient-to-br flex items-center justify-center ${
        isBonus
          ? 'from-secondary-200 via-secondary-100 to-accent-200'
          : 'from-nature-200 via-primary-100 to-secondary-100'
      } ${compact ? 'h-24' : 'h-36'}`}>
        <span className={compact ? 'text-5xl' : 'text-7xl'}>{emoji}</span>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        {/* Character name + species */}
        <div className="mb-2">
          <h3 className={`font-display text-surface-800 ${compact ? 'text-base' : 'text-lg'}`}>
            {stop.character_name}
          </h3>
          <p className="text-surface-500 text-xs font-semibold">{stop.character_species}</p>
          {stop.sponsor_business && (
            <p className="text-surface-400 text-[10px] mt-0.5">
              Found at {stop.sponsor_business}
            </p>
          )}
        </div>

        {/* Fun facts */}
        {stop.animal_fun_fact_1 && (
          <p className="text-surface-600 text-xs mb-1">
            <span className="text-nature-600 font-bold">Fun fact:</span> {stop.animal_fun_fact_1}
          </p>
        )}
        {!compact && stop.animal_fun_fact_2 && (
          <p className="text-surface-600 text-xs mb-2">
            <span className="text-nature-600 font-bold">Did you know?</span> {stop.animal_fun_fact_2}
          </p>
        )}

        {/* Backstory */}
        {!compact && stop.character_backstory && (
          <div className="bg-cream-100 rounded-lg p-3 mt-3">
            <p className="text-surface-700 text-xs leading-relaxed">{stop.character_backstory}</p>
          </div>
        )}

        {/* Mike's note */}
        {!compact && stop.mike_note && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-2">
            <p className="text-primary-700 text-xs italic leading-relaxed">
              — Mike: "{stop.mike_note}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { MysteryCard, RevealedCard };
