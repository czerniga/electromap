# ElektroMap Frontend (MVP)

This is a Phase 1 static frontend using React + Vite, Leaflet/React-Leaflet, and Tailwind. It loads pre-geocoded data from `public/data/locations.json`.

## Quick Start

```sh
npm install
npm run dev
```

Open http://localhost:5173. Grant geolocation for nearest locations; otherwise use the search bar.

## Build

```sh
npm run build
npm run preview
```

## Structure
- `src/context/LocationContext.jsx` — global app state
- `src/hooks` — data loading & geolocation
- `src/components/Map/MapView.jsx` — map with markers
- `src/components/List/ListView.jsx` — list sorted by distance
- `src/components/Details/LocationModal.jsx` — location details + navigation

## Notes
- Polish UI by default
- No backend; static JSON only in Phase 1
- HTTPS is required for geolocation in production
