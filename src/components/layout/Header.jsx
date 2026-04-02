import { Link, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../../stores/playerStore.js';

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const location = useLocation();
  const player = usePlayerStore((s) => s.player);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 no-underline">
          <span className="text-3xl">🎨</span>
          <span className="font-display font-bold text-xl bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            MBS Hunts
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium text-sm px-3 py-1.5 rounded-button transition-colors no-underline ${
                location.pathname === link.to
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-surface-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {player ? (
            <span className="inline-flex items-center gap-1.5 bg-nature-100 text-nature-700 font-medium text-sm px-3 py-1.5 rounded-badge">
              <span className="w-2 h-2 bg-nature-500 rounded-full" />
              {player.name}
            </span>
          ) : (
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm px-4 py-2 rounded-button shadow-sm hover:shadow-md transition-all no-underline"
            >
              Join a Hunt
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
