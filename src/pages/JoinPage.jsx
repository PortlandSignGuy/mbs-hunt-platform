import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isRemote } from '../lib/supabase.js';
import { usePlayerStore } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';
import { setSession } from '../lib/session.js';

export default function JoinPage() {
  const navigate = useNavigate();
  const registerLocal = usePlayerStore((s) => s.register);
  const addToast = useUiStore((s) => s.addToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) return;

    setLoading(true);
    setError('');

    try {
      let playerId = null;

      if (isRemote && supabase) {
        // Upsert into Supabase — if email exists, update name + opt-in
        const { data, error: dbError } = await supabase
          .from('players')
          .upsert(
            {
              name: trimmedName,
              email: trimmedEmail,
              marketing_opt_in: marketingOptIn,
            },
            { onConflict: 'email' }
          )
          .select('id, name, email, marketing_opt_in, registered_at')
          .single();

        if (dbError) throw dbError;
        playerId = data.id;
      }

      // Save to local Zustand store (works in both modes)
      registerLocal({
        name: trimmedName,
        email: trimmedEmail,
        marketingOptIn,
      });

      // Write session token
      setSession({
        playerId,
        name: trimmedName,
        email: trimmedEmail,
        registeredAt: new Date().toISOString(),
      });

      addToast({ type: 'success', message: `Welcome, ${trimmedName}! You're ready to hunt.` });
      navigate('/hunt');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Decorative top gradient */}
        <div className="h-2 rounded-t-card bg-gradient-to-r from-joy-400 via-secondary-400 to-nature-400" />

        <div className="bg-white rounded-b-card shadow-xl border border-cream-300 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="https://cdn.shopify.com/s/files/1/0718/2313/0914/files/MBS_STACKED-COLOR-LOGO_WHITE-OUTLINE.png?v=1759188855"
              alt="Mike Bennett Studios"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="font-display text-3xl text-primary-600 mb-2">
              Join the Hunt!
            </h1>
            <p className="text-surface-500 leading-relaxed">
              Discover PNW animal characters, collect cards, and unlock an exclusive coloring page reward!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="join-name"
                className="block text-sm font-bold text-surface-700 mb-1.5"
              >
                Your Name
              </label>
              <input
                id="join-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                required
                autoComplete="name"
                className="w-full px-4 py-3 rounded-button border-2 border-cream-300 bg-cream-50 focus:border-primary-400 focus:ring-3 focus:ring-primary-100 outline-none transition-all text-surface-800 placeholder:text-surface-400"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="join-email"
                className="block text-sm font-bold text-surface-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="join-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-button border-2 border-cream-300 bg-cream-50 focus:border-primary-400 focus:ring-3 focus:ring-primary-100 outline-none transition-all text-surface-800 placeholder:text-surface-400"
              />
              <p className="text-xs text-surface-400 mt-1.5">
                Used to save your progress across devices.
              </p>
            </div>

            {/* Marketing opt-in */}
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-cream-400 text-primary-500 focus:ring-primary-300 accent-primary-500 cursor-pointer"
              />
              <span className="text-sm text-surface-600 leading-snug group-hover:text-surface-800 transition-colors">
                Keep me in the loop! Send me updates about new hunts, events,
                and art from Mike Bennett Studios.
              </span>
            </label>

            {/* Error message */}
            {error && (
              <div className="bg-joy-50 border border-joy-200 text-joy-700 rounded-button px-4 py-2.5 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-display text-lg py-3.5 rounded-button shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                "Let's Go!"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-surface-400 mt-6 leading-relaxed">
            By joining, you agree to let us save your name and email to track your
            hunt progress. We never share your info.
          </p>
        </div>
      </div>
    </div>
  );
}
