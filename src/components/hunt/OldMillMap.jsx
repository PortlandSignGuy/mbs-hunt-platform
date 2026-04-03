/**
 * OldMillMap — Illustrated SVG map of the Old Mill District, Bend OR.
 *
 * Based on the aerial site plan: Deschutes River running SW→NE along the south edge,
 * REI on the west, Regal on the north-east, hotels at NE and SE corners,
 * retail corridor through the center.
 *
 * Each stop has mapX/mapY (0-100) coords. Collected stops show as colored stamps,
 * uncollected stops show as numbered gray pins.
 */

const MAP_ASPECT = 1.25; // width:height ratio based on the district layout

export default function OldMillMap({ stops, collectedIds, onStopTap }) {
  const collected = new Set(collectedIds);

  return (
    <div className="w-full overflow-hidden rounded-card border-2 border-cream-400 shadow-md">
      <svg
        viewBox="0 0 500 400"
        className="w-full h-auto"
        style={{ background: '#faf8eb' }}
        role="img"
        aria-label="Illustrated map of Old Mill District showing scavenger hunt stop locations"
      >
        {/* ── Background fill ── */}
        <rect width="500" height="400" fill="#faf8eb" />

        {/* ── Parking areas (light gray) ── */}
        <rect x="10" y="5" width="120" height="60" rx="6" fill="#e7e5e4" opacity="0.5" />
        <rect x="300" y="2" width="190" height="55" rx="6" fill="#e7e5e4" opacity="0.5" />
        <rect x="5" y="250" width="80" height="60" rx="6" fill="#e7e5e4" opacity="0.5" />

        {/* ── Deschutes River (curves SW to NE along the bottom) ── */}
        <path
          d="M 0,340 Q 80,310 150,320 Q 220,330 280,310 Q 340,290 400,300 Q 450,305 500,280"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="28"
          opacity="0.4"
        />
        <path
          d="M 0,340 Q 80,310 150,320 Q 220,330 280,310 Q 340,290 400,300 Q 450,305 500,280"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="4"
          strokeDasharray="8 4"
          opacity="0.6"
        />
        {/* River label */}
        <text x="130" y="345" fontSize="9" fill="#3b82f6" fontWeight="600" opacity="0.7">
          Deschutes River
        </text>

        {/* ── Walking path / trail ── */}
        <path
          d="M 50,280 Q 100,260 180,270 Q 260,280 340,260 Q 400,250 460,255"
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="3"
          strokeDasharray="6 3"
        />

        {/* ── Buildings / zones ── */}
        {/* REI - west side */}
        <rect x="55" y="140" width="65" height="45" rx="5" fill="#bbf7d0" stroke="#4EB25C" strokeWidth="1.5" />
        <text x="88" y="167" fontSize="11" fill="#166534" fontWeight="700" textAnchor="middle">REI</text>

        {/* Regal Cinemas - northeast */}
        <rect x="370" y="35" width="85" height="40" rx="5" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
        <text x="412" y="60" fontSize="10" fill="#92400e" fontWeight="700" textAnchor="middle">Regal</text>

        {/* Hilton Garden Inn - north center */}
        <rect x="220" y="45" width="70" height="35" rx="5" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="1.5" />
        <text x="255" y="64" fontSize="8" fill="#581c87" fontWeight="600" textAnchor="middle">Garden Inn</text>

        {/* Hampton Inn - southeast */}
        <rect x="330" y="340" width="70" height="30" rx="5" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="1.5" />
        <text x="365" y="359" fontSize="8" fill="#581c87" fontWeight="600" textAnchor="middle">Hampton</text>

        {/* Central retail corridor - series of small buildings */}
        <rect x="205" y="110" width="120" height="30" rx="4" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
        <rect x="195" y="150" width="130" height="30" rx="4" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
        <rect x="185" y="190" width="140" height="30" rx="4" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
        <text x="265" y="130" fontSize="8" fill="#9f1239" fontWeight="600" textAnchor="middle">Shops</text>
        <text x="260" y="170" fontSize="8" fill="#9f1239" fontWeight="600" textAnchor="middle">Retail Corridor</text>
        <text x="255" y="210" fontSize="8" fill="#9f1239" fontWeight="600" textAnchor="middle">Shops</text>

        {/* Old Mill Smokestack */}
        <rect x="218" y="225" width="10" height="30" rx="2" fill="#a8a29e" />
        <circle cx="223" cy="222" r="6" fill="#a8a29e" opacity="0.5" />
        <text x="240" y="242" fontSize="7" fill="#57534e" fontWeight="600">Smokestack</text>

        {/* Woodstone Bridge */}
        <rect x="220" y="295" width="60" height="8" rx="2" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />
        <text x="250" y="290" fontSize="7" fill="#57534e" fontWeight="600" textAnchor="middle">Bridge</text>

        {/* World Market - east */}
        <rect x="340" y="150" width="60" height="30" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
        <text x="370" y="169" fontSize="7" fill="#92400e" fontWeight="600" textAnchor="middle">World Market</text>

        {/* Old Navy - west */}
        <rect x="75" y="200" width="60" height="30" rx="4" fill="#cffafe" stroke="#0891b2" strokeWidth="1" />
        <text x="105" y="219" fontSize="8" fill="#155e75" fontWeight="600" textAnchor="middle">Old Navy</text>

        {/* ── Title ── */}
        <text x="250" y="390" fontSize="11" fill="#6454cb" fontWeight="700" textAnchor="middle" fontFamily="'Lilita One', sans-serif">
          Old Mill District — Bend, OR
        </text>

        {/* ── Stop markers ── */}
        {stops.filter((s) => s.is_active !== false && s.mapX > 0).map((stop, i) => {
          const cx = (stop.mapX / 100) * 500;
          const cy = (stop.mapY / 100) * 400;
          const isCollected = collected.has(stop.id);
          const isBonus = stop.isBonus;
          const num = stop.sortOrder || (i + 1);

          return (
            <g
              key={stop.id}
              onClick={() => onStopTap?.(stop)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStopTap?.(stop); } }}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${isCollected ? stop.character_name || stop.name : stop.character_species || 'Mystery'}${isCollected ? ' — collected' : ' — not yet found'}`}
            >
              {/* Glow ring for collected */}
              {isCollected && (
                <circle cx={cx} cy={cy} r="16" fill={isBonus ? '#fbbf24' : '#4EB25C'} opacity="0.2">
                  <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Pin — collected shows colored, uncollected shows faint dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isCollected ? 12 : 5}
                fill={isCollected ? (isBonus ? '#fbbf24' : '#4EB25C') : '#d6d3d1'}
                stroke={isCollected ? (isBonus ? '#d97706' : '#15803d') : 'transparent'}
                strokeWidth={isCollected ? 2 : 0}
                opacity={isCollected ? 1 : 0.4}
              />

              {/* Label — only for collected */}
              {isCollected && (
                <text
                  x={cx}
                  y={cy + 4}
                  fontSize="10"
                  fontWeight="700"
                  fill="#fff"
                  textAnchor="middle"
                >
                  {isBonus ? '★' : '✓'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
