import { useParams, Link, Navigate } from 'react-router-dom';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';

export default function CollectionPage() {
  const { huntSlug } = useParams();
  const hunt = useHuntStore((s) => s.hunts.find((h) => h.slug === huntSlug));
  const player = usePlayerStore((s) => s.player);
  const collected = usePlayerStore((s) => s.getCollected(huntSlug));

  if (!player) return <Navigate to="/register" replace />;
  if (!hunt) return <Navigate to="/home" replace />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-surface-800">Your Collection</h1>
          <p className="text-surface-500 mt-1">{hunt.name} — {collected.length} photos collected</p>
        </div>
        <Link
          to={`/hunt/${huntSlug}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm no-underline"
        >
          ← Back to Hunt
        </Link>
      </div>

      {collected.length === 0 ? (
        <div className="bg-white rounded-card shadow-sm border border-surface-200 p-12 text-center">
          <div className="text-5xl mb-4">📸</div>
          <p className="text-surface-500 text-lg">No photos collected yet.</p>
          <p className="text-surface-400 text-sm mt-1">
            Find a QR code at a public art installation and scan it to start!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collected.map((item) => (
            <div
              key={item.stopId}
              className="bg-white rounded-card shadow-sm border border-surface-200 overflow-hidden"
            >
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.stopName} className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 bg-gradient-to-br from-joy-100 to-primary-100 flex items-center justify-center">
                  <span className="text-5xl">📸</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-display font-bold text-surface-800">{item.stopName}</h3>
                <p className="text-surface-400 text-xs mt-1">
                  Collected {new Date(item.collectedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
