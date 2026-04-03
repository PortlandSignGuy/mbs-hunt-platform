import { useRef, useCallback } from 'react';
import OldMillMap from './OldMillMap.jsx';

/**
 * DigitalPassport — The full passport view with illustrated map + stamp grid.
 * Shows a map with collected/uncollected pins, a stamp collection grid below,
 * and a share button when complete.
 */
export default function DigitalPassport({
  hunt,
  stops,
  collected,
  playerName,
  onStopTap,
}) {
  const passportRef = useRef(null);
  const collectedIds = new Set(collected.map((c) => c.stopId));
  const totalStops = stops.filter((s) => !s.isBonus).length;
  const collectedCount = [...collectedIds].filter(
    (id) => stops.find((s) => s.id === id && !s.isBonus)
  ).length;
  const allCollected = totalStops > 0 && collectedCount >= totalStops;
  const bonusStop = stops.find((s) => s.isBonus);
  const bonusCollected = bonusStop ? collectedIds.has(bonusStop.id) : false;

  const handleShare = useCallback(async () => {
    // Render the SVG map to a canvas for sharing
    const svgEl = passportRef.current?.querySelector('svg');
    if (!svgEl) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.fillStyle = '#faf8eb';
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const file = new File([blob], 'mbs-passport.png', { type: 'image/png' });
          if (navigator.share && navigator.canShare?.({ files: [file] })) {
            navigator.share({
              title: `${hunt.name} — Digital Passport`,
              text: `I completed the ${hunt.name} scavenger hunt! 🎨`,
              files: [file],
            });
          } else {
            const dlUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = dlUrl;
            a.download = 'mbs-passport.png';
            a.click();
            URL.revokeObjectURL(dlUrl);
          }
        }, 'image/png');
      };

      img.src = url;
    } catch {
      // Fallback: simple text share
      if (navigator.share) {
        navigator.share({
          title: `${hunt.name} — Digital Passport`,
          text: `I collected ${collectedCount}/${totalStops} stops in the ${hunt.name} scavenger hunt! 🎨`,
        });
      }
    }
  }, [hunt.name, collectedCount, totalStops]);

  return (
    <div className="space-y-5">
      {/* Passport card */}
      <div ref={passportRef} className="bg-cream-50 rounded-card border-2 border-primary-300 shadow-lg overflow-hidden">
        {/* Passport header */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 px-5 py-4 text-center">
          <p className="text-primary-200 text-xs font-bold uppercase tracking-widest mb-1">
            Digital Passport
          </p>
          <h2 className="font-display text-2xl text-white">{hunt.name}</h2>
          <p className="text-primary-200 text-sm font-semibold mt-1">{hunt.city}</p>
          {playerName && (
            <p className="text-white/80 text-xs mt-2">
              Adventurer: <span className="font-bold text-white">{playerName}</span>
            </p>
          )}
        </div>

        {/* Map */}
        <div className="p-3">
          <OldMillMap
            stops={stops}
            collectedIds={[...collectedIds]}
            onStopTap={onStopTap}
          />
        </div>

        {/* Stamp collection grid */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-surface-700">Stamp Collection</h3>
            <span className="text-xs font-bold text-primary-600">
              {collectedCount}/{totalStops}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {stops.filter((s) => !s.isBonus).map((stop, i) => {
              const isFound = collectedIds.has(stop.id);
              return (
                <button
                  key={stop.id}
                  onClick={() => onStopTap?.(stop)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                    isFound
                      ? 'bg-nature-100 border-2 border-nature-400 shadow-sm'
                      : 'bg-cream-200 border-2 border-cream-400 opacity-50'
                  }`}
                >
                  <span className={`text-lg ${isFound ? '' : 'grayscale opacity-40'}`}>
                    {isFound ? '🎨' : '❓'}
                  </span>
                  <span className={`text-[8px] font-bold mt-0.5 leading-tight px-0.5 ${
                    isFound ? 'text-nature-700' : 'text-surface-400'
                  }`}>
                    {isFound ? stop.name.split(' ').slice(0, 2).join(' ') : `#${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bonus stop */}
          {bonusStop && (
            <div className="mt-3">
              <button
                onClick={() => onStopTap?.(bonusStop)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all ${
                  bonusCollected
                    ? 'bg-secondary-100 border-2 border-secondary-400'
                    : 'bg-cream-200 border-2 border-dashed border-cream-400 opacity-60'
                }`}
              >
                <span className="text-2xl">{bonusCollected ? '⭐' : '🔒'}</span>
                <div className="text-left flex-1">
                  <p className={`text-sm font-bold ${bonusCollected ? 'text-secondary-700' : 'text-surface-400'}`}>
                    {bonusCollected ? bonusStop.name : 'Bonus Stop'}
                  </p>
                  <p className="text-xs text-surface-400">
                    {bonusCollected ? 'Bonus unlocked!' : 'Find the pop-up shop for a surprise!'}
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Completion banner */}
        {allCollected && (
          <div className="bg-gradient-to-r from-secondary-300 via-primary-300 to-nature-300 px-5 py-3 text-center">
            <p className="font-display text-white text-lg drop-shadow-sm">
              Hunt Complete!
            </p>
          </div>
        )}
      </div>

      {/* Share button */}
      {allCollected && (
        <button
          onClick={handleShare}
          className="w-full bg-primary-500 text-white font-display text-lg py-3.5 rounded-button shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          Share Your Passport
        </button>
      )}
    </div>
  );
}
