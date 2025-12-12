# View Implementation Plan [Map View]

## 1. Overview
The Map View presents all e‑waste collection points on an interactive OpenStreetMap base layer. It is the default entry view, supports optional user geolocation for proximity context, enables quick access to location details (via popup → modal/drawer), and provides an address search bar overlay. It operates entirely on static JSON data (`public/data/locations.json`) without backend/API in Phase 1.

## 2. View Routing
- Path: `/` (default route)
- Hash state for details: `#location/:id` (opened from marker popup)

## 3. Component Structure
- App
  - LocationContext.Provider
    - Header (optional minimal)
    - MapView
      - MapControls
      - SearchBar (floating overlay)
      - LocationModal (lazy, mounted on demand)

## 4. Component Details

### MapView
- Purpose: Render Leaflet map centered on Poznań, display 78 markers, user position indicator (if available), and handle marker interactions.
- Structure:
  - `<MapContainer center={poznańCenter} zoom={12}>`
    - `<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />`
    - `<Marker />` for each location with `<Popup />`
    - Optional `<Marker />` for user position
- Events:
  - Marker click: opens popup with basic info and “Details” button
  - Map move/zoom: internal state only (no API)
- Validation conditions:
  - Render markers only for locations with valid coordinates `{latitude, longitude}`
- Types:
  - DTO: `LocationDTO` (see Types section)
  - VM: `MapMarkerVM` (id, title, position)
- Props:
  - Consumes `locations`, `userPosition`, `selectedLocation` from LocationContext; no direct props from parent.

### MapControls
- Purpose: UI controls for zoom (Leaflet default) and re‑center on user location.
- Structure:
  - Custom control button “Center on me” (if `userPosition` available)
- Events:
  - Click re‑centers map view to `userPosition`
- Validation conditions:
  - Button disabled if `userPosition` is null
- Types:
  - Uses `UserPosition` type
- Props:
  - Reads `userPosition` and map instance via React‑Leaflet hooks.

### SearchBar
- Purpose: Filter visible markers/cards by address substring; host the “Use my location” action.
- Structure:
  - Input field + crosshair icon button; clear button when typing
- Events:
  - Change: updates `searchQuery` in context
  - Click “Use my location”: triggers geolocation request via `useGeolocation`
- Validation conditions:
  - Input length ≤255; ignore empty string
- Types:
  - `SearchQuery` (string)
- Props:
  - Reads/writes `searchQuery` via LocationContext; calls `requestLocation()` from `useGeolocation`.

### LocationModal (lazy)
- Purpose: Show full details of selected location and provide “Navigate” deep link.
- Structure:
  - Title (address), additional info, distance (if available), Lp, “Navigate” button
- Events:
  - Close via X, Esc, or backdrop
  - Click “Navigate” → deep link per platform
- Validation conditions:
  - Render only when `selectedLocation` is not null
- Types:
  - `LocationDTO`, `DeepLink`
- Props:
  - Reads `selectedLocation` from LocationContext; generates deep link via `platformDetection`.

## 5. Types
- `LocationDTO`:
  - `id: number`
  - `lp: number`
  - `address: string`
  - `fullAddress?: string`
  - `additionalInfo?: string`
  - `coordinates?: { latitude: number; longitude: number }`
  - `geocodedAt?: string`
- `UserPosition`:
  - `{ lat: number; lng: number } | null`
- `MapMarkerVM`:
  - `{ id: number; title: string; lat: number; lng: number }`
- `SearchQuery`:
  - `string`
- `DeepLink`:
  - `{ url: string; platform: 'ios' | 'android' | 'web' }`

## 6. State Management
- LocationContext (global):
  - Data: `locations: LocationDTO[]`, `loading: boolean`, `error: string | null`
  - User: `userPosition: UserPosition`, `geolocationError: string | null`
  - UI: `selectedLocation: LocationDTO | null`, `viewMode: 'map' | 'list'`, `searchQuery: string`
  - Actions: setters for the above; persist `viewMode` in `localStorage` (key `elektromap_preferred_view`).
- Hooks:
  - `useLocations()`: fetch and cache static JSON once
  - `useGeolocation()`: request permission, set `userPosition`, handle errors/timeouts
  - `useNearestLocations()`: memoized Haversine distances (used by list; map can keep simple markers)

## 7. API Integration
- Phase 1: None. All data from `/public/data/locations.json` via `fetch()`.
- Requests/Responses:
  - GET `/data/locations.json` → `{ locations: LocationDTO[] }`

## 8. User Interactions
- Click marker → open popup with address + “Details” button
- Click “Details” in popup → set `selectedLocation` and open modal/drawer (and update hash `#location/:id`)
- Click “Use my location” → prompt for geolocation, center map if granted
- Type in search → filter markers by address substring; empty query shows all
- Close modal/drawer → restore previous focus and state

## 9. Conditions and Validation
- Only render markers for entries with valid numeric `coordinates`
- Disable “Center on me” when `userPosition` is null
- Search input: limit to 255 chars; trim whitespace; debounce (≥300ms) for performance
- Distance formatting: `<1km` in meters (e.g., `750m`), `≥1km` with 2 decimals (`2.43 km`)

## 10. Error Handling
- Data fetch error → show Polish message from `messages.js`; allow retry
- Geolocation denied → show Polish hint and keep functionality via manual search
- Geolocation timeout → message and suggest manual search
- Missing coordinates → show “Location unavailable” badge in details and list; skip marker render
- Offline → show “No internet connection” Polish message; retry when back online

## 11. Implementation Steps
1. Create `LocationContext` with initial state and actions; persist `viewMode`.
2. Implement `useLocations()` to fetch `/data/locations.json` once and populate context.
3. Build `MapView`:
   - Initialize `<MapContainer>` with Poznań center and zoom 12
   - Render `<TileLayer>` and markers for valid `coordinates`
   - Add user position marker when `userPosition` exists
   - Attach popups with address + “Details” button to set `selectedLocation`
4. Implement `MapControls` with “Center on me” button; handle disabled state.
5. Implement `SearchBar` overlay:
   - Input bound to `searchQuery`, with clear button
   - Crosshair button triggers `useGeolocation().requestLocation()`
   - Filter markers client‑side by address substring
6. Implement `LocationModal` (lazy):
   - Render details from `selectedLocation`
   - Generate deep link via `platformDetection`
   - Handle close via Esc/backdrop/X and restore focus
7. Wire hash routing for `#location/:id` (open/restore modal state on load).
8. Add `messages.js` with Polish strings; use in errors and hints.
9. Accessibility pass: ARIA labels (map, search, list, controls), focus management, keyboard shortcuts (M/L/Esc/Enter).
10. Testing: verify markers render, popups open, modal navigation works, geolocation prompts correctly, search filters markers, offline/error states show.
