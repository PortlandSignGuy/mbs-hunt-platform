import { useRef, useCallback } from 'react';
import CharacterCard from './CharacterCard.jsx';
import OldMillMap from './OldMillMap.jsx';

/**
 * DigitalPassport — Card collection view with illustrated map.
 * Shows collected characters as revealed cards, uncollected as mystery silhouettes.
 * Tappable cards open the detail modal (handled by parent via onStopTap).
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
  const activeStops = stops.filter((s) => s.is_active !== false);
  const baseStops = activeStops.filter((s) => !s.isBonus);
  const bonusStops = activeStops.filter((s) => s.isBonus);
  const collectedCount = [...collectedIds].filter(
    (id) => baseStops.find((s) => s.id === id)
  ).length;
  const totalStops = baseStops.length;
  const allCollected = totalStops > 0 && collectedCount >= totalStops;

  const handleShare = useCallback(async () => {
    try {
      const svgEl = passportRef.current?.querySelector('svg');
      if (!svgEl) return;
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
              text: `I found ${collectedCount}/${totalStops} characters in the ${hunt.name}! 🎨`,
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
      if (navigator.share) {
        navigator.share({
          title: `${hunt.name} — Digital Passport`,
          text: `I found ${collectedCount}/${totalStops} characters in the ${hunt.name}! 🎨`,
        });
      }
    }
  }, [hunt.name, collectedCount, totalStops]);

  return (
    <div className="space-y-5">
      {/* Passport card */}
      <div ref={passportRef} className="bg-cream-50 rounded-card border-2 border-primary-300 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 px-5 py-5 text-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0718/2313/0914/files/MBS_STACKED-COLOR-LOGO_WHITE-OUTLINE.png?v=1759188855"
            alt="Mike Bennett Studios"
            className="h-14 mx-auto mb-3"
          />
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
            stops={activeStops}
            collectedIds={[...collectedIds]}
            onStopTap={onStopTap}
          />
        </div>

        {/* Card collection grid */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-surface-700">Card Collection</h3>
            <span className="text-xs font-bold text-primary-600">
              {collectedCount}/{totalStops}
            </span>
          </div>

          {/* Responsive grid: 4 cols on small, 5 on medium, 6 on large */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {baseStops.map((stop) => {
              const isFound = collectedIds.has(stop.id);
              const entry = collected.find((c) => c.stopId === stop.id);
              return (
                <CharacterCard
                  key={stop.id}
                  stop={stop}
                  isCollected={isFound}
                  size="sm"
                  onClick={() => onStopTap?.(stop)}
                  playerPhoto={entry?.playerPhotoUrl}
                />
              );
            })}
          </div>

          {/* Bonus section */}
          {bonusStops.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-secondary-600 uppercase tracking-wider mb-2">Bonus</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {bonusStops.map((stop) => {
                  const isFound = collectedIds.has(stop.id);
                  return (
                    <CharacterCard
                      key={stop.id}
                      stop={stop}
                      isCollected={isFound}
                      size="sm"
                      onClick={() => onStopTap?.(stop)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Completion banner */}
        {allCollected && (
          <div className="bg-gradient-to-r from-secondary-300 via-primary-300 to-nature-300 px-5 py-3 text-center">
            <p className="font-display text-white text-lg drop-shadow-sm">
              All Characters Found!
            </p>
          </div>
        )}
      </div>

      {/* Share button */}
      {collectedCount > 0 && (
        <button
          onClick={handleShare}
          className="w-full bg-primary-500 text-white font-display text-base py-3 rounded-button shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          Share Your Passport
        </button>
      )}
    </div>
  );
}
