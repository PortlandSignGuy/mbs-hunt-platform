import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../../stores/playerStore.js';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const location = useLocation();
  const player = usePlayerStore((s) => s.player);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-cream-100/90 backdrop-blur-sm border-b border-cream-400 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🎨</span>
          <span className="font-display font-bold text-xl text-primary-600">
            MBS Hunts
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-bold text-sm px-3 py-1.5 rounded-button transition-colors no-underline ${
                location.pathname === link.to
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-surface-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {player ? (
            <span className="inline-flex items-center gap-1.5 bg-nature-100 text-nature-700 font-bold text-sm px-3 py-1.5 rounded-badge">
              <span className="w-2 h-2 bg-nature-400 rounded-full" />
              {player.name}
            </span>
          ) : (
            <Link
              to="/join"
              className="bg-primary-500 text-white font-bold text-sm px-4 py-2 rounded-button shadow-sm hover:bg-primary-600 transition-all no-underline"
            >
              Join a Hunt!
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-button text-surface-600 hover:bg-cream-200 transition-colors"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-cream-300 bg-cream-50 px-4 py-3 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block font-bold text-base px-4 py-3 rounded-button transition-colors no-underline ${
                location.pathname === link.to
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-surface-600 hover:bg-cream-200'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {player ? (
            <div className="flex items-center gap-2 px-4 py-3 text-nature-700 font-bold">
              <span className="w-2 h-2 bg-nature-400 rounded-full" />
              {player.name}
            </div>
          ) : (
            <Link
              to="/join"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-primary-500 text-white font-bold py-3 rounded-button shadow-sm no-underline"
            >
              Join a Hunt!
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
