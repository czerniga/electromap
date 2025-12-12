# UI Architecture Planning Summary - ElektroMap Phase 1 MVP

## Conversation Summary

### Decisions

1. **Data Source**: Use `locations.json` with pre-geocoded coordinates (60+ locations minimum). Create 5-10 location mock file for development.

2. **Initial View Without Location Permission**: Display all 78 markers centered on Poznań (52.4064°N, 16.9252°E) at zoom level 12 with non-blocking banner prompting location access.

3. **Distance Display Without User Location**: Show list view with alphabetically sorted addresses and "— km" placeholder for distance. Include subtle prompt to enable location.

4. **Development Priority**: Mobile-first approach (320-768px), then progressive enhancement for tablet and desktop with split views.

5. **View Toggle Persistence**: Store preference in localStorage using key `elektromap_preferred_view`. Default to map view on first visit.

6. **Marker Clustering**: Skip for Phase 1. 78 markers have minimal performance impact; reconsider in Phase 2 for expanded coverage.

7. **Location Detail Display**: Modal overlay for desktop/tablet; slide-up drawer (80vh) for mobile with swipe-to-dismiss. Use hash routing (`#location/5`) for URL sharing.

8. **Search Input Position**: Floating card at top of map (mobile) or top-right (desktop) with 16px margins, z-index 10.

9. **Geolocation Button**: Integrated into search bar with crosshair icon + text. Mobile shows icon only in compact mode. Pulsing blue dot indicates active location state.

10. **Loading Strategy**: Progressive loading - immediate map container, skeleton markers during data fetch, transition to real markers. List view shows 10 skeleton cards.

11. **Failed Geocoding Handling**: Show in list view only with "Lokalizacja niedostępna" badge. Omit from map markers. Include in search results.

12. **Offline Support**: Phase 1 uses simple error message ("Brak połączenia z internetem..."). Phase 2 will implement service worker for offline caching.

---

### Matched Recommendations

1. **Component Architecture**: Organize by feature (Map/, List/, Search/, Details/, Layout/) rather than type for better maintainability.

2. **State Management**: Single LocationContext provider managing: loaded locations, user position, selected location, view mode, search query. Prevents prop drilling.

3. **Data Loading Pattern**: useLocations hook fetches locations.json once on mount, caches in context, provides loading/error states.

4. **Distance Calculation**: useMemo-wrapped useNearestLocations hook recalculates only when user location changes (78 locations optimization).

5. **Mobile Touch Targets**: 44px minimum touch target size for all interactive elements per WCAG guidelines and PRD FR-036.

6. **Progressive Enhancement**: Load map library asynchronously, show static list view while map tiles load for resilient UX.

7. **Keyboard Navigation**: Implement shortcuts - M (map), L (list), Esc (close modals), Enter (select focused location).

8. **Responsive Breakpoints**: Mobile (<768px) stacked views with toggle, Tablet (768-1024px) split view option, Desktop (>1024px) side-by-side.

9. **CSS Strategy**: Tailwind utility classes for 90% of styling. Custom classes only for complex map controls and animations.

10. **Icon System**: Import only required Lucide icons (MapPin, Navigation, List, X, Search, Loader, MapPinned) to maintain <150KB bundle target.

11. **Error Message Localization**: Create messages.js utility with Polish error strings for easier future i18n.

12. **Distance Formatting**: <1km in meters ("750m"), ≥1km with 2 decimals ("2.43 km").

13. **Deep Link Strategy**: Platform detection - maps:// (iOS), geo:/google.navigation: (Android), https://maps.google.com (desktop fallback).

14. **Build Optimization**: Vite code splitting to lazy load LocationModal, reducing initial bundle by ~15-20KB.

15. **Development Workflow**: Mock JSON with 5-10 entries including null coordinates to test all UI states.

16. **Accessibility**: Semantic HTML with ARIA labels in Polish - <main>, <nav>, role="search", aria-label for map controls.

17. **Z-Index Scale**: Clear hierarchy - map (1), controls (10), modal overlay (100), modal content (101).

18. **Testing Focus**: Location permission flows, distance accuracy spot checks, cross-browser marker rendering, mobile touch interactions.

---

### UI Architecture Planning Summary

#### A. Key UI Architecture Requirements

**Component Structure (Feature-Based Organization)**:
```
src/
├── components/
│   ├── Map/
│   │   ├── MapView.jsx          # Leaflet map container, markers, popups
│   │   └── MapControls.jsx      # Zoom, geolocation button
│   ├── List/
│   │   ├── ListView.jsx         # Scrollable location cards
│   │   └── LocationCard.jsx     # Individual card with distance, address
│   ├── Search/
│   │   └── SearchBar.jsx        # Floating search with geolocation button
│   ├── Details/
│   │   └── LocationModal.jsx    # Lazy-loaded detail modal/drawer
│   └── Layout/
│       ├── Header.jsx           # App title, view toggle
│       └── ErrorBoundary.jsx    # Error fallback UI
├── context/
│   └── LocationContext.jsx      # Global state provider
├── hooks/
│   ├── useLocations.js          # Fetch and cache locations.json
│   ├── useNearestLocations.js   # Distance calculation with useMemo
│   └── useGeolocation.js        # Browser geolocation API wrapper
├── utils/
│   ├── distance.js              # Haversine formula
│   ├── messages.js              # Polish error/info messages
│   └── platformDetection.js    # Deep link platform detection
└── App.jsx                      # Root component, context provider
```

**Core Technologies**:
- React 18+ with JavaScript (no TypeScript for MVP)
- Vite 5+ for fast dev server and optimized builds
- Leaflet.js 1.9+ with React Leaflet 4+ for mapping
- Tailwind CSS 3+ for utility-first styling
- Lucide React for icons (tree-shakeable, ~2KB per icon)
- Browser Geolocation API (no external library)
- Custom Haversine distance calculation (~20 lines)

**Data Architecture**:
- Static JSON file (`/public/data/locations.json`, ~15-20KB)
- Loaded once on app mount via fetch API
- Cached in LocationContext for entire session
- No backend API calls in Phase 1
- Mock JSON file with 5-10 entries for development

#### B. Key Views, Screens, and User Flows

**Primary Views**:

1. **Map View (Default)**:
   - Full-screen Leaflet map with OpenStreetMap tiles
   - 78 markers representing collection points
   - User location indicator (blue pulsing dot when enabled)
   - Floating search bar (top/top-right)
   - View toggle button (map/list switcher)
   - Initial center: Poznań (52.4064°N, 16.9252°E), zoom level 12
   - Marker click → Opens info popup with address and "Details" button
   - Popup "Details" button → Opens LocationModal

2. **List View**:
   - Scrollable cards displaying all 78 locations
   - Each card shows: address, distance (or "— km"), additional info
   - Sorted alphabetically by address (without user location) or by proximity (with location)
   - Card click → Opens LocationModal
   - View toggle button switches back to map

3. **Location Detail Modal**:
   - **Desktop/Tablet**: Modal overlay (keeps map visible in background)
   - **Mobile**: Slide-up drawer (80vh height, swipe-to-dismiss)
   - Content: Full address, additional info, distance
   - "Get Directions" button → Opens native maps app
   - Hash routing for sharing: `#location/5`
   - Close button (X icon) or Esc key to dismiss

**User Flows**:

**Flow 1: First-Time User with Location Permission Granted**
1. User opens app → Map loads centered on Poznań with 78 markers
2. Location permission prompt appears with Polish message
3. User grants permission → Blue dot appears at user location
4. Map re-centers to user location
5. Non-blocking banner: "Włącz lokalizację, aby znaleźć najbliższe punkty" with "Użyj mojej lokalizacji" button
6. User clicks "List View" toggle → Sees locations sorted by proximity with distances
7. User clicks nearest location card → Modal opens with details
8. User clicks "Get Directions" → Native maps app opens with destination

**Flow 2: User Denies Location Permission**
1. User opens app → Map loads centered on Poznań with 78 markers
2. Location permission prompt appears
3. User denies → Map stays centered on Poznań, no user location indicator
4. Search bar remains functional for manual address search
5. List view shows all locations sorted alphabetically with "— km" placeholders
6. Subtle prompt: "Włącz lokalizację dla sortowania według odległości"
7. User can still view details and get directions to any location

**Flow 3: Search by Address**
1. User types in search bar: "Wpisz adres w Poznaniu"
2. As user types, search filters visible markers/cards
3. User selects result → Map centers on that location, marker popup opens
4. User can click "Details" in popup → LocationModal opens

**Flow 4: Mobile User Finding Nearest Point**
1. User opens app on mobile (320-768px screen)
2. Grants location permission → Blue dot appears
3. Clicks geolocation button (crosshair icon) in search bar
4. Map re-centers on user location
5. Toggles to List View → Sees top 3 nearest locations at top
6. Clicks first card → Slide-up drawer (80vh) with details
7. Clicks "Get Directions" → Google Maps app opens (Android) or Apple Maps (iOS)
8. Swipes down on drawer → Dismisses, returns to list

#### C. API Integration and State Management Strategy

**Phase 1: No Backend API**
- Static JSON file served from `/public/data/locations.json`
- Client-side data fetching via native fetch API
- No REST API endpoints in Phase 1
- Distance calculations performed client-side using Haversine formula
- No database queries (data pre-processed during build)

**State Management Architecture**:

**LocationContext Structure**:
```javascript
const LocationContext = createContext({
  // Data
  locations: [],          // Array of 78 location objects
  loading: false,         // Initial data fetch state
  error: null,           // Error message if fetch fails
  
  // User State
  userPosition: null,     // { lat, lng } or null
  geolocationError: null, // Permission denied, timeout, etc.
  
  // UI State
  selectedLocation: null, // Currently viewed location in modal
  viewMode: 'map',       // 'map' or 'list'
  searchQuery: '',       // Current search text
  
  // Actions
  setUserPosition: () => {},
  setSelectedLocation: () => {},
  setViewMode: () => {},
  setSearchQuery: () => {}
});
```

**Custom Hooks**:

1. **useLocations**:
   - Fetches `/public/data/locations.json` once on mount
   - Returns: `{ locations, loading, error }`
   - Caches data in LocationContext
   - No refetch logic (data is static for Phase 1)

2. **useNearestLocations**:
   - Depends on: `locations`, `userPosition`
   - Calculates distances using Haversine formula
   - Wrapped in useMemo to avoid recalculations on every render
   - Triggers recalculation only when `userPosition` changes
   - Returns: Array of locations sorted by distance with `distance` property added

3. **useGeolocation**:
   - Wraps Browser Geolocation API
   - Handles permission request and errors
   - Returns: `{ position, error, loading, requestLocation }`
   - Updates LocationContext with user position

**Data Flow**:
```
App.jsx
  → LocationContext.Provider wraps entire app
  → useLocations hook fetches data on mount
  → Data stored in context state
  → Child components consume via useContext(LocationContext)
  
MapView.jsx
  → useContext to get locations, userPosition, selectedLocation
  → Renders markers from locations array
  → Marker click → setSelectedLocation
  
ListView.jsx
  → useNearestLocations hook (with useMemo)
  → Renders sorted LocationCard components
  → Card click → setSelectedLocation
  
LocationModal.jsx
  → Lazy loaded via React.lazy()
  → useContext to get selectedLocation
  → "Get Directions" → Platform detection → Deep link
```

**localStorage Usage**:
- Key: `elektromap_preferred_view`
- Value: `'map'` or `'list'`
- Read on mount to restore user preference
- Update on view toggle

#### D. Responsiveness, Accessibility, and Security

**Responsive Design Strategy**:

**Breakpoints**:
- **Mobile**: <768px - Stacked views, toggle button, icon-only controls
- **Tablet**: 768-1024px - Split view option (map + list side-by-side)
- **Desktop**: >1024px - Side-by-side layout, larger touch targets

**Mobile-Specific Adaptations** (320-768px):
- Search bar: Full width minus 16px margins, compact geolocation icon
- View toggle: Prominent bottom navigation bar or floating button
- LocationModal: Slide-up drawer (80vh), swipe-to-dismiss gesture
- Map markers: Larger tap targets (44px minimum)
- List cards: Full-width, stacked vertically
- Header: Simplified, collapsible if needed

**Tablet Adaptations** (768-1024px):
- Split view option: 40% list, 60% map (or 50/50)
- Search bar: Top-right floating card (desktop-style)
- LocationModal: Standard modal overlay
- Map controls: Standard size

**Desktop Adaptations** (>1024px):
- Side-by-side: List panel (400px fixed width), map fills remaining space
- Search bar: Top-right floating card with full text labels
- LocationModal: Centered overlay (600px max-width)
- Hover states for markers and cards
- Keyboard shortcuts enabled (M, L, Esc, Enter)

**Accessibility Implementation**:

1. **Semantic HTML**:
   - `<main>` for primary content
   - `<nav>` for view toggle and navigation
   - `<header>` for app title and controls
   - `<article>` for location cards
   - `<button>` for all clickable actions (not `<div>` with onClick)

2. **ARIA Labels (Polish)**:
   - Search input: `aria-label="Wpisz adres w Poznaniu"`
   - Geolocation button: `aria-label="Użyj mojej lokalizacji"`
   - Map container: `aria-label="Mapa punktów zbiórki e-odpadów"`
   - List view: `aria-label="Lista punktów zbiórki"`
   - Close modal: `aria-label="Zamknij szczegóły"`

3. **Keyboard Navigation**:
   - Tab order: Search → Geolocation → View toggle → Map markers/List cards → Modal
   - Shortcuts: M (map), L (list), Esc (close modal), Enter (select focused item)
   - Focus visible indicators (Tailwind `focus:ring-2 focus:ring-blue-500`)

4. **Screen Reader Support**:
   - Announce location count: `aria-live="polite"` for search results
   - Modal open/close: Focus management (trap focus in modal)
   - Loading states: `aria-busy="true"` during data fetch
   - Distance updates: `aria-label="Odległość: 2.43 kilometra"`

5. **Touch Target Sizes**:
   - Minimum 44x44px for all interactive elements (WCAG 2.1 Level AAA)
   - Marker icons: 40x40px + 8px padding
   - Buttons: 48px height minimum on mobile
   - List cards: 64px minimum height

6. **Color Contrast**:
   - Text on background: Minimum 4.5:1 (WCAG AA)
   - Interactive elements: Minimum 3:1 (WCAG AA)
   - Error messages: Red #DC2626 on white (#FFFFFF) = 5.9:1
   - Link blue: #2563EB on white = 5.1:1

7. **Error Handling**:
   - Clear Polish error messages via messages.js
   - Location permission denied: "Nie można określić Twojej lokalizacji. Użyj wyszukiwania ręcznego."
   - Network error: "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie."
   - Geocoding failed: "Lokalizacja niedostępna" badge (not error message)

**Security Considerations**:

Phase 1 security is minimal due to static-only architecture:

1. **No Backend = No Server-Side Vulnerabilities**:
   - No SQL injection risk (no database queries)
   - No authentication/authorization needed
   - No API keys in client code
   - No CORS issues (same-origin static files)

2. **Client-Side Security**:
   - HTTPS required for geolocation API (enforced by Netlify/Vercel)
   - No sensitive data stored (only public collection point addresses)
   - localStorage only stores view preference (non-sensitive)
   - No XSS risk (React escapes content by default)

3. **Data Privacy**:
   - User location never sent to server (client-side only)
   - No analytics or tracking in Phase 1
   - No cookies or session storage
   - Geolocation permission managed by browser (explicit consent)

4. **Content Security**:
   - OpenStreetMap tiles loaded from trusted CDN
   - locations.json served from own domain (no external data)
   - No external scripts or third-party dependencies at runtime

5. **HTTPS and Hosting**:
   - Netlify/Vercel enforce HTTPS by default
   - Automatic SSL certificates
   - Secure headers configured by platform

**Phase 2 Security Enhancements** (when adding backend):
- API authentication (JWT tokens)
- Rate limiting on API endpoints
- Input validation and sanitization
- CSRF protection
- Database connection encryption
- Environment variable management for secrets

#### E. Performance Optimization

**Bundle Size Targets**:
- Total JavaScript: <150KB gzipped
- Initial load: <100KB (lazy load modal)
- Leaflet.js: 39KB
- React + React-DOM: ~40KB
- Tailwind (purged): ~10KB
- Custom code + Lucide icons: ~20KB

**Loading Strategy**:
1. **Critical Path**:
   - HTML shell loads immediately
   - CSS (Tailwind) loads inline or as blocking stylesheet
   - JavaScript bundle loads with defer
   - Map tiles load progressively as user pans/zooms

2. **Progressive Enhancement**:
   - Show map container skeleton immediately
   - Display gray circle placeholders for markers while data loads
   - Fade in real markers after locations.json fetch completes
   - List view shows 10 skeleton cards during loading

3. **Code Splitting**:
   - LocationModal lazy loaded: `React.lazy(() => import('./Details/LocationModal'))`
   - Reduces initial bundle by ~15-20KB
   - Loaded on first modal open (user interaction)

4. **Data Optimization**:
   - locations.json minified (~15KB)
   - Browser caches JSON with Cache-Control headers
   - Single fetch on mount, no refetching

5. **Map Performance**:
   - No marker clustering needed (78 markers = low overhead)
   - Use Leaflet's built-in marker recycling
   - Limit visible zoom levels (min: 10, max: 18)
   - Disable animations on low-end devices (media query)

6. **useMemo Optimization**:
   - Distance calculations wrapped in useMemo
   - Recalculate only when userPosition changes
   - Avoids 78 Haversine calculations on every render

**Lighthouse Performance Targets**:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

---

### Unresolved Issues

1. **Geocoding Completion**: Only 10/78 locations processed with 0 successful coordinates due to OpenCage API key issue. Need to either:
   - Fix OpenCage API key passing in Python script
   - Use Nominatim provider with rate limiting (1 req/sec)
   - Manually geocode remaining addresses via OpenStreetMap.org
   - Create mock coordinates for development and geocode properly later

2. **Service Worker Strategy**: Phase 1 uses simple offline error message. Need to decide if Phase 2 will:
   - Implement full service worker with cache-first strategy
   - Cache locations.json and map tiles for offline access
   - Add "Update available" prompt for data freshness

3. **Analytics Implementation**: No analytics in Phase 1. Phase 2 may need:
   - Privacy-friendly analytics (e.g., Plausible, Fathom)
   - Track: page views, search queries, "Get Directions" clicks
   - GDPR compliance considerations (no consent banner for privacy-respecting analytics)

4. **Search Functionality Scope**: Current plan is simple string matching on address field. Unresolved:
   - Should search include fuzzy matching (Levenshtein distance)?
   - Should it handle Polish character normalization (ł→l, ą→a)?
   - Should it search "additionalInfo" field or address only?
   - Should it provide autocomplete suggestions?

5. **Map Tile Provider Fallback**: Using OpenStreetMap tiles by default. Unresolved:
   - Should we configure fallback tile server if OSM is down?
   - Alternative: Stamen Terrain, CartoDB, Mapbox (requires API key)
   - Monitor OSM tile server availability in production

6. **Marker Icon Customization**: Default Leaflet marker vs custom icon. Unresolved:
   - Should we use custom icon (e-waste symbol, green color)?
   - If yes, need to design/source icon (SVG preferred)
   - Consider accessibility (sufficient contrast with map background)

7. **Deep Link Testing**: Platform detection logic for "Get Directions" untested. Need to:
   - Test maps:// on iOS Safari (iPhone, iPad)
   - Test geo: and google.navigation: on Android Chrome
   - Verify fallback to https://maps.google.com on desktop
   - Handle edge cases (maps app not installed)

8. **Polish Language Validation**: All UI text planned in Polish. Need native speaker review:
   - Error messages in messages.js
   - Button labels and ARIA labels
   - Modal content and instructions
   - Ensure natural, colloquial phrasing

9. **Distance Calculation Accuracy**: Haversine formula assumes spherical Earth. Unresolved:
   - Is straight-line distance acceptable or should we show "walking distance" disclaimer?
   - Should we integrate route distance API in Phase 2 (Google Maps Distance Matrix)?
   - Current precision: meters <1km, 2 decimals ≥1km - is this sufficient?

10. **Browser Compatibility**: Target: Chrome, Firefox, Safari. Need to verify:
    - Leaflet.js compatibility with Safari on iOS 14+
    - Geolocation API permission prompts on different browsers
    - CSS Grid and Flexbox support on older browsers (fallback strategy?)
    - Touch event handling on Android browsers

11. **Development Mock Data**: Recommendation says 5-10 location mock file. Unresolved:
    - Should mock data be subset of real data or completely fabricated?
    - Should it include intentionally invalid coordinates to test error states?
    - Should we create multiple mock files (small, medium, large) for testing?

12. **Error Boundary Granularity**: ErrorBoundary planned but scope unresolved:
    - Single root error boundary or multiple (per view)?
    - Should map errors be handled separately from list errors?
    - What's the fallback UI (retry button, reload page, contact support)?

---

## Next Steps

1. **Complete Geocoding**: Resolve API key issue or use Nominatim to geocode all 78 addresses.
2. **Initialize React Project**: Run `npm create vite@latest frontend -- --template react`.
3. **Install Dependencies**: Leaflet, React Leaflet, Tailwind CSS, Lucide React.
4. **Setup Tailwind**: Configure `tailwind.config.js` and `postcss.config.js`.
5. **Create Mock Data**: Generate `public/data/locations.json` with 5-10 entries for development.
6. **Implement Core Hooks**: useLocations, useNearestLocations, useGeolocation.
7. **Build LocationContext**: Global state provider with locations, userPosition, viewMode.
8. **Develop MapView**: Leaflet integration, markers, popups.
9. **Develop ListView**: Location cards with distance, sorted by proximity.
10. **Implement LocationModal**: Lazy-loaded detail view with "Get Directions".
11. **Add Search Functionality**: String matching on address field.
12. **Test Responsive Layouts**: Mobile (320px), tablet (768px), desktop (1024px+).
13. **Accessibility Audit**: Keyboard navigation, ARIA labels, screen reader testing.
14. **Manual Testing**: Location permission flows, distance calculations, cross-browser compatibility.
15. **Deploy to Netlify/Vercel**: Build production bundle, configure HTTPS.