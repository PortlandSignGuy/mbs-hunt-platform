import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { usePlayerStore, useCollected } from '../stores/playerStore.js';
import { useHuntStore } from '../stores/huntStore.js';
import { useUiStore } from '../stores/uiStore.js';
import DigitalPassport from '../components/hunt/DigitalPassport.jsx';
import CharacterDetailModal from '../components/hunt/CharacterDetailModal.jsx';

export default function PassportPage() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collected = useCollected(activeHuntId);
  const collectedIds = new Set(collected.map((c) => c.stopId));
  const [detailStop, setDetailStop] = useState(null);

  if (!hunt) return <Navigate to="/" replace />;

  const stops = hunt.stops || [];

  function handleStopTap(stop) {
    const isFound = collectedIds.has(stop.id);
    if (isFound) {
      setDetailStop(stop);
    } else {
      navigate(`/scan/${stop.slug || stop.id}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary-600">Passport</h1>
        <Link to="/hunt" className="text-primary-600 text-sm font-bold no-underline hover:underline">
          ← Characters
        </Link>
      </div>

      <DigitalPassport
        hunt={hunt}
        stops={stops}
        collected={collected}
        playerName={player?.name}
        onStopTap={handleStopTap}
      />

      {detailStop && (
        <CharacterDetailModal
          stop={detailStop}
          isCollected={collectedIds.has(detailStop.id)}
          onClose={() => setDetailStop(null)}
        />
      )}
    </div>
  );
}
