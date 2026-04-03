import { useState } from 'react';
import { useHuntStore } from '../stores/huntStore.js';
import { usePlayerStore } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';
import { genId } from '../lib/ids.js';
import { loadSeedData } from '../lib/seed.js';
import { loadBendSeedData } from '../lib/seed-bend.js';

export default function AdminPage() {
  const hunts = useHuntStore((s) => s.hunts);
  const addHunt = useHuntStore((s) => s.addHunt);
  const removeHunt = useHuntStore((s) => s.removeHunt);
  const publishHunt = useHuntStore((s) => s.publishHunt);
  const addStop = useHuntStore((s) => s.addStop);
  const addToast = useUiStore((s) => s.addToast);

  const [showNewHunt, setShowNewHunt] = useState(false);
  const [huntName, setHuntName] = useState('');
  const [huntCity, setHuntCity] = useState('');
  const [huntEmoji, setHuntEmoji] = useState('🎨');

  const [addingStopTo, setAddingStopTo] = useState(null);
  const [stopName, setStopName] = useState('');
  const [stopHint, setStopHint] = useState('');

  function handleCreateHunt(e) {
    e.preventDefault();
    if (!huntName.trim() || !huntCity.trim()) return;
    const slug = huntName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addHunt({
      id: genId('HNT'),
      name: huntName.trim(),
      city: huntCity.trim(),
      slug,
      emoji: huntEmoji || '🎨',
      description: '',
      status: 'draft',
      rewardUrl: null,
      stops: [],
      createdAt: new Date().toISOString(),
    });
    addToast({ type: 'success', message: `Hunt "${huntName.trim()}" created!` });
    setHuntName('');
    setHuntCity('');
    setHuntEmoji('🎨');
    setShowNewHunt(false);
  }

  function handleAddStop(huntId) {
    if (!stopName.trim()) return;
    addStop(huntId, {
      id: genId('STP'),
      name: stopName.trim(),
      hint: stopHint.trim(),
      photoUrl: null,
      artist: '',
      description: '',
    });
    addToast({ type: 'success', message: `Stop "${stopName.trim()}" added!` });
    setStopName('');
    setStopHint('');
    setAddingStopTo(null);
  }

  function handlePublish(huntId) {
    publishHunt(huntId);
    addToast({ type: 'success', message: 'Hunt published!' });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl text-primary-600">Admin</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              loadSeedData(true);
              loadBendSeedData(true);
              addToast({ type: 'success', message: 'Demo data refreshed!' });
            }}
            className="bg-secondary-400 text-surface-900 font-bold px-4 py-2 rounded-button shadow-sm hover:bg-secondary-500 transition-colors text-sm"
          >
            Refresh Demo
          </button>
          <button
            onClick={() => setShowNewHunt(true)}
            className="bg-primary-500 text-white font-bold px-5 py-2 rounded-button shadow-sm hover:bg-primary-600 transition-colors text-sm"
          >
            + New Hunt
          </button>
        </div>
      </div>

      {/* New hunt form */}
      {showNewHunt && (
        <form onSubmit={handleCreateHunt} className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-6 space-y-4">
          <h2 className="font-display text-xl text-surface-800">Create Hunt</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-bold text-surface-700 mb-1">Hunt Name</label>
              <input
                value={huntName}
                onChange={(e) => setHuntName(e.target.value)}
                placeholder="Portland Art Walk"
                required
                className="w-full px-3 py-2 rounded-button border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-surface-700 mb-1">City</label>
              <input
                value={huntCity}
                onChange={(e) => setHuntCity(e.target.value)}
                placeholder="Portland, OR"
                required
                className="w-full px-3 py-2 rounded-button border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-surface-700 mb-1">Emoji</label>
              <input
                value={huntEmoji}
                onChange={(e) => setHuntEmoji(e.target.value)}
                className="w-full px-3 py-2 rounded-button border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary-500 text-white font-bold px-5 py-2 rounded-button hover:bg-primary-600 transition-colors">
              Create
            </button>
            <button type="button" onClick={() => setShowNewHunt(false)} className="text-surface-500 hover:text-surface-700 font-bold px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Hunt list */}
      {hunts.length === 0 ? (
        <div className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-surface-500 text-lg font-semibold">No hunts created yet.</p>
          <p className="text-surface-400 text-sm mt-1">Click "+ New Hunt" to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {hunts.map((hunt) => (
            <div key={hunt.id} className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{hunt.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg text-surface-800">{hunt.name}</h3>
                    <p className="text-surface-500 text-sm">{hunt.city} — {hunt.stops?.length || 0} stops</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-badge ${
                    hunt.status === 'published'
                      ? 'bg-nature-100 text-nature-700'
                      : 'bg-cream-300 text-surface-600'
                  }`}>
                    {hunt.status}
                  </span>
                  {hunt.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(hunt.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-bold px-2 py-1 transition-colors"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => removeHunt(hunt.id)}
                    className="text-surface-400 hover:text-danger text-sm px-2 py-1 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Stops */}
              <div className="space-y-2 mb-4">
                {hunt.stops?.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-3 bg-cream-200 rounded-lg px-4 py-2">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-surface-700 text-sm font-semibold">{stop.name}</span>
                    {stop.hint && <span className="text-surface-400 text-xs">— {stop.hint}</span>}
                  </div>
                ))}
              </div>

              {/* Add stop */}
              {addingStopTo === hunt.id ? (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input
                      value={stopName}
                      onChange={(e) => setStopName(e.target.value)}
                      placeholder="Stop name"
                      className="w-full px-3 py-2 rounded-button border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={stopHint}
                      onChange={(e) => setStopHint(e.target.value)}
                      placeholder="Hint (optional)"
                      className="w-full px-3 py-2 rounded-button border border-cream-400 bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleAddStop(hunt.id)}
                    className="bg-nature-400 text-white font-bold px-4 py-2 rounded-button text-sm hover:bg-nature-500 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setAddingStopTo(null)}
                    className="text-surface-400 hover:text-surface-600 text-sm px-2 py-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingStopTo(hunt.id)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-bold"
                >
                  + Add Stop
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Photo Moments Feed */}
      <PhotoFeed hunts={hunts} />
    </div>
  );
}

function PhotoFeed({ hunts }) {
  const collections = usePlayerStore((s) => s.collections);

  // Gather all photos across all hunts
  const photos = [];
  for (const [huntId, items] of Object.entries(collections)) {
    const hunt = hunts.find((h) => h.id === huntId);
    if (!hunt) continue;
    for (const item of items) {
      if (!item.playerPhotoUrl) continue;
      const stop = hunt.stops?.find((s) => s.id === item.stopId);
      photos.push({
        key: `${huntId}-${item.stopId}`,
        huntName: hunt.name,
        stopName: item.stopName,
        prompt: stop?.prompt || '',
        photoUrl: item.playerPhotoUrl,
        collectedAt: item.collectedAt,
        uploadedAt: item.photoUploadedAt,
      });
    }
  }

  photos.sort((a, b) => (b.uploadedAt || b.collectedAt).localeCompare(a.uploadedAt || a.collectedAt));

  return (
    <section className="bg-cream-50 rounded-card shadow-sm border border-cream-400 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-surface-800">Player Photo Moments</h2>
        <span className="text-xs font-bold text-surface-500">{photos.length} photos</span>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-surface-400 font-semibold">No photos yet.</p>
          <p className="text-surface-400 text-sm">Players will share their photo moments here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.key} className="relative group rounded-lg overflow-hidden bg-cream-200">
              <img
                src={photo.photoUrl}
                alt={`Photo at ${photo.stopName}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                <p className="text-white text-xs font-bold text-center">{photo.stopName}</p>
                {photo.prompt && (
                  <p className="text-white/70 text-[10px] text-center mt-1 italic">"{photo.prompt}"</p>
                )}
                <p className="text-white/50 text-[10px] mt-1">{photo.huntName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
