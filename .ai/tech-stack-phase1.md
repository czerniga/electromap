# ElektroMap - Technical Stack (Phase 1 MVP)

## Overview

Phase 1 implements a simplified, static-first approach to deliver the MVP in 2 weeks. This stack eliminates backend complexity by serving pre-geocoded location data as a static JSON file with client-side distance calculations.

**Timeline**: 2 weeks
**Cost**: $0/month (free tier hosting)
**Complexity**: Low
**Scalability**: Sufficient for 78-500 locations

---

## Frontend

### Framework & Core Libraries
- **React.js 18+**: Component-based UI framework
  - Reason: Component reusability, large ecosystem, developer familiarity
  - Alternative considered: Vanilla JS (rejected - harder to maintain)
- **JavaScript (ES6+)**: No TypeScript for MVP
  - Reason: Faster development, no build configuration overhead
  - Migration path: Add TypeScript in Phase 2 if needed
- **Vite 5+**: Fast build tool and dev server
  - Reason: Fast HMR, simple config, optimized production builds
  - Dev server: `npm run dev` (instant startup)

### Mapping & Geolocation
- **Leaflet.js 1.9+**: Open-source interactive map library
  - Reason: Free, lightweight (39KB), excellent documentation
  - No API keys required
- **React Leaflet 4+**: React wrapper for Leaflet
  - Reason: Declarative map components, hooks support
  - Components: `<MapContainer>`, `<TileLayer>`, `<Marker>`, `<Popup>`
- **OpenStreetMap**: Free map tiles
  - Tile server: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Attribution required (included automatically)
- **Browser Geolocation API**: User location detection
  - Native browser API, no library needed
  - Fallback: Manual address search if denied

### Styling & UI
- **Tailwind CSS 3+**: Utility-first CSS framework
  - Reason: Rapid prototyping, consistent design, minimal custom CSS
  - Configuration: PostCSS integration via Vite
  - Optimization: PurgeCSS removes unused styles in production
- **Lucide React**: Icon library
  - Reason: Modern icons, tree-shakeable, consistent style
  - Icons needed: MapPin, Navigation, List, X, Search, Loader
  - Size: ~2KB per icon (only import what you use)

### State Management
- **React useState + useContext**: Built-in React hooks
  - Reason: Sufficient for MVP, no external dependencies
  - Usage: Current location, search results, view mode (map/list)
  - No Redux/Zustand needed for read-only location data
- **No data fetching library**: Direct fetch API usage
  - Reason: Single JSON file load on mount, no caching complexity
  - Implementation: `fetch('/data/locations.json').then(r => r.json())`

### Utilities
- **Haversine Distance Calculation**: Custom implementation
  - Reason: Simple formula, no library needed
  - Purpose: Calculate distance between user and collection points
  - Formula: Great-circle distance on sphere
  - Implementation: ~20 lines of JavaScript

### Development Tools
- **ESLint**: JavaScript linting
  - Config: `eslint-config-react-app` (simple preset)
  - Rules: Enforce best practices, catch errors
- **Prettier**: Code formatting
  - Config: Default settings, auto-format on save
  - Integration: VS Code extension
- **Vite Plugin React**: JSX/React support
  - Fast Refresh for instant component updates

---

## Data Layer

### Data Format
- **Static JSON File**: Pre-processed location data
  - Location: `/public/data/locations.json`
  - Size: ~15-20KB (78 locations with full data)
  - Loading: Fetched once on app mount
  - Caching: Browser cache + Service Worker (optional)

### JSON Structure
```json
{
  "version": "1.0",
  "lastUpdated": "2024-04-29",
  "city": "Poznań",
  "country": "Poland",
  "locations": [
    {
      "id": 1,
      "lp": 1,
      "address": "os. 1000-lecia 45",
      "fullAddress": "os. 1000-lecia 45, 61-249 Poznań, Poland",
      "additionalInfo": "wolnostojący",
      "coordinates": {
        "latitude": 52.406789,
        "longitude": 16.925234
      },
      "geocodedAt": "2024-11-21T10:30:00Z"
    }
  ]
}
```

### Data Processing (Pre-deployment)

**Geocoding Script** (Python 3.11+)
```python
# scripts/geocode_locations.py
# Run once before deployment

import pandas as pd
import json
from geopy.geocoders import Nominatim
import time

# 1. Read CSV (ewaste_locations.csv)
# 2. Geocode each address with "Poznań, Poland" context
# 3. Rate limit: 1 request/second (Nominatim policy)
# 4. Handle errors, log failures
# 5. Generate locations.json
# 6. Validate output (all 78 locations present)
```

**Required Python Libraries**:
- `pandas`: CSV reading
- `geopy`: Nominatim geocoding client
- `python-dotenv`: Environment variables (optional)

**Geocoding Service**:
- **Nominatim API** (OpenStreetMap)
- Free, no API key
- Rate limit: 1 request/second
- User agent required: "ElektroMap/1.0"
- URL: `https://nominatim.openstreetmap.org/search`

**Processing Time**: ~2 minutes for 78 addresses (1 req/sec)

---

## Client-Side Logic

### Distance Calculation

**Haversine Formula Implementation**:
```javascript
// utils/distance.js

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // kilometers
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
```

**Performance**: <1ms to calculate all 78 distances

### Search & Filtering Logic

**Nearest Location Search**:
```javascript
// hooks/useNearestLocations.js

function findNearestLocations(userLat, userLng, locations, limit = 10) {
  return locations
    .map(location => ({
      ...location,
      distance: haversineDistance(
        userLat, 
        userLng, 
        location.coordinates.latitude,
        location.coordinates.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}
```

**Address Geocoding** (for manual search):
- Use Nominatim API from client
- Add "Poznań, Poland" context
- Debounce input (500ms)
- Cache recent searches in localStorage

---

## Deployment

### Hosting Platform
- **Netlify** (Primary recommendation)
  - Free tier: 100GB bandwidth/month
  - Automatic HTTPS
  - Continuous deployment from Git
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Custom domain support
  
**Alternative**: Vercel
  - Similar features, same free tier generosity
  - Slight differences in UI/configuration

### Build Configuration

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  }
}
```

**Vite config** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // adjust if deploying to subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false, // disable for production
    minify: 'terser'
  }
})
```

### Deployment Process
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatically on git push
5. Custom domain: Point DNS to Netlify (optional)

### Environment Variables
```bash
# .env (for local development only)
VITE_MAP_CENTER_LAT=52.4064
VITE_MAP_CENTER_LNG=16.9252
VITE_MAP_DEFAULT_ZOOM=12
VITE_API_ENABLED=false
```

No secrets required (all data is public)

---

## Project Structure

```
elektromap/
├── public/
│   ├── data/
│   │   └── locations.json          # Pre-geocoded location data
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.jsx         # Main map component
│   │   │   ├── LocationMarker.jsx  # Individual marker
│   │   │   └── UserMarker.jsx      # User position marker
│   │   ├── List/
│   │   │   ├── ListView.jsx        # List view component
│   │   │   └── LocationCard.jsx    # Location list item
│   │   ├── Search/
│   │   │   ├── SearchBar.jsx       # Address search input
│   │   │   └── LocationButton.jsx  # "Use my location" button
│   │   ├── Details/
│   │   │   └── LocationModal.jsx   # Location details modal
│   │   └── Layout/
│   │       ├── Header.jsx          # App header
│   │       └── ViewToggle.jsx      # Map/List toggle
│   ├── hooks/
│   │   ├── useGeolocation.js       # Browser geolocation hook
│   │   ├── useLocations.js         # Load and manage locations
│   │   └── useNearestLocations.js  # Distance calculation
│   ├── utils/
│   │   ├── distance.js             # Haversine formula
│   │   └── geocode.js              # Client-side geocoding
│   ├── context/
│   │   └── LocationContext.jsx     # Shared state
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind
├── scripts/
│   └── geocode_locations.py        # Pre-deployment geocoding
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

---

## Development Workflow

### Initial Setup
```bash
# 1. Create React + Vite project
npm create vite@latest elektromap-frontend -- --template react

# 2. Install dependencies
cd elektromap-frontend
npm install

# 3. Install additional packages
npm install leaflet react-leaflet
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react

# 4. Initialize Tailwind
npx tailwindcss init -p

# 5. Start development server
npm run dev
```

### Data Preparation (One-time)
```bash
# 1. Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install Python dependencies
pip install pandas geopy python-dotenv

# 3. Run geocoding script
python scripts/geocode_locations.py

# 4. Copy generated locations.json to public/data/
cp output/locations.json public/data/

# 5. Verify JSON structure
cat public/data/locations.json | jq '.locations | length'
# Should output: 78
```

### Development Commands
```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Check code quality
```

---

## Performance Optimization

### Bundle Size Targets
- Initial JS bundle: <150KB (gzipped)
- Initial CSS bundle: <30KB (gzipped)
- locations.json: ~20KB (gzipped: ~5KB)
- Total initial load: <200KB

### Optimization Techniques
1. **Code Splitting**: Lazy load LocationModal
   ```javascript
   const LocationModal = lazy(() => import('./components/Details/LocationModal'))
   ```

2. **Tree Shaking**: Import only needed Leaflet components

3. **Image Optimization**: Use SVG icons (Lucide)

4. **CSS Purging**: Tailwind removes unused styles automatically

5. **Asset Caching**: Leverage Netlify CDN caching headers

### Performance Targets
- **First Contentful Paint**: <1.5s on 4G
- **Time to Interactive**: <3s on 4G
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

---

## Browser Support

### Target Browsers
- Chrome/Edge 90+ (95% of users)
- Firefox 88+ (3% of users)
- Safari 14+ (2% of users)

### Required Browser Features
- Geolocation API
- Fetch API
- ES6+ JavaScript
- CSS Grid & Flexbox
- LocalStorage (for caching)

### Graceful Degradation
- Geolocation denied → Manual address search
- Old browser → Display compatibility message
- JavaScript disabled → Show static message

---

## Security Considerations

### Security Measures
1. **HTTPS Only**: Enforced by Netlify
2. **Content Security Policy**: Set via Netlify headers
   ```
   # netlify.toml
   [[headers]]
     for = "/*"
     [headers.values]
       Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.tile.openstreetmap.org data:; connect-src 'self' https://nominatim.openstreetmap.org"
   ```
3. **No Sensitive Data**: All data is public
4. **No User Input Storage**: No database, no user data collected
5. **Rate Limiting**: Handled by Nominatim on their end

### Privacy
- No cookies
- No user tracking
- No analytics (add Google Analytics/Plausible later if needed)
- Location data stored only in session
- No personal data collected

---

## Testing Strategy (Optional for MVP)

### Manual Testing Checklist
- [ ] Map loads with all 78 markers
- [ ] Clicking marker shows correct info
- [ ] Geolocation request works
- [ ] Manual address search returns results
- [ ] Distance calculations are accurate (spot check)
- [ ] List view displays all locations
- [ ] Toggle between map/list works
- [ ] Mobile responsive (test on real device)
- [ ] Desktop experience smooth
- [ ] "Get Directions" opens maps app
- [ ] Works in Chrome, Firefox, Safari
- [ ] Works offline (shows error message)

### Automated Testing (Future)
Phase 2 can add:
- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

---

## Migration Path to Phase 2

### When to Migrate
Triggers for adding backend:
- User base >1,000 DAU
- Data updates needed more than monthly
- Need for user accounts/favorites
- Expanding beyond Poznań (>100 locations)
- Need for server-side analytics

### Migration Steps
1. Set up PostgreSQL + PostGIS database
2. Create Express.js API server
3. Migrate location data to database
4. Update frontend to use API endpoints
5. Deploy backend to Railway/Render
6. Add TypeScript (optional)
7. Maintain static JSON as fallback

### Backward Compatibility
- Keep JSON file as backup
- Feature flag to switch between static/API
- Gradual rollout to users

---

## Cost Breakdown

### Development Costs
- Developer time: 60-80 hours
- Breakdown:
  - Data preparation & geocoding: 8 hours
  - Component development: 24 hours
  - Map integration: 12 hours
  - Styling & responsive: 12 hours
  - Testing & fixes: 8 hours
  - Deployment & documentation: 4 hours

### Operational Costs
- Hosting: $0/month (Netlify free tier)
- Domain: $10/year (optional)
- Maintenance: ~1 hour/month
- **Total: $0-10/year**

---

## Success Criteria

### Technical Metrics
- [ ] All 78 locations geocoded successfully
- [ ] Page load time <3s on 4G
- [ ] Lighthouse score >90
- [ ] Zero console errors
- [ ] Works on mobile and desktop
- [ ] Compatible with target browsers

### User Metrics
- [ ] Can find nearest location in <3 clicks
- [ ] Distance calculations accurate within 100m
- [ ] Map/list toggle works smoothly
- [ ] Geolocation permission grant rate >50%
- [ ] "Get Directions" success rate >90%

---

## Limitations & Known Issues

### Phase 1 Limitations
1. **Static Data**: Requires rebuild to update locations
2. **No Backend**: Cannot add user features without major refactor
3. **Client-Side Only**: No server-side analytics
4. **Manual Updates**: Admin must edit JSON and redeploy
5. **Single City**: Only Poznań covered

### Future Enhancements (Phase 2)
- Database-backed location management
- Admin panel for updates
- User accounts and favorites
- Multi-city support
- Real-time data updates
- Server-side analytics
- API for third-party integrations

---

**Last Updated**: November 21, 2025  
**Version**: 1.0 (Phase 1 MVP)  
**Status**: Ready for Implementation
