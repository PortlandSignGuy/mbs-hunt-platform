/**
 * MBS Hunt Platform — Demo Seed Data
 *
 * Loads a sample "Portland Art Walk" hunt with 15 stops.
 * Call loadSeedData() from Admin or Settings to populate the store.
 */
import { useHuntStore } from '../stores/huntStore.js';

const DEMO_HUNT = {
  id: 'HNT-portland-demo',
  name: 'Portland Art Walk',
  city: 'Portland, OR',
  slug: 'portland-art-walk',
  emoji: '🌲',
  description:
    'Explore 15 public art installations across Portland! From murals to sculptures, discover the creativity that makes this city magical.',
  status: 'published',
  rewardUrl: null,
  createdAt: '2026-03-15T00:00:00.000Z',
  stops: [
    {
      id: 'STP-001',
      slug: 'portlandia',
      name: 'Portlandia Statue',
      hint: 'She crouches above the entrance to a famous building downtown',
      artist: 'Raymond Kaskey',
      description: 'Second-largest copper repoussé statue in the US, greeting visitors to the Portland Building.',
      photoUrl: null,
      sortOrder: 1,
      prompt: 'Mimic her pose — crouch down and reach!',
    },
    {
      id: 'STP-002',
      slug: 'allow-me',
      name: 'Allow Me (Umbrella Man)',
      hint: 'Look for a man offering shelter near Pioneer Square',
      artist: 'J. Seward Johnson Jr.',
      description: 'A life-sized bronze gentleman extending an umbrella — a perfect Portland icon.',
      photoUrl: null,
      sortOrder: 2,
      prompt: 'Pretend he\'s sharing his umbrella with you!',
    },
    {
      id: 'STP-003',
      slug: 'deer-dancer',
      name: 'Deer Dancer',
      hint: 'Dancing near the river in Tom McCall Waterfront Park',
      artist: 'Tom Hardy',
      description: 'A bronze deer figure mid-dance, celebrating the wildlife of the Pacific Northwest.',
      photoUrl: null,
      sortOrder: 3,
      prompt: 'Do your best deer dance!',
    },
    {
      id: 'STP-004',
      slug: 'salmon-springs',
      name: 'Salmon Street Springs',
      hint: 'A fountain that changes its pattern — catch it at Waterfront Park',
      artist: 'Robert Woodward',
      description: 'An interactive fountain with three computer-controlled water displays.',
      photoUrl: null,
      sortOrder: 4,
      prompt: 'Get splashed! (or pretend to)',
    },
    {
      id: 'STP-005',
      slug: 'fremont-mural',
      name: 'Fremont Street Mural',
      hint: 'A colorful wall near Mike\'s Studio on NE Fremont',
      artist: 'Mike Bennett',
      description: 'A vibrant mural celebrating community joy and public art.',
      photoUrl: null,
      sortOrder: 5,
      prompt: 'Become part of the mural — match a color!',
    },
    {
      id: 'STP-006',
      slug: 'keep-portland-weird',
      name: 'Keep Portland Weird Sign',
      hint: 'A famous motto glows above a bookstore on W Burnside',
      artist: 'Community',
      description: 'The iconic neon sign that became a rallying cry for Portland\'s creative spirit.',
      photoUrl: null,
      sortOrder: 6,
      prompt: 'Show us YOUR weird — make the weirdest face you can!',
    },
    {
      id: 'STP-007',
      slug: 'animals-in-pools',
      name: 'Animals in Pools',
      hint: 'Bronze creatures having a swim in the Pearl District',
      artist: 'Georgia Gerber',
      description: 'Playful bronze animals splashing in a public fountain.',
      photoUrl: null,
      sortOrder: 7,
      prompt: 'Splash around with the bronze animals!',
    },
    {
      id: 'STP-008',
      slug: 'peace-chant',
      name: 'Peace Chant',
      hint: 'A towering column near the Oregon Convention Center',
      artist: 'Blessing Hancock',
      description: 'A monumental sculpture celebrating peace and diverse voices.',
      photoUrl: null,
      sortOrder: 8,
      prompt: 'Strike a peaceful pose next to the column!',
    },
    {
      id: 'STP-009',
      slug: 'giant-yarn-ball',
      name: 'Giant Yarn Ball',
      hint: 'Something cozy rolled up in the Alberta Arts District',
      artist: 'Various',
      description: 'A community-created art installation celebrating craft and connection.',
      photoUrl: null,
      sortOrder: 9,
      prompt: 'Pretend you\'re tangled in yarn!',
    },
    {
      id: 'STP-010',
      slug: 'mill-ends-park',
      name: 'Mill Ends Park',
      hint: 'The world\'s smallest park hides in a median strip downtown',
      artist: 'Dick Fagan',
      description: 'At just 452 square inches, it\'s a Guinness World Record holder.',
      photoUrl: null,
      sortOrder: 10,
      prompt: 'Can you fit in the world\'s smallest park?',
    },
    {
      id: 'STP-011',
      slug: 'horse-rings',
      name: 'Horse Rings of Portland',
      hint: 'Tiny horses tied to iron rings embedded in the sidewalk',
      artist: 'Scott Wayne Indiana',
      description: 'Miniature toy horses attached to historic horse rings across the city.',
      photoUrl: null,
      sortOrder: 11,
      prompt: 'Find a tiny horse and take a selfie with it!',
    },
    {
      id: 'STP-012',
      slug: 'se-belmont-mural',
      name: 'SE Belmont Mural Wall',
      hint: 'A massive colorful wall on SE Belmont near 30th',
      artist: 'Various',
      description: 'A rotating gallery of street art from Portland\'s vibrant mural scene.',
      photoUrl: null,
      sortOrder: 12,
      prompt: 'Stand in front of your favorite section of the mural!',
    },
    {
      id: 'STP-013',
      slug: 'witch-castle',
      name: 'Witch\'s Castle',
      hint: 'A mysterious stone ruin hiding in Forest Park',
      artist: 'WPA / Nature',
      description: 'The moss-covered remains of a 1930s stone restroom, now a beloved urban legend.',
      photoUrl: null,
      sortOrder: 13,
      prompt: 'Your spookiest witch pose!',
    },
    {
      id: 'STP-014',
      slug: 'cathedral-park-arches',
      name: 'Cathedral Park Arches',
      hint: 'Gothic arches rise beneath the St. Johns Bridge',
      artist: 'Engineering & Nature',
      description: 'The dramatic gothic arches of the St. Johns Bridge create a cathedral-like space in the park below.',
      photoUrl: null,
      sortOrder: 14,
      prompt: 'Frame yourself inside one of the gothic arches!',
    },
    {
      id: 'STP-015',
      slug: 'wonderwood',
      name: 'Wonderwood Mini Golf',
      hint: 'A whimsical world of mini golf created by a certain Public Joy Creator',
      artist: 'Mike Bennett',
      description: 'Mike Bennett\'s imaginative mini golf experience — the final stop on your art adventure!',
      photoUrl: null,
      sortOrder: 15,
      prompt: 'Your best mini golf victory celebration!',
    },
  ],
};

/**
 * Load the demo hunt into the store. Skips if already loaded.
 */
export function loadSeedData() {
  const store = useHuntStore.getState();
  if (store.hunts.some((h) => h.id === DEMO_HUNT.id)) return false;
  store.addHunt(DEMO_HUNT);
  return true;
}

/**
 * Remove seed data from the store.
 */
export function clearSeedData() {
  useHuntStore.getState().removeHunt(DEMO_HUNT.id);
}
