# ElektroMap (Phase 1 MVP)

A simple, static-first web app to help Poznań residents find the nearest e‑waste (electronic waste) drop‑off point.

## Overview
- Scope: Single city (Poznań) with 78 municipal locations
- Data: Pre‑processed JSON served statically
- Stack: React + Vite + Leaflet + Tailwind (no backend)
- Timeline: 2 weeks
- Cost: $0/month (free hosting tiers)

## Features
- Interactive map with markers for collection points
- List view with basic details and “Get Directions” link
- Locate me (browser geolocation) and nearest locations
- Client‑side distance calculation (Haversine)

## Tech Stack
- Frontend: React 18+, Vite 5+, Tailwind CSS 3+, React‑Leaflet 4+
- Maps: OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
- Icons: Lucide React
- Utilities: Custom Haversine distance function
- Deployment: Netlify or Vercel (static hosting)

## Project Structure
```
elektromap/
├── public/
│   ├── data/
│   │   ├── locations.json           # Pre‑geocoded data (target)
│   │   └── locations_raw.json       # CSV→JSON (no coordinates)
│   └── favicon.ico
├── src/                             # React app (to be scaffolded)
├── scripts/
│   └── csv_to_json.py               # CSV→JSON (+optional geocoding)
├── .ai/
│   ├── tech-stack-phase1.md         # Phase 1 technical plan
│   ├── tech-stack.md                # Original full stack
│   ├── MVP_Specification.md         # MVP product spec
│   └── prd.md                       # Detailed PRD
├── ewaste_locations.csv             # Source data (78 rows)
├── README.md                        # This file
└── .gitignore
```

## Data
- Source: Poznań city hall PDF (as of 2024‑04‑29), extracted to `ewaste_locations.csv`
- Target JSON structure (`public/data/locations.json`):
```json
{
  "version": "1.0",
  "lastUpdated": "ISO timestamp",
  "city": "Poznań",
  "country": "Poland",
  "locations": [
    {
      "id": 1,
      "lp": 1,
      "address": "os. 1000-lecia 45",
      "fullAddress": "os. 1000-lecia 45, Poznań, Poland",
      "additionalInfo": "wolnostojący",
      "coordinates": { "latitude": 52.406789, "longitude": 16.925234 },
      "geocodedAt": "ISO timestamp"
    }
  ]
}
```

## Data Preparation
One‑time geocoding is run locally to produce the static JSON file.

### Option A: Raw CSV → JSON (no coordinates)
```bash
source venv/bin/activate
python3 scripts/csv_to_json.py
# Output: public/data/locations_raw.json (78 entries, coordinates=null)
```

### Option B: Geocode via Nominatim (OpenStreetMap)
```bash
source venv/bin/activate
python3 scripts/csv_to_json.py --geocode --rate 1.1
# Output: public/data/locations_geocoded.json
```

### Option C: Geocode via OpenCage (recommended for tricky addresses)
```bash
source venv/bin/activate
pip install opencage
export OPENCAGE_API_KEY="YOUR_OPENCAGE_KEY"
python3 scripts/csv_to_json.py --geocode --provider opencage --opencage-key "$OPENCAGE_API_KEY" --rate 1.1
# Optional resume if interrupted:
python3 scripts/csv_to_json.py --geocode --provider opencage --opencage-key "$OPENCAGE_API_KEY" --resume --rate 1.1
```

Notes:
- Geocoding adheres to ~1 req/sec. Expect ~2 minutes for 78 addresses.
- Some estate (“os.”) addresses geocode better as “osiedle …”. The script tries variants.

## Frontend Setup (Phase 1)
```bash
# Create app
npm create vite@latest elektromap-frontend -- --template react
cd elektromap-frontend

# Install dependencies
npm install
npm install leaflet react-leaflet tailwindcss postcss autoprefixer lucide-react
npx tailwindcss init -p

# Dev server
npm run dev
```

Load `public/data/locations.json` on app mount and render markers via React‑Leaflet components.

## Environment
```bash
# .env (local only)
VITE_MAP_CENTER_LAT=52.4064
VITE_MAP_CENTER_LNG=16.9252
VITE_MAP_DEFAULT_ZOOM=12
VITE_API_ENABLED=false
```

## Deployment
Netlify (recommended) or Vercel.
- Build: `npm run build`
- Publish: `dist`
- HTTPS and CDN caching included.

## Success Criteria (Phase 1)
- 78 locations geocoded and displayed on map
- Page load <3s on 4G, Lighthouse >90
- Nearest locations visible in <3 clicks
- No backend required; static JSON powers the app

## Limitations
- Static data updates require rebuilding JSON and redeploying
- Single city scope; no user accounts or analytics in Phase 1

## License & Data Usage
- Uses OpenStreetMap tiles and Nominatim for geocoding (respect usage policies)
- OpenCage optional (requires API key; free tier available)

## Maintainers
- Contact: kontakt@elektromap.pl
- Issues: Create GitHub issues for bugs/requests
