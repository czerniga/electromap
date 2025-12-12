# ElektroMap MVP Specification

## 1. Project Overview

**ElektroMap** is a web application designed to help users quickly locate the nearest electronic waste (e-waste) collection point in their municipality. The MVP focuses on delivering a simple, user-friendly experience that enables residents to responsibly dispose of their electronic devices by finding official e-waste drop-off locations.

### Goals
- Provide easy access to official e-waste collection points
- Reduce friction in the e-waste disposal process
- Promote environmental responsibility through convenient information access

### Target Users
- Residents looking to dispose of electronic waste (smartphones, laptops, batteries, small appliances, etc.)
- Environmentally conscious citizens seeking official disposal locations
- General public with minimal technical expertise

---

## 2. Data Source Description

### Primary Data Source
The application will use the **official e-waste collection point list** published by the Poznań city hall website. This ensures:
- Data accuracy and reliability
- Compliance with official disposal regulations
- Up-to-date location information (as of April 29, 2024)

### Data Format
- **Source**: PDF file downloaded from Poznań municipality website (https://www.poznan.pl)
- **Processing**: PDF converted to CSV format with 78 collection points
- **File**: `ewaste_locations.csv`
- **Structure**: CSV with UTF-8 encoding
- Initial implementation focuses on Poznań, Poland

### Actual Data Fields
The CSV contains the following fields:
- **Lp** (Sequential number): 1-78
- **Ulica** (Street address): Full street address with building/unit numbers
  - Examples: "os. 1000-lecia 45", "ul. 28 Czerwca 1956 r. nr 352/360", "ul. Arciszewskiego 35"
- **Dodatkowe informacje** (Additional information): Location details and context
  - Examples: "wolnostojący" (free-standing), "teren szkoły" (school premises), "obok pojemników na odpady segregowane" (next to segregated waste bins), "PSM Wielkopolanka" (housing cooperative name)

### Missing Data Fields (Require Processing)
- **Geographic coordinates** (latitude/longitude) - must be geocoded from street addresses
- **Postal codes** - can be derived during geocoding process
- **Operating hours** - not provided in source data
- **Contact information** - not provided in source data
- **Accepted e-waste types** - not specified per location

---

## 3. In-Scope Features

### Core Functionality

#### 3.1 Location Search
- **Search by current location**: Users can find collection points near their current GPS position
- **Search by address**: Users can manually enter an address or postal code
- **Distance calculation**: Display distance from user's location to each collection point
- **Results sorting**: Collection points sorted by proximity (nearest first)

#### 3.2 Map Display
- **Interactive map view**: Visual display of collection points on a map (using Google Maps, OpenStreetMap, or similar)
- **Location markers**: Clear markers for each collection point
- **User position indicator**: Show user's current location on the map (when permission granted)
- **Marker click interaction**: Clicking a marker displays basic information about that location

#### 3.3 List View
- **Collection point list**: Display search results as a scrollable list
- **Basic information cards**: Each location shows:
  - Name
  - Address
  - Distance from user
  - Operating hours (if available)
- **Toggle between map and list view**: Users can switch between visualization modes

#### 3.4 Location Details
- **Detail page/modal**: View comprehensive information about a selected collection point:
  - Full address
  - Operating hours
  - Contact information
  - Directions link (opens native maps app or Google Maps)

#### 3.5 Basic Filtering (Optional for MVP)
- Filter by open/closed status (if operating hours are available)
- Filter by maximum distance radius

### User Journey

1. **Landing**: User arrives at homepage
2. **Permission request**: Application requests location access (optional, user can skip)
3. **Search initiation**: 
   - Option A: Use current location automatically
   - Option B: Enter address manually
4. **View results**: See nearest collection points on map and/or list
5. **Select location**: Click on a marker or list item
6. **View details**: See full information about the selected location
7. **Navigate**: Use "Get Directions" to open navigation in maps application

---

## 4. Out-of-Scope Features

### Excluded from MVP (Future Enhancements)

#### 4.1 Advanced Features
- User accounts and authentication
- Saved favorite locations
- User reviews and ratings
- Real-time capacity/availability information
- Appointment booking system
- Push notifications for collection events

#### 4.2 Extended Functionality
- Multi-city/multi-municipality support
- Drop-off history tracking
- E-waste type filtering (specific device categories)
- Collection service provider information
- Mobile native applications (iOS/Android)
- Offline mode
- Multi-language support (MVP will use single language)

#### 4.3 Community Features
- User-submitted locations
- Photo uploads of facilities
- Community forum or discussion
- Social sharing features

#### 4.4 Administrative Features
- Admin dashboard for data management
- Real-time data sync from municipality API
- Analytics and usage statistics
- Location verification system

#### 4.5 Advanced Data
- Collection point photos/images
- Detailed accepted items list per location
- Pricing information (if applicable)
- Special event locations (temporary collection drives)
- Historical data on collection volumes

---

## 5. Technical Architecture

**Note**: For detailed technical stack information including frameworks, libraries, database schema, API endpoints, and deployment configuration, see [tech-stack.md](../tech-stack.md).

### High-Level Architecture

The application follows a three-tier architecture:

1. **Frontend Layer** (React + Leaflet.js)
   - Single-page application deployed on Vercel/Netlify
   - Interactive map with OpenStreetMap tiles
   - Browser geolocation for user positioning
   - Responsive design for mobile and desktop

2. **API Layer** (Node.js + Express)
   - RESTful API server deployed on Railway/Render
   - Handles location queries with PostGIS spatial functions
   - CORS-enabled for frontend access
   - Rate limiting and security middleware

3. **Database Layer** (PostgreSQL + PostGIS)
   - Stores 78 geocoded collection points
   - PostGIS extension for efficient spatial queries
   - Spatial indexes for fast nearest-neighbor search
   - Hosted on Railway/Render with automated backups

### Data Flow

```
User Action → Frontend → API Request → Database Query → API Response → UI Update
```

### Key Technical Decisions

- **PostgreSQL + PostGIS**: Enables efficient spatial queries for finding nearest locations
- **Node.js/Express**: Lightweight, fast API server with good ecosystem
- **React + Leaflet.js**: Free mapping solution without API key requirements
- **Railway/Render**: Free tier hosting with PostgreSQL support
- **Nominatim**: Free geocoding service for address-to-coordinates conversion

---

## 6. Assumptions & Constraints

### Assumptions
1. **Data Availability**: ✓ Confirmed - 78 collection points available from Poznań municipality (April 2024)
2. **Data Quality**: Addresses are valid Polish street addresses and can be geocoded accurately with "Poznań, Poland" context
3. **Update Frequency**: Municipality data doesn't change frequently (monthly or quarterly updates acceptable)
4. **Browser Support**: Users access the application via modern web browsers with geolocation support
5. **Internet Access**: Users have active internet connection while using the application
6. **Single Municipality**: ✓ MVP covers Poznań, Poland (78 locations)
7. **Mobile Responsive**: Application will be mobile-friendly but won't be a native app
8. **Language**: Interface in Polish for Poznań users (street names already in Polish)

### Constraints
1. **Budget**: Minimal to zero cost for MVP (using free tiers of services)
2. **Development Time**: MVP should be achievable in 2-4 weeks with single developer
3. **Data Updates**: Manual data refresh process (automated sync not in MVP)
4. **API Limits**: Free tier limitations on mapping and geocoding services
5. **Accuracy**: Location accuracy dependent on user's device GPS and geocoding quality
6. **Privacy**: No user data collection beyond session-based location requests
7. **Performance**: Target load time under 3 seconds on 4G connection
8. **Scalability**: MVP not optimized for high traffic (< 1000 concurrent users)

### Technical Constraints
- No iOS/Android native apps - web-only
- Limited browser support (modern browsers only - Chrome, Firefox, Safari, Edge)
- No offline functionality
- Single language interface (Polish for Poznań)
- Desktop and mobile web only
- **Geocoding required**: All 78 addresses need coordinates before deployment
- **API rate limits**: Nominatim has usage limits (~1 request/second)

### Success Criteria for MVP
- Users can find nearest collection point within 3 clicks
- Map loads and displays markers within 3 seconds
- Search by address returns results in under 2 seconds
- Application works on mobile and desktop browsers
- At least 95% of municipality locations are accurately geocoded and displayed

---

## Next Steps

1. **Data Acquisition**: ✓ COMPLETED
   - Downloaded PDF from Poznań city hall
   - Converted to CSV format
   - 78 e-waste collection points extracted

2. **Database Setup**: Setup PostgreSQL with PostGIS
   - Choose hosting: Supabase (easiest), Railway, or Render
   - Create database and enable PostGIS extension
   - Define schema with spatial column for coordinates
   - Create spatial indexes for query performance

3. **Data Geocoding & Import**: Geocode and load data
   - Create Python script to geocode all 78 addresses
   - Add "Poznań, Poland" context to each address
   - Verify accuracy of coordinates (spot check on map)
   - Insert geocoded data into PostgreSQL database
   - Implement retry logic for failed geocoding attempts

4. **API Development**: Build REST API (if not using Supabase)
   - Create Node.js/Express server with PostGIS queries
   - Implement endpoints for location search and nearest queries
   - Test spatial queries for performance
   - Deploy API to Railway or Render

5. **Technology Selection**: Finalize frontend framework and mapping library
   - Recommended: React + Leaflet.js + OpenStreetMap (free, no API keys)
   - Alternative: React + Google Maps API (requires API key, usage limits)
   - State management: React Context or Zustand (lightweight)

6. **Design Mockups**: Create basic UI/UX wireframes
   - Polish language interface
   - Mobile-first design
   - Map view with location markers
   - List view with distance sorting

7. **Development Sprint**: Build MVP in iterations:
   - Week 1: Database setup + geocoding script + data import + API endpoints
   - Week 2: Basic React structure + API integration + fetch locations
   - Week 3: Map integration (Leaflet.js) + markers + geolocation + nearest search
   - Week 4: List view + distance display + UI polish + testing + deployment

8. **Testing**: User acceptance testing with Poznań residents
   - Test spatial queries with various locations
   - Verify geocoding accuracy
   - Performance testing for database queries

9. **Launch**: Deploy to production
   - Frontend: Vercel or Netlify
   - Backend: Railway, Render, or Supabase
   - Database: PostgreSQL with PostGIS
   - Monitor API performance and query times

10. **Iterate**: Plan v1.1 based on user feedback and usage data
    - Analyze which locations are searched most
    - Gather feedback on geocoding accuracy
    - Plan for additional features

---

---

## Related Documents

- [Technical Stack Details](tech-stack.md) - Complete technical specifications, database schema, API endpoints, and deployment configuration

---

**Document Version**: 1.2  
**Last Updated**: November 21, 2025  
**Status**: Draft for Review
