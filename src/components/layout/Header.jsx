import { Link, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../../stores/playerStore.js';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  const location = useLocation();
  const player = usePlayerStore((s) => s.player);

  return (
    <header className="bg-cream-100/90 backdrop-blur-sm border-b border-cream-400 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-3xl">🎨</span>
          <span className="font-display font-bold text-2xl text-primary-600 tracking-wide">
            MBS Hunts
          </span>
        </Link>

        <nav className="flex items-center gap-3">
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
              className="bg-primary-500 text-white font-bold text-sm px-5 py-2 rounded-button shadow-sm hover:bg-primary-600 hover:shadow-md transition-all no-underline"
            >
              Join a Hunt!
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
