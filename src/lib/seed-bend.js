/**
 * MBS Hunt Platform — Bend Old Mill District Scavenger Hunt
 *
 * 15 QR code stops at shops throughout the Old Mill District + 1 bonus pop-up.
 * Map coordinates are relative positions (0-100) for the illustrated SVG map,
 * based on the Old Mill District layout along the Deschutes River.
 *
 * The district has ~24 retail shops, restaurants, and attractions.
 * 15 stops are selected to create a walking route through the full district.
 * The 16th bonus stop is Mike's Pop-Up Shop.
 */
import { useHuntStore } from '../stores/huntStore.js';

const BEND_HUNT = {
  id: 'HNT-bend-oldmill',
  name: 'Bend Old Mill Art Walk',
  city: 'Bend, OR',
  slug: 'bend-old-mill',
  emoji: '🏔️',
  description:
    'Discover art hiding in plain sight across the Old Mill District! Visit 15 shops along the Deschutes River, scan QR codes, collect photos, and unlock your exclusive coloring page. Plus — find the bonus pop-up shop for a special surprise!',
  status: 'published',
  rewardUrl: null,
  createdAt: '2026-04-01T00:00:00.000Z',
  stops: [
    // ── North cluster (near Regal / Garden Inn) ──
    {
      id: 'STP-BEND-01',
      slug: 'regal-cinemas',
      name: 'Regal Old Mill',
      hint: 'Where the movies play — look near the entrance',
      artist: '',
      description: 'A QR code hidden near the marquee of the Regal Old Mill cinema.',
      photoUrl: null,
      sortOrder: 1,
      mapX: 82, mapY: 12,
      prompt: 'Strike your best movie star pose!',
    },
    {
      id: 'STP-BEND-02',
      slug: 'hilton-garden-inn',
      name: 'Hilton Garden Inn',
      hint: 'The hotel with the garden — check the lobby entrance',
      artist: '',
      description: 'Art meets hospitality at the Garden Inn entrance.',
      photoUrl: null,
      sortOrder: 2,
      mapX: 52, mapY: 16,
      prompt: 'Show us your "just checked in" vacation face!',
    },
    {
      id: 'STP-BEND-03',
      slug: 'cold-stone',
      name: 'Cold Stone Creamery',
      hint: 'Sweet treats and a hidden code — look before you lick',
      artist: '',
      description: 'Cool art near cool treats.',
      photoUrl: null,
      sortOrder: 3,
      mapX: 62, mapY: 22,
      prompt: 'What flavor would you be? Show us with a face!',
    },
    // ── Central retail corridor ──
    {
      id: 'STP-BEND-04',
      slug: 'victorias-secret',
      name: 'Victoria\'s Secret',
      hint: 'The secret is on the outside wall',
      artist: '',
      description: 'A QR code hiding in plain sight on the storefront.',
      photoUrl: null,
      sortOrder: 4,
      mapX: 55, mapY: 32,
      prompt: 'Reveal your hidden artistic side!',
    },
    {
      id: 'STP-BEND-05',
      slug: 'gap',
      name: 'Gap',
      hint: 'Mind the gap — and the art beside it',
      artist: '',
      description: 'Street-level art near a classic retail favorite.',
      photoUrl: null,
      sortOrder: 5,
      mapX: 50, mapY: 36,
      prompt: 'Jump across an imaginary gap!',
    },
    {
      id: 'STP-BEND-06',
      slug: 'bath-body-works',
      name: 'Bath & Body Works',
      hint: 'It smells great AND looks great outside',
      artist: '',
      description: 'Fragrance and art — a multisensory experience.',
      photoUrl: null,
      sortOrder: 6,
      mapX: 48, mapY: 40,
      prompt: 'Give us your best "that smells amazing" reaction!',
    },
    {
      id: 'STP-BEND-07',
      slug: 'chicos',
      name: 'Chico\'s',
      hint: 'Fashion forward — art is in the details',
      artist: '',
      description: 'A stylish stop on your art walk.',
      photoUrl: null,
      sortOrder: 7,
      mapX: 45, mapY: 44,
      prompt: 'Strike a runway pose!',
    },
    {
      id: 'STP-BEND-08',
      slug: 'white-house-black-market',
      name: 'White House Black Market',
      hint: 'Contrast and color — look at the entry',
      artist: '',
      description: 'Bold contrasts meet bold art.',
      photoUrl: null,
      sortOrder: 8,
      mapX: 52, mapY: 48,
      prompt: 'Show us your most dramatic black & white moment!',
    },
    // ── West cluster (near REI / river) ──
    {
      id: 'STP-BEND-09',
      slug: 'rei',
      name: 'REI',
      hint: 'Gear up and look up — the code is near the adventure',
      artist: '',
      description: 'Outdoor adventure starts with a little indoor art discovery.',
      photoUrl: null,
      sortOrder: 9,
      mapX: 18, mapY: 40,
      prompt: 'Show us your adventure face!',
    },
    {
      id: 'STP-BEND-10',
      slug: 'old-navy',
      name: 'Old Navy',
      hint: 'Anchors aweigh — scan near the front flags',
      artist: '',
      description: 'Nautical vibes and hidden codes.',
      photoUrl: null,
      sortOrder: 10,
      mapX: 25, mapY: 50,
      prompt: 'Salute like a sailor!',
    },
    // ── South cluster (river trail / Woodstone Bridge) ──
    {
      id: 'STP-BEND-11',
      slug: 'river-overlook',
      name: 'Deschutes River Overlook',
      hint: 'Where the trail meets the rapids — look at the railing',
      artist: '',
      description: 'A scenic overlook with art where the Deschutes rushes past.',
      photoUrl: null,
      sortOrder: 11,
      mapX: 38, mapY: 75,
      prompt: 'Pretend you\'re a salmon jumping upstream!',
    },
    {
      id: 'STP-BEND-12',
      slug: 'footbridge',
      name: 'Woodstone Bridge',
      hint: 'Cross the water and find art in the middle',
      artist: '',
      description: 'A pedestrian bridge crossing the Deschutes — art at the halfway point.',
      photoUrl: null,
      sortOrder: 12,
      mapX: 48, mapY: 85,
      prompt: 'Photo from the middle of the bridge — look both ways!',
    },
    {
      id: 'STP-BEND-13',
      slug: 'hampton-inn',
      name: 'Hampton Inn',
      hint: 'The riverside hotel — check the garden path',
      artist: '',
      description: 'Art tucked along the walking path near the Hampton.',
      photoUrl: null,
      sortOrder: 13,
      mapX: 72, mapY: 90,
      prompt: 'Show us the view from the garden path!',
    },
    // ── East cluster ──
    {
      id: 'STP-BEND-14',
      slug: 'smokestack',
      name: 'Old Mill Smokestack',
      hint: 'The tallest thing here — a relic of the lumber days',
      artist: 'Historic',
      description: 'The iconic smokestack from the original Brooks-Scanlon lumber mill. A Bend landmark.',
      photoUrl: null,
      sortOrder: 14,
      mapX: 45, mapY: 55,
      prompt: 'Look up at the smokestack and give us your best "wow" face!',
    },
    {
      id: 'STP-BEND-15',
      slug: 'world-market',
      name: 'World Market',
      hint: 'Treasures from around the world — and one QR code',
      artist: '',
      description: 'Global finds and local art collide.',
      photoUrl: null,
      sortOrder: 15,
      mapX: 65, mapY: 45,
      prompt: 'Find something from another country and pose with it!',
    },
    // ── Bonus 16th stop: Pop-Up Merch Shop ──
    {
      id: 'STP-BEND-16',
      slug: 'popup-shop',
      name: 'Mike\'s Pop-Up Shop',
      hint: 'The final surprise — stickers, pins, and your coloring page!',
      artist: 'Mike Bennett',
      description: 'Mike Bennett\'s pop-up merch shop in the Old Mill District. Claim your reward in person!',
      photoUrl: null,
      sortOrder: 16,
      mapX: 58, mapY: 62,
      isBonus: true,
      prompt: 'Selfie with Mike (or his art)! Show us your haul!',
    },
  ],
};

export function loadBendSeedData() {
  const store = useHuntStore.getState();
  if (store.hunts.some((h) => h.id === BEND_HUNT.id)) return false;
  store.addHunt(BEND_HUNT);
  return true;
}

export function clearBendSeedData() {
  useHuntStore.getState().removeHunt(BEND_HUNT.id);
}

export const BEND_HUNT_ID = BEND_HUNT.id;
