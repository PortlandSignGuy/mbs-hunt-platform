# MBS Hunt Platform — Feature Roadmap

## Core (Built)
- Player registration (name + email)
- Multi-hunt architecture (city-based, slug routing)
- QR code scan → collect photos (15 per hunt)
- Coloring page reward unlock at 15/15
- Admin: create hunts, add stops, publish

## Planned Features

### 1. Digital Passport & Illustrated Map
- Static illustrated map per hunt showing all photo locations (image-based, no GPS)
- Each collected photo "stamps" that spot on the map (overlay/reveal)
- Passport is shareable as a downloadable/social image on completion
- Map artwork provided per hunt (Supabase storage)

### 2. Photo Moment Submission
- At each scan station, player takes or uploads a photo responding to a fun prompt
- Prompt is per-stop (configured in admin)
- Photos stored in Supabase Storage, linked to player + stop
- Admin feed: view all player photo submissions per hunt
- Privacy: photos visible to admin only (not public unless opted in)

### 3. Group Hunt Mode
- Leader creates a group session with a 4-digit join code
- Other players join the session and contribute scans to a shared collection
- Group progress bar on hunt page
- All members unlock reward when group reaches 15/15
- Session expires after hunt completion or 24h timeout

### 4. Artist Audio Story
- Short MP3 clip per stop (uploaded in admin)
- Plays automatically on scan confirmation screen
- Play/pause controls, artist name attribution
- Audio files stored in Supabase Storage
- Graceful fallback if no audio attached to stop

### 5. Social Follow Hint Unlock
- Honor-system button on hunt page: "Follow Mike on Instagram to unlock a hint!"
- Links to Mike's Instagram profile
- Player confirms they followed → unlocks a location hint for one undiscovered stop
- One hint unlock per hunt per player
- No API verification needed — trust-based

### 6. Bonus 16th Stop (Pop-Up Merch Shop)
- Special bonus location per hunt — Mike's pop-up merch shop
- Not required for the base 15/15 reward
- Scanning the bonus stop unlocks an additional bonus reward (separate from coloring page)
- Bonus reward: could be a digital sticker, discount code, or exclusive coloring page variant
- Flagged as `isBonus: true` on the stop model

### 7. Multi-Hunt Explorer Achievement
- Track completed hunts per player across all cities/regions
- Completing 4 hunts in a region unlocks a unique sticker redemption code
- Redemption code is for the physical pop-up shop (one-time use)
- Achievement badge displayed on player profile/passport
- Admin can configure region groupings and redemption codes
