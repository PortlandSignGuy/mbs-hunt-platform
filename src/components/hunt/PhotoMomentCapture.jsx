import { useState, useRef } from 'react';

/**
 * PhotoMomentCapture — Camera/upload UI for player photo moments.
 *
 * Shows a fun prompt, lets player take a photo (native camera on mobile)
 * or upload from gallery. Compresses and returns base64 data URL.
 *
 * Props:
 *   prompt    — string, the fun challenge text (e.g. "Strike a pose!")
 *   onSave    — (dataUrl: string) => void
 *   onSkip    — () => void
 */

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = (h * maxWidth) / w;
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoMomentCapture({ prompt, onSave, onSkip }) {
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressImage(file);
    setPreview(dataUrl);
  }

  function handleRetake() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSave() {
    if (!preview) return;
    setSaving(true);
    onSave(preview);
  }

  return (
    <div className="bg-white rounded-card border-2 border-primary-200 shadow-md overflow-hidden">
      {/* Prompt header */}
      <div className="bg-gradient-to-r from-primary-100 to-joy-100 px-4 py-3 text-center">
        <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">Photo Moment</p>
        <p className="font-display text-lg text-surface-800">{prompt || 'Capture your moment!'}</p>
      </div>

      <div className="p-4">
        {preview ? (
          /* Preview state */
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-cream-400">
              <img src={preview} alt="Your photo moment" className="w-full h-48 object-cover" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRetake}
                className="flex-1 border-2 border-surface-300 text-surface-600 font-bold py-2.5 rounded-button hover:bg-cream-100 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-nature-400 text-white font-bold py-2.5 rounded-button hover:bg-nature-500 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </div>
        ) : (
          /* Capture state */
          <div className="space-y-3">
            <div className="flex gap-2">
              {/* Camera button (mobile-first) */}
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center gap-2 bg-primary-50 border-2 border-dashed border-primary-300 rounded-card py-6 hover:bg-primary-100 transition-colors">
                  <span className="text-3xl">📸</span>
                  <span className="text-sm font-bold text-primary-600">Take Photo</span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {/* Upload from gallery */}
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center gap-2 bg-secondary-50 border-2 border-dashed border-secondary-300 rounded-card py-6 hover:bg-secondary-100 transition-colors">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-sm font-bold text-secondary-600">Upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={onSkip}
              className="w-full text-surface-400 hover:text-surface-600 text-sm font-semibold py-2 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
