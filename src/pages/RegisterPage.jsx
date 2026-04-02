import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore.js';
import { useUiStore } from '../stores/uiStore.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerPlayer = usePlayerStore((s) => s.register);
  const addToast = useUiStore((s) => s.addToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    registerPlayer({ name: name.trim(), email: email.trim() });
    addToast({ type: 'success', message: `Welcome, ${name.trim()}! You're ready to hunt.` });
    navigate('/home');
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-card shadow-lg border border-surface-200 p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="font-display text-3xl font-bold text-surface-800 mb-2">
            Join the Hunt
          </h1>
          <p className="text-surface-500">
            Register to start collecting public art photos and unlock rewards!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-surface-700 mb-1.5">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2.5 rounded-button border border-surface-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-surface-800 placeholder:text-surface-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-surface-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-button border border-surface-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-surface-800 placeholder:text-surface-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-display font-bold text-lg py-3 rounded-button shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            Let's Go!
          </button>
        </form>
      </div>
    </div>
  );
}
