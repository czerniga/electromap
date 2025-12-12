# UI Architecture Planning - Questions & Answers

## Questions

### 1. Static Data Source
**Q:** Should the app load locations from locations.json or locations_raw.json? The raw version has no coordinates yet - do you want to proceed with manual geocoding first, or should we use mock coordinates for initial UI development?

**A:** Use `locations.json` - we'll geocode the data first using the OpenCage script, ensuring we have coordinates for at least 60+ locations before UI development. For development, create a small mock file with 5-10 locations.

### 2. Initial View State
**Q:** When a user first opens the app without granting location permission, should the map display all 78 markers centered on Poznań, or show an empty state prompting for location access?

**A:** Display all 78 markers centered on Poznań (52.4064°N, 16.9252°E) at zoom level 12. Show a non-blocking banner at the top with "Włącz lokalizację, aby znaleźć najbliższe punkty" (Enable location to find nearest points) with a "Użyj mojej lokalizacji" button.

### 3. Distance Display
**Q:** Without user location, should we still show the list view with all locations (but no distance sorting), or require location access before enabling list view?

**A:** Show list view with all locations sorted alphabetically by address. Display a placeholder "— km" where distance would appear, with subtle prompt to enable location for distance-based sorting.

### 4. Mobile-First Priority
**Q:** Given this is likely to be used on mobile while traveling to drop-off points, should we prioritize mobile layout first or develop desktop and mobile simultaneously?

**A:** Mobile-first approach. Develop mobile layout (320-768px) first, ensuring all core functionality works perfectly on small screens. Then progressively enhance for tablet and desktop with split views.

### 5. View Toggle Behavior
**Q:** Should map/list toggle be persistent (remember user preference in localStorage) or reset to map view on each visit?

**A:** Persist in localStorage. Key: `elektromap_preferred_view`. Default to map view on first visit. This respects user preference and reduces friction for repeat visitors.

### 6. Marker Clustering
**Q:** With 78 markers potentially visible, should we implement marker clustering for better map performance and visual clarity when zoomed out?

**A:** Skip clustering for Phase 1. With only 78 markers and modern devices, performance impact is minimal. Clustering adds complexity and bundle size. Reconsider in Phase 2 if expanding beyond Poznań.

### 7. Location Detail Modal
**Q:** Should location details open in a modal overlay (keeping map visible) or navigate to a separate detail page with back navigation?

**A:** Modal overlay for desktop/tablet (keeps map context visible). Slide-up drawer modal for mobile (80vh height, can swipe down to dismiss). Both keep URL state for sharing via hash routing: `#location/5`.

### 8. Search Input Placement
**Q:** Where should the address search bar be positioned - floating over the map, in a header bar, or in a collapsible panel?

**A:** Floating card at top of map (mobile) or top-right (desktop), with 16px margin from edges. Includes search icon, input placeholder "Wpisz adres w Poznaniu", and clear button when typing. Z-index: 10.

### 9. Geolocation Button
**Q:** Should "Use My Location" be a prominent button, an icon in the header, or integrated into the search bar?

**A:** Integrated into search bar as a button with crosshair icon + "Użyj mojej lokalizacji" text (mobile shows icon only in compact mode). When location enabled, shows pulsing blue dot icon indicating active state.

### 10. Loading States
**Q:** What level of loading feedback do you want - simple spinner, skeleton screens, or progressive content loading?

**A:** Progressive loading: (1) Show map container immediately, (2) Display skeleton markers (gray circles) while data loads, (3) Transition to real markers. List view shows 10 skeleton cards. Initial load spinner for <1s, then progressive content.

### 11. Error Boundary Strategy
**Q:** For addresses that fail geocoding, should we hide them from the UI, show them with a "Location unavailable" badge, or display them only in list view without map markers?

**A:** Show in list view only with "Lokalizacja niedostępna" badge and no distance display. Include in search results. Omit from map markers. This maintains data completeness while being honest about limitations.

### 12. Offline Fallback
**Q:** Since this is a static app, should we implement service worker caching for offline access, or simply show an error message when offline?

**A:** Phase 1: Simple offline message ("Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie."). Phase 2: Implement service worker to cache locations.json and map tiles for offline access. Keep MVP simple.

Component Architecture: Organize components by feature (Map/, List/, Search/, Details/, Layout/) rather than by type. This aligns with the tech stack structure and improves maintainability.

State Management Strategy: Use a single LocationContext provider to manage: loaded locations, user position, selected location, view mode (map/list), and search query. This avoids prop drilling across MapView, ListView, and modal components.

Data Loading Pattern: Implement useLocations hook that fetches locations.json once on mount, caches in context, and provides loading/error states. This single source of truth prevents multiple fetch calls and race conditions.

Distance Calculation: Create a useMemo-wrapped function in useNearestLocations hook to recalculate distances only when user location changes. With 78 locations, this prevents unnecessary recalculations on every render.

Mobile Touch Targets: Ensure all interactive elements (markers, list items, buttons) meet 44px minimum touch target size per PRD FR-036 and WCAG guidelines.

Map Performance: Use React Leaflet's built-in marker clustering or implement custom clustering for zoom levels <12 to avoid rendering all 78 markers simultaneously on initial load.

Progressive Enhancement: Load the map library asynchronously and show a static list view while map tiles load. This ensures users can access location data even if map rendering is slow.

Keyboard Navigation: Implement keyboard shortcuts for power users: M for map view, L for list view, Esc to close modals, Enter to select focused location.

Geolocation UX Flow: After requesting permission, show an inline message explaining why location access improves the experience, with a "Search Manually" alternative button prominently displayed.

Responsive Breakpoints: Define three layouts: Mobile (<768px) - stacked views with toggle, Tablet (768-1024px) - split view option, Desktop (>1024px) - side-by-side map and list.

CSS Strategy: Use Tailwind utility classes for 90% of styling, create custom component classes only for complex map controls and animations. This aligns with the "minimal custom CSS" approach in tech stack.

Icon System: Import only required Lucide icons (MapPin, Navigation, List, X, Search, Loader, MapPinned) to keep bundle size under the 150KB target.

Error Message Localization: Create a simple messages.js utility with Polish error strings rather than hardcoding them in components. This makes future i18n easier if needed.

Distance Formatting: Display distances <1km in meters (e.g., "750m") and >=1km with 2 decimals (e.g., "2.43 km") for better readability.

Link Strategy: For "Get Directions", detect iOS vs Android and construct appropriate deep links: maps:// for iOS, geo: or google.navigation: for Android, and https://maps.google.com fallback for desktop.

Build Optimization: Configure Vite code splitting to lazy load LocationModal component only when first opened, reducing initial bundle size by ~15-20KB.

Development Workflow: Create a mock locations.json with 5-10 entries including both successful geocodes and null coordinates to test all UI states during development.

Accessibility Landmarks: Use semantic HTML with proper ARIA labels: <main>, <nav>, role="search" for search bar, aria-label for map controls in Polish.

Z-Index Management: Define a clear z-index scale (map: 1, controls: 10, modal overlay: 100, modal content: 101) to prevent stacking context issues.

Testing Strategy for MVP: Focus manual testing on: (a) location permission grant/deny flows, (b) distance calculation accuracy spot checks, (c) cross-browser marker rendering, (d) touch interactions on real mobile devices.