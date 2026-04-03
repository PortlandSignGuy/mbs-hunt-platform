import { Navigate, Link, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore.js';
import { useHuntStore } from '../stores/huntStore.js';
import { useUiStore } from '../stores/uiStore.js';
import DigitalPassport from '../components/hunt/DigitalPassport.jsx';

export default function PassportPage() {
  const navigate = useNavigate();
  const player = usePlayerStore((s) => s.player);
  const activeHuntId = usePlayerStore((s) => s.activeHuntId);
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.id === activeHuntId));
  const collected = usePlayerStore((s) => s.getCollected(activeHuntId));
  const addToast = useUiStore((s) => s.addToast);

  if (!hunt) return <Navigate to="/" replace />;

  const stops = hunt.stops || [];

  function handleStopTap(stop) {
    const isFound = collected.some((c) => c.stopId === stop.id);
    if (isFound) {
      addToast({ type: 'info', message: `${stop.name} — already collected!` });
    } else {
      navigate(`/scan/${stop.slug || stop.id}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary-600">Passport</h1>
        <Link to="/hunt" className="text-primary-600 text-sm font-bold no-underline hover:underline">
          ← Stops List
        </Link>
      </div>

      <DigitalPassport
        hunt={hunt}
        stops={stops}
        collected={collected}
        playerName={player?.name}
        onStopTap={handleStopTap}
      />
    </div>
  );
}
