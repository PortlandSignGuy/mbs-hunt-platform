/**
 * CharacterCard — Collectible animal character card.
 *
 * Mystery state: species emoji + name, fun fact, riddle clue (all visible)
 * Revealed state: character name, species, backstory, Mike's note
 * Sizes: sm (stamp grid), md (hunt list), lg (scan page)
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
  return ANIMAL_EMOJI[species] || '🐾';
}

export default function CharacterCard({
  stop,
  isCollected,
  size = 'md',
  onClick,
  playerPhoto,
}) {
  const emoji = getEmoji(stop.character_species);
  const isBonus = stop.isBonus;

  // ── Stamp / thumbnail (sm) ──
  if (size === 'sm') {
    return (
      <button
        onClick={onClick}
        className={`aspect-[3/4] rounded-xl overflow-hidden transition-all ${
          isCollected
            ? 'border-2 border-nature-400 shadow-md'
            : 'border-2 border-cream-400 opacity-60'
        }`}
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
            <span className="text-2xl opacity-40">{emoji}</span>
            <span className="text-[9px] font-bold text-surface-400 mt-1 leading-tight text-center">
              #{stop.sortOrder}
            </span>
          </div>
        )}
      </button>
    );
  }

  // ── Standard card (md / lg) ──
  const isLarge = size === 'lg';

  return (
    <button onClick={onClick} className="text-left w-full">
      {isCollected ? (
        <RevealedCard stop={stop} emoji={emoji} isBonus={isBonus} isLarge={isLarge} />
      ) : (
        <MysteryCard stop={stop} emoji={emoji} isBonus={isBonus} isLarge={isLarge} />
      )}
    </button>
  );
}

// ── Mystery Card ──
function MysteryCard({ stop, emoji, isBonus, isLarge }) {
  return (
    <div className={`rounded-card border-2 overflow-hidden ${
      isBonus ? 'border-secondary-300 bg-cream-50' : 'border-cream-400 bg-cream-50'
    }`}>
      {/* Species header with emoji */}
      <div className={`flex items-center gap-3 px-4 ${isLarge ? 'py-4' : 'py-3'} border-b border-cream-300 bg-cream-100`}>
        <span className={isLarge ? 'text-4xl' : 'text-3xl'}>{emoji}</span>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">Mystery Animal</p>
          <h3 className={`font-display text-surface-800 ${isLarge ? 'text-xl' : 'text-base'}`}>
            {stop.character_species || 'Unknown'}
          </h3>
        </div>
        {isBonus && (
          <span className="bg-secondary-200 text-secondary-700 text-[10px] font-bold px-2 py-0.5 rounded-badge shrink-0">
            BONUS
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        {/* Fun fact */}
        {stop.animal_fun_fact_1 && (
          <p className="text-surface-600 text-sm">
            <span className="text-primary-600 font-bold">Fun fact:</span> {stop.animal_fun_fact_1}
          </p>
        )}

        {/* Second fun fact (large only) */}
        {isLarge && stop.animal_fun_fact_2 && (
          <p className="text-surface-600 text-sm">
            <span className="text-primary-600 font-bold">Did you know?</span> {stop.animal_fun_fact_2}
          </p>
        )}

        {/* Riddle clue */}
        {stop.riddle_clue && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-1">
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-1">Riddle Clue</p>
            <p className="text-primary-700 text-sm italic leading-relaxed">
              "{stop.riddle_clue}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Revealed Card ──
function RevealedCard({ stop, emoji, isBonus, isLarge }) {
  return (
    <div className={`rounded-card border-2 overflow-hidden shadow-md ${
      isBonus ? 'border-secondary-400 bg-white' : 'border-nature-400 bg-white'
    }`}>
      {/* Character header */}
      <div className={`flex items-center gap-3 px-4 ${isLarge ? 'py-4' : 'py-3'} ${
        isBonus
          ? 'bg-gradient-to-r from-secondary-100 to-secondary-50 border-b border-secondary-200'
          : 'bg-gradient-to-r from-nature-100 to-primary-50 border-b border-nature-200'
      }`}>
        <span className={isLarge ? 'text-4xl' : 'text-3xl'}>{emoji}</span>
        <div className="flex-1">
          <h3 className={`font-display text-surface-800 ${isLarge ? 'text-xl' : 'text-base'}`}>
            {stop.character_name}
          </h3>
          <p className="text-surface-500 text-xs font-semibold">{stop.character_species}</p>
          {stop.sponsor_business && (
            <p className="text-surface-400 text-[10px] mt-0.5">at {stop.sponsor_business}</p>
          )}
        </div>
        {isBonus && (
          <span className="bg-secondary-200 text-secondary-700 text-[10px] font-bold px-2 py-0.5 rounded-badge shrink-0">
            BONUS
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2">
        {/* Fun facts */}
        {stop.animal_fun_fact_1 && (
          <p className="text-surface-600 text-sm">
            <span className="text-nature-600 font-bold">Fun fact:</span> {stop.animal_fun_fact_1}
          </p>
        )}
        {isLarge && stop.animal_fun_fact_2 && (
          <p className="text-surface-600 text-sm">
            <span className="text-nature-600 font-bold">Did you know?</span> {stop.animal_fun_fact_2}
          </p>
        )}

        {/* Backstory */}
        {stop.character_backstory && (
          <div className="bg-cream-100 rounded-lg p-3">
            <p className="text-surface-700 text-sm leading-relaxed">{stop.character_backstory}</p>
          </div>
        )}

        {/* Mike's note */}
        {isLarge && stop.mike_note && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <p className="text-primary-700 text-sm italic leading-relaxed">
              — Mike: "{stop.mike_note}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { MysteryCard, RevealedCard };
