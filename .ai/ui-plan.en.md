# UI Architecture for ElektroMap (MVP – Phase 1)

## 1. UI Framework Overview

ElektroMap (MVP) is a mobile‑first web application designed to quickly help users find the nearest e‑waste collection points in Poznań. Phase 1 runs without a backend and without any API — data is static (the `public/data/locations.json` file) and loaded once at startup. Distances are computed client‑side (Haversine). The default view is a map with markers; an alternative view is a list. Location details open as a modal (desktop/tablet) or a drawer (mobile). The interface is Polish‑language, with a focus on accessibility (ARIA), clear states (skeletons, errors), and a straightforward path to external maps.

UI Technologies: React 18, Vite, Leaflet + React‑Leaflet, Tailwind CSS, Lucide icons. State management: React built‑in hooks (`useState`, `useContext`) with a `LocationContext`. No external API keys in the client.

## 2. List of Views

### View: Map (default)
- **Path**: `/`
- **Primary Purpose**: Visualize all 78 points; quick spatial overview; start centered on Poznań.
- **Key Information**: point markers (address, context), user position indicator (after consent), banner encouraging location access, search bar.
- **Key View Components**: `MapView`, `MapControls`, `SearchBar`, `ViewToggle`, `LocationContext`.
- **UX/Accessibility/Security**: mobile‑first; touch targets ≥44px; `aria-label` for map and controls; HTTPS required for geolocation; Polish messages; no clustering in Phase 1 (78 markers are fine).

### View: List
- **Path**: `/list`
- **Primary Purpose**: Linear comparison of points, with distance (or “— km” without location) and additional information.
- **Key Information**: address, distance, additional info; alphabetical sort (without location) or by distance (with location).
- **Key View Components**: `ListView`, `LocationCard`, `ViewToggle`, `SearchBar`.
- **UX/Accessibility/Security**: preserve search context when toggling; `aria-live` for result counts; store view preference in `localStorage`.

### View: Location Details (Modal/Drawer)
- **Path**: `#location/:id` (hash‑routing, e.g. `#location/5`)
- **Primary Purpose**: Full point details + “Navigate” button.
- **Key Information**: full address, contextual info, distance, sequential number (Lp), navigation links.
- **Key View Components**: `LocationModal` (lazy‑load), `platformDetection` (iOS/Android/desktop), focus management (trap).
- **UX/Accessibility/Security**: desktop/tablet – modal overlay; mobile – 80vh drawer with a close gesture; Esc closes; Polish ARIA labels.

### View: Loading and Error States
- **Path**: global (UI layer)
- **Primary Purpose**: Clear skeletons, consistent messages, no “blank screen”.
- **Key Information**: skeleton markers/cards, messages: offline, geolocation denied, data fetch error.
- **Key View Components**: `ErrorBoundary`, skeleton UI, `messages.js`.
- **UX/Accessibility/Security**: `aria-busy` during loading; WCAG contrast; no sensitive data; Phase 1 offline support = simple message.

## 3. User Journey Map

### Main Flow (mobile)
1. Entry → Map centers on Poznań (52.4064, 16.9252), zoom 12; all markers visible.
2. Banner: “Enable location to find nearest points” + “Use my location”.
3. Consent granted → blue pulsing dot; map re‑centers on user.
4. Switch to List → sort by distance; quick selection of nearest.
5. Click card/marker → Details (80vh drawer on mobile / modal on desktop).
6. “Navigate” → open native maps app (Android/iOS) or Google Maps in browser.
7. Close details → return to previous view (preserve search/scroll state).

### Without Location Consent
- Map: 78 markers centered on Poznań.
- List: alphabetical sort + “— km” placeholder.
- Search: works normally; subtle prompt encouraging location for distance sorting.

### Address Search
- Typing in the search bar filters markers/cards; selecting a result centers the map and opens a popup; details available from the popup.

## 4. Navigation Layout and Structure

- **View toggle**: Map/List; preference remembered in `localStorage` (`elektromap_preferred_view`).
- **Search bar**: floating; mobile – top full‑width with 16px margins; desktop – top‑right; built‑in geolocation button.
- **Details**: `#location/:id` enables sharing; close via X/Esc or gesture.
- **Map controls**: zoom/pan + center on user location.
- **Responsiveness**:
  - Mobile <768px: vertical layout, larger touch targets, drawer for details.
  - Tablet 768–1024px: optional split view (list + map).
  - Desktop >1024px: ~400px list panel + map alongside.

## 5. Key Components

- **`LocationContext`**: data (`locations`, `loading`, `error`), user state (`userPosition`), UI state (`selectedLocation`, `viewMode`, `searchQuery`).
- **`useLocations`**: single fetch of `locations.json`, cache in context, loading/error states.
- **`useNearestLocations`**: Haversine + sorting, `useMemo` (recompute on position change).
- **`useGeolocation`**: manage consent/errors; update `userPosition`.
- **`MapView`**: MapContainer, TileLayer, Marker, Popup; user position indicator.
- **`ListView`**: cards with distance or “— km”; filter via `searchQuery`.
- **`LocationModal`** (lazy‑load): point details, “Navigate”, focus trap, Esc close.
- **`SearchBar`**: input with crosshair icon; clear action, ARIA labels.
- **`distance.js`**: format meters <1 km; ≥1 km with 2 decimal places.
- **`messages.js`**: Polish error and hint messages.
- **`platformDetection.js`**: maps:// (iOS), geo:/google.navigation (Android), https (desktop).
- **`ErrorBoundary`**: gentle fallbacks and retry.

## 6. Edge Cases and Error States

- **Offline**: Polish message; attempt to reconnect; no SW in Phase 1.
- **Geolocation denied**: prompt for manual search; no crashes; list shows “— km”.
- **Missing coordinates**: visible in list with “Location unavailable” badge; hidden on map.
- **Geolocation timeout**: message and switch to manual search.
- **Geolocation unsupported**: fallback to address search.
- **Link sharing**: hash‑routing preserves details context.

## 7. PRD Requirements Mapping

- **FR‑001/008/010/011/012/013/014**: OSM map, markers, Poznań center, zoom/pan, info popup.
- **FR‑015/016/017/018**: List view, cards, view toggle, preserve context.
- **FR‑002/003/005/006/007**: Geolocation, distance, distance sorting, responsive response times.
- **FR‑033–038**: Polish UI, mobile/desktop responsiveness, no auth, Polish error messages, loading states.
- **Out of scope for Phase 1**: DB/PostGIS/API — deferred to Phase 2 per roadmap.

## 8. Requirements → UI Elements Mapping

- “Show all points” → `MapView` + markers.
- “Use my location” → `useGeolocation` + button in `SearchBar`.
- “Sort by distance” → `useNearestLocations` + `ListView`.
- “Details and Navigate” → `LocationModal` + `platformDetection`.
- “Polish messages” → `messages.js` + `ErrorBoundary`.
- “Mobile‑first & accessibility” → Tailwind, ARIA, ≥44px, focus‑ring.

## 9. Accessibility and Security

- **Security**: no backend; no keys/API; HTTPS; local geolocation handling; no cookies/analytics in Phase 1.
- **Accessibility**: semantic HTML, Polish ARIA, keyboard shortcuts (M/L/Esc/Enter), focus management in modal, WCAG AA contrasts.

## 10. API Plan Alignment (Phase 2)

View architecture is data‑source agnostic: in Phase 2, `useLocations` can be replaced by a REST client (GET `/api/locations`, `/api/locations/nearest`, `/api/locations/:id`) without changes to component and context structure.
