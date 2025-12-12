# ElektroMap - Technical Stack

## Frontend

### Framework & Libraries
- **React.js 18+**: Component-based UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

### Mapping & Geolocation
- **Leaflet.js 1.9+**: Open-source interactive map library
- **React Leaflet**: React components for Leaflet
- **OpenStreetMap**: Free map tiles (no API key required)
- **Browser Geolocation API**: User location detection

### Styling & UI
- **Tailwind CSS 3+**: Utility-first CSS framework
- **Headless UI** or **shadcn/ui**: Accessible UI components
- **Lucide React**: Icon library

### State Management
- **Zustand** or **React Context**: Lightweight state management
- **TanStack Query (React Query)**: Data fetching and caching

### HTTP Client
- **Axios** or **Fetch API**: API communication

### Deployment
- **Vercel** or **Netlify**: Static hosting with CI/CD
- Custom domain support
- Automatic HTTPS

---

## Backend

### API Server
- **Node.js 20+ LTS**
- **Express.js 4+**: Web framework for REST API
- **TypeScript**: Type-safe server development

### API Endpoints
```
GET  /api/locations                    # Get all collection points
GET  /api/locations/nearest            # Find nearest locations
     ?lat={latitude}
     &lng={longitude}
     &limit={number}                   # Number of results (default: 10)
     &radius={meters}                  # Optional radius filter

GET  /api/locations/:id                # Get specific location details
GET  /api/health                       # Health check endpoint
```

### Middleware & Security
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting
- **Morgan**: HTTP request logging
- **Dotenv**: Environment variable management

### Deployment
- **Railway** (recommended): Free tier, PostgreSQL included
- **Render**: Alternative free tier option
- **DigitalOcean App Platform**: Paid option for production

---

## Database

### Database System
- **PostgreSQL 15+**: Relational database
- **PostGIS Extension 3+**: Spatial data support

### Database Schema

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Main locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    lp INTEGER NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    additional_info TEXT,
    location GEOGRAPHY(POINT, 4326),  -- PostGIS spatial type (WGS84)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geocoded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Spatial index for fast geospatial queries
CREATE INDEX idx_locations_geography ON locations USING GIST(location);

-- Index for ID lookups
CREATE INDEX idx_locations_lp ON locations(lp);

-- Example insert
INSERT INTO locations (lp, address, additional_info, location, latitude, longitude)
VALUES (
    1,
    'os. 1000-lecia 45, Poznań',
    'wolnostojący',
    ST_SetSRID(ST_MakePoint(16.9252, 52.4064), 4326),
    52.4064,
    16.9252
);
```

### Spatial Queries (PostGIS)

```sql
-- Find nearest locations (K-nearest-neighbor)
SELECT 
    id,
    lp,
    address,
    additional_info,
    latitude,
    longitude,
    ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
    ) as distance_meters
FROM locations
ORDER BY location <-> ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
LIMIT :limit;

-- Find locations within radius
SELECT 
    id,
    lp,
    address,
    additional_info,
    latitude,
    longitude,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) as distance_meters
FROM locations
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
    :radius_meters
)
ORDER BY distance_meters;
```

### Database Hosting
- **Railway**: Free tier, includes PostgreSQL + PostGIS
- **Supabase**: Managed PostgreSQL with PostGIS, free tier 500MB
- **Render**: Free tier PostgreSQL (limited)

---

## Data Processing (ETL)

### Geocoding Script
- **Python 3.11+**
- **Libraries**:
  - `pandas`: CSV processing
  - `geopy`: Geocoding via Nominatim
  - `psycopg2` or `asyncpg`: PostgreSQL connection
  - `python-dotenv`: Environment variables
  - `requests`: HTTP requests with retry logic

### Geocoding Service
- **Nominatim API** (OpenStreetMap):
  - Free, no API key required
  - Rate limit: 1 request/second
  - Usage policy: https://operations.osmfoundation.org/policies/nominatim/

### Script Workflow
```python
1. Read CSV file (ewaste_locations.csv)
2. For each address:
   - Add "Poznań, Poland" context
   - Call Nominatim API with 1s delay
   - Parse latitude/longitude
   - Handle errors and retries
3. Insert geocoded data into PostgreSQL
4. Log results and failures
```

---

## Development Tools

### Package Managers
- **pnpm** (recommended): Fast, efficient
- **npm** or **yarn**: Alternatives

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

### Testing (Optional for MVP)
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

### Version Control
- **Git**
- **GitHub**: Repository hosting

---

## Environment Variables

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_CENTER_LAT=52.4064
VITE_MAP_CENTER_LNG=16.9252
VITE_MAP_DEFAULT_ZOOM=12
```

### Backend (.env)
```bash
# Server
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/elektromap
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elektromap
DB_USER=postgres
DB_PASSWORD=your_password

# API
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Geocoding Script (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/elektromap
NOMINATIM_USER_AGENT=ElektroMap/1.0
GEOCODING_DELAY_SECONDS=1
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTION                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Users] ──► [Vercel/Netlify CDN]                          │
│                     │                                        │
│                     │ HTTPS API Calls                       │
│                     ▼                                        │
│              [Railway/Render]                               │
│                     │                                        │
│              [Node.js/Express API]                          │
│                     │                                        │
│                     │ SQL Queries                           │
│                     ▼                                        │
│              [PostgreSQL + PostGIS]                         │
│                     │                                        │
│              [78 Geocoded Locations]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       DEVELOPMENT                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [localhost:5173] ◄──► [localhost:3000] ◄──► [localhost:5432]│
│   React + Vite          Express API          PostgreSQL     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Targets

- **Frontend Load Time**: < 2 seconds on 4G
- **API Response Time**: < 200ms for nearest location query
- **Database Query Time**: < 50ms with spatial index
- **Map Tile Loading**: Progressive loading with cache
- **Concurrent Users**: Support 100+ simultaneous users

---

## Cost Estimate (Free Tier)

| Service | Provider | Free Tier | Cost After |
|---------|----------|-----------|------------|
| Frontend Hosting | Vercel | 100GB bandwidth | $20/month |
| Backend API | Railway | 500 hours/month | $5/month |
| Database | Railway | 1GB storage | Included |
| Domain | Namecheap | - | $10/year |
| Geocoding | Nominatim | Unlimited* | Free |

*Rate limited to 1 req/sec

**MVP Total Cost**: $0/month (using free tiers)

---

**Last Updated**: November 21, 2025  
**Version**: 1.0
