import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore, useCollected } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';
import CharacterCard from '../components/hunt/CharacterCard.jsx';
import PhotoMomentCapture from '../components/hunt/PhotoMomentCapture.jsx';

export default function ScanPage() {
  const { slug } = useParams();
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collectStop = usePlayerStore((s) => s.collectStop);
  const setActiveHunt = usePlayerStore((s) => s.setActiveHunt);
  const hunts = useHuntStore((s) => s.hunts);
  const collected = useCollected(activeHuntId);
  const addToast = useUiStore((s) => s.addToast);
  const addPhoto = usePlayerStore((s) => s.addPhoto);

  const [phase, setPhase] = useState('ready'); // ready | fadeout | revealed
  const [photoSaved, setPhotoSaved] = useState(false);

  if (!player) return <Navigate to="/join" replace />;

  // Find the stop
  let stop = null;
  let parentHunt = hunt;

  if (hunt) {
    stop = hunt.stops?.find((s) => s.id === slug || s.slug === slug);
  }
  if (!stop) {
    for (const h of hunts) {
      const found = h.stops?.find((s) => s.id === slug || s.slug === slug);
      if (found) {
        stop = found;
        parentHunt = h;
        if (activeHuntId !== h.id) setActiveHunt(h.id);
        break;
      }
    }
  }

  if (!stop || !parentHunt) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-5xl mb-4">❓</div>
        <h1 className="font-display text-2xl text-surface-800 mb-2">Character not found</h1>
        <p className="text-surface-500 text-sm mb-4">This QR code doesn't match any active hunt.</p>
        <Link to="/" className="text-primary-600 hover:underline font-bold">Back to Home</Link>
      </div>
    );
  }

  const collections = usePlayerStore.getState().collections;
  const huntCollected = collections[parentHunt.id] || [];
  const alreadyCollected = huntCollected.some((c) => c.stopId === stop.id);
  const baseStops = (parentHunt.stops || []).filter((s) => !s.isBonus && s.is_active !== false);
  const totalStops = baseStops.length;
  const currentCount = huntCollected.filter(
    (c) => baseStops.some((s) => s.id === c.stopId)
  ).length;
  const newCount = currentCount + (alreadyCollected || phase !== 'ready' ? 0 : 1);
  const allDone = newCount >= totalStops;

  function handleCollect() {
    collectStop(parentHunt.id, {
      stopId: stop.id,
      stopName: stop.character_name || stop.name,
      photoUrl: stop.photoUrl || null,
      collectedAt: new Date().toISOString(),
    });

    // Animate: mystery fades out → revealed card scales in
    setPhase('fadeout');
    setTimeout(() => setPhase('revealed'), 350);

    if (allDone) {
      addToast({ type: 'success', message: 'You found them all!' });
    } else {
      addToast({ type: 'success', message: `${stop.character_name || stop.character_species} found!` });
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* ── Already collected ── */}
      {alreadyCollected && phase === 'ready' ? (
        <div className="space-y-4">
          <CharacterCard stop={stop} isCollected={true} size="lg" />
          <div className="bg-nature-50 border border-nature-300 rounded-card p-4 text-center">
            <p className="text-nature-700 font-bold">Already in your collection!</p>
          </div>
          <Link
            to="/hunt"
            className="block text-center text-primary-600 hover:underline font-bold no-underline"
          >
            ← View All Characters
          </Link>
        </div>
      ) : phase === 'ready' ? (
        /* ── Ready to collect — show mystery card ── */
        <div className="space-y-4">
          <CharacterCard stop={stop} isCollected={false} size="lg" />

          <button
            onClick={handleCollect}
            className="w-full bg-primary-500 text-white font-display text-lg py-4 rounded-button shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            Reveal This Character!
          </button>

          <p className="text-center text-surface-500 text-xs font-bold">
            {currentCount} of {totalStops} discovered so far
          </p>

          <Link
            to="/hunt"
            className="block text-center text-primary-600 hover:underline text-sm font-bold no-underline"
          >
            ← View All Characters
          </Link>
        </div>
      ) : phase === 'fadeout' ? (
        /* ── Fade out mystery card ── */
        <div className="animate-card-fadeout">
          <CharacterCard stop={stop} isCollected={false} size="lg" />
        </div>
      ) : (
        /* ── Revealed! ── */
        <div className="space-y-4">
          <div className="animate-card-reveal">
            <CharacterCard stop={stop} isCollected={true} size="lg" />
          </div>

          {/* Progress */}
          <div className="bg-nature-100 border-2 border-nature-400 rounded-card p-4 text-center">
            <p className="text-nature-700 font-display text-lg">Character Found!</p>
            <p className="text-nature-600 text-sm mt-1">{newCount} of {totalStops} discovered</p>
            <div className="h-2.5 bg-nature-200 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-nature-400 rounded-full transition-all duration-700"
                style={{ width: `${(newCount / totalStops) * 100}%` }}
              />
            </div>
          </div>

          {/* Photo moment */}
          {stop.prompt && !photoSaved && (
            <PhotoMomentCapture
              prompt={stop.prompt}
              onSave={(dataUrl) => {
                addPhoto(parentHunt.id, stop.id, dataUrl);
                setPhotoSaved(true);
                addToast({ type: 'success', message: 'Photo saved!' });
              }}
              onSkip={() => setPhotoSaved(true)}
            />
          )}

          {/* Next step */}
          {(photoSaved || !stop.prompt) && (
            allDone ? (
              <Link
                to="/complete"
                className="block w-full text-center bg-secondary-400 text-surface-900 font-display text-lg py-3.5 rounded-button shadow-md hover:bg-secondary-500 transition-all no-underline"
              >
                Claim Your Reward!
              </Link>
            ) : (
              <Link
                to="/hunt"
                className="block w-full text-center bg-primary-500 text-white font-display text-lg py-3.5 rounded-button shadow-md hover:bg-primary-600 transition-all no-underline"
              >
                Keep Hunting! ({totalStops - newCount} left)
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
