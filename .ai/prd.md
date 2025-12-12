# Product Requirements Document (PRD) - ElektroMap

## 1. Product Overview

ElektroMap is a web-based application designed to help residents of Poznań, Poland quickly locate the nearest electronic waste (e-waste) collection point. The product addresses the critical need for convenient access to official e-waste disposal locations, promoting environmental responsibility and reducing barriers to proper electronic device disposal.

The MVP focuses on delivering a simple, user-friendly experience with 78 official collection points sourced from Poznań city hall. The application provides interactive map visualization, location search capabilities, and detailed information about each collection point.

Target audience includes residents disposing of smartphones, laptops, batteries, small appliances, and other electronic waste, with an emphasis on serving users with minimal technical expertise through an intuitive Polish-language interface.

## 2. User Problem

Residents of Poznań face several challenges when attempting to dispose of electronic waste responsibly:

- Lack of centralized, easily accessible information about official e-waste collection points
- Difficulty finding the nearest collection point from their current location
- Time-consuming manual search through municipality documents or websites
- Uncertainty about exact locations and additional context (parking, accessibility)
- Risk of disposing e-waste improperly due to information barriers

Current alternatives include:
- Manually searching the city hall website for PDF documents
- Calling municipal services for information
- Using general map applications without e-waste-specific data
- Asking neighbors or community groups for recommendations

These solutions are inefficient, time-consuming, and often result in incomplete or outdated information. ElektroMap solves this by providing instant access to verified, up-to-date collection point data with geolocation-based search and interactive mapping.

## 3. Functional Requirements

### 3.1 Location Search and Discovery

FR-001: The system shall display all 78 e-waste collection points on an interactive map using OpenStreetMap tiles.

FR-002: The system shall request user permission to access their current GPS location on initial visit.

FR-003: The system shall allow users to search for collection points using their current GPS position.

FR-004: The system shall allow users to search for collection points by manually entering a street address.

FR-005: The system shall calculate and display the straight-line distance from the user's location to each collection point in kilometers.

FR-006: The system shall sort search results by proximity (nearest first).

FR-007: The system shall return search results within 2 seconds of user query submission.

### 3.2 Map Visualization

FR-008: The system shall display collection points as distinct markers on the map.

FR-009: The system shall display the user's current position on the map when location permission is granted.

FR-010: The system shall center the map on Poznań, Poland (52.4064°N, 16.9252°E) on initial load.

FR-011: The system shall allow users to zoom in/out on the map.

FR-012: The system shall allow users to pan the map by dragging.

FR-013: The system shall display basic information (address, additional details) when a user clicks a map marker.

FR-014: The system shall load map tiles and markers within 3 seconds on 4G connection.

### 3.3 List View

FR-015: The system shall provide a list view displaying all collection points as scrollable cards.

FR-016: Each location card shall display: street address, distance from user, and additional location information.

FR-017: The system shall allow users to toggle between map view and list view.

FR-018: The system shall maintain user's search context when switching between views.

### 3.4 Location Details

FR-019: The system shall display comprehensive information for a selected collection point including full address and additional location context.

FR-020: The system shall provide a "Get Directions" button that opens the device's native maps application or Google Maps with the destination pre-filled.

FR-021: The system shall display location details in a modal or detail page accessible from both map markers and list items.

### 3.5 Data Management

FR-022: The system shall store all collection point data in a PostgreSQL database with PostGIS extension.

FR-023: The system shall geocode all 78 addresses to latitude/longitude coordinates before deployment.

FR-024: The system shall achieve at least 95% geocoding accuracy for all locations.

FR-025: The system shall use PostGIS spatial indexes for efficient nearest-neighbor queries.

FR-026: The system shall query the database using PostGIS ST_Distance function for distance calculations.

### 3.6 API Requirements

FR-027: The system shall provide a REST API endpoint GET /api/locations to retrieve all collection points.

FR-028: The system shall provide a REST API endpoint GET /api/locations/nearest with query parameters (lat, lng, limit, radius).

FR-029: The system shall provide a REST API endpoint GET /api/locations/:id to retrieve specific location details.

FR-030: The API shall respond to nearest location queries within 200ms.

FR-031: The API shall implement CORS to allow frontend access.

FR-032: The API shall implement rate limiting to prevent abuse.

### 3.7 User Interface Requirements

FR-033: The system shall provide a Polish-language user interface.

FR-034: The system shall be responsive and functional on mobile devices (smartphones and tablets).

FR-035: The system shall be responsive and functional on desktop browsers (Chrome, Firefox, Safari, Edge).

FR-036: The system shall not require user authentication or account creation.

FR-037: The system shall display error messages in Polish when location services are unavailable.

FR-038: The system shall provide clear visual feedback during data loading operations.

## 4. Product Boundaries

### 4.1 In Scope

- Interactive map display of 78 e-waste collection points in Poznań
- Search by current GPS location
- Search by manual address entry
- Distance calculation and sorting by proximity
- List view and map view toggle
- Location details display
- Directions integration with native maps
- Polish language interface
- Mobile and desktop web browser support
- PostgreSQL + PostGIS database storage
- REST API for location queries
- Deployment on free-tier hosting (Vercel/Netlify + Railway/Render)

### 4.2 Out of Scope (Future Enhancements)

- User accounts and authentication
- Saved favorite locations
- User reviews and ratings of collection points
- Real-time capacity or availability information
- Appointment booking system
- Push notifications for collection events
- Multi-city or multi-municipality support
- Drop-off history tracking
- E-waste type filtering by device category
- Collection service provider information
- Native mobile applications (iOS/Android)
- Offline mode functionality
- Multi-language support beyond Polish
- User-submitted locations
- Photo uploads of facilities
- Community forum or discussion features
- Social sharing capabilities
- Admin dashboard for data management
- Real-time data sync from municipality API
- Analytics and usage statistics
- Location verification system
- Collection point photos/images
- Detailed accepted items list per location
- Pricing information
- Special event locations (temporary collection drives)
- Historical collection volume data

### 4.3 Technical Boundaries

- Web-only application (no native mobile apps)
- Modern browser support only (Chrome, Firefox, Safari, Edge latest versions)
- Requires active internet connection (no offline mode)
- Single language (Polish)
- Coverage limited to Poznań, Poland (78 locations)
- Manual data refresh process (no automated sync)
- Free tier hosting limitations (< 1000 concurrent users)
- Nominatim geocoding rate limits (1 request/second during data processing)

## 5. User Stories

### 5.1 Location Discovery

US-001: View All Collection Points on Map
- As a Poznań resident
- I want to see all e-waste collection points displayed on an interactive map
- So that I can visualize where collection points are located in my area

Acceptance Criteria:
- Map displays all 78 collection points as distinct markers
- Map is centered on Poznań on initial load
- Map loads within 3 seconds on 4G connection
- Markers are clearly visible and distinguishable
- Map supports zoom and pan interactions

US-002: Use Current Location
- As a mobile user
- I want the app to detect my current GPS location
- So that I can quickly find collection points near me without typing

Acceptance Criteria:
- System requests location permission on first use
- Permission dialog is displayed in Polish
- User can grant or deny location access
- If granted, user's position is displayed on map
- If denied, user can still search by address
- System handles location permission gracefully without crashing

US-003: Search by Current Location
- As a resident with location services enabled
- I want to find the nearest collection points to my current position
- So that I can choose the most convenient drop-off location

Acceptance Criteria:
- System automatically uses current GPS coordinates
- Results are sorted by distance (nearest first)
- Distance is displayed in kilometers with 2 decimal precision
- At least 5 nearest locations are shown
- Results appear within 2 seconds
- Map centers on user's location

US-004: Manual Address Search
- As a user planning a future trip
- I want to search for collection points by entering a specific address
- So that I can find locations near where I will be later

Acceptance Criteria:
- Search input field accepts Polish street addresses
- System validates address format
- System geocodes entered address
- Results show collection points sorted by distance from entered address
- Clear error message if address cannot be found
- Search works with partial addresses (street names)

US-005: View Distance Information
- As a user comparing collection points
- I want to see the distance from my location to each collection point
- So that I can choose the closest or most convenient option

Acceptance Criteria:
- Distance displayed in kilometers with 2 decimal places
- Distance calculated from user's current or searched location
- Distance updates when user changes their search location
- Distance is visible in both map markers and list view
- Straight-line distance calculation is used

### 5.2 Map Interaction

US-006: Click Map Marker for Quick Info
- As a user browsing the map
- I want to click on a marker to see basic information
- So that I can quickly learn about a location without leaving the map

Acceptance Criteria:
- Clicking marker displays popup with address and additional info
- Popup appears within 500ms of click
- Popup includes link to full details
- Multiple markers can be clicked sequentially
- Popup closes when clicking elsewhere on map
- Popup is mobile-friendly and readable

US-007: Zoom and Pan Map
- As a user exploring different areas
- I want to zoom in/out and pan the map
- So that I can view collection points at different scales

Acceptance Criteria:
- Pinch-to-zoom works on mobile devices
- Mouse wheel zoom works on desktop
- Plus/minus buttons for zoom are available
- Map can be panned by dragging
- Zoom level persists during session
- Map remains responsive during zoom/pan operations

US-008: View User Location on Map
- As a user with location services enabled
- I want to see my current position marked on the map
- So that I can understand my proximity to collection points

Acceptance Criteria:
- User position displayed as distinct marker (different from collection points)
- Position marker updates if user moves significantly
- User can click their position marker to recenter map
- Position marker is clearly labeled
- Position accuracy indicator is shown if available

### 5.3 List View

US-009: Switch to List View
- As a user who prefers lists over maps
- I want to toggle to a list view of collection points
- So that I can browse locations in a linear format

Acceptance Criteria:
- Toggle button switches between map and list views
- List view displays all visible/filtered collection points
- Each list item shows address, distance, and additional info
- List is scrollable
- Toggle state is visually indicated
- Switching views preserves search context

US-010: Browse Collection Points in List
- As a user viewing the list
- I want to scroll through all collection points
- So that I can compare options easily

Acceptance Criteria:
- List displays cards with clear visual separation
- Each card shows complete location information
- Cards are sorted by distance (nearest first)
- Smooth scrolling on mobile and desktop
- List supports lazy loading if needed for performance
- Cards are touch-friendly on mobile (minimum 44px height)

US-011: Select Location from List
- As a user browsing the list
- I want to click on a location to see full details
- So that I can learn more and get directions

Acceptance Criteria:
- Clicking list item opens location details
- Visual feedback on click/tap
- Details open in modal or new view
- Back navigation returns to list with scroll position preserved
- Works consistently on mobile and desktop

### 5.4 Location Details

US-012: View Complete Location Information
- As a user who selected a location
- I want to see all available information about that collection point
- So that I can decide if it meets my needs

Acceptance Criteria:
- Details display full address
- Additional information displayed (parking, school grounds, etc.)
- Distance from user's location displayed
- Sequential number (Lp) displayed for reference
- Information displayed in clear, readable format
- Modal/page loads within 1 second

US-013: Get Directions to Location
- As a user ready to visit a collection point
- I want to get navigation directions
- So that I can easily travel to the location

Acceptance Criteria:
- "Get Directions" button is prominently displayed
- Button opens device's native maps app with destination set
- On desktop, opens Google Maps in new tab
- Destination coordinates are accurately passed
- Works on iOS (Apple Maps) and Android (Google Maps)
- Graceful fallback if native maps unavailable

US-014: Close Location Details
- As a user viewing location details
- I want to close the details and return to search results
- So that I can continue browsing other options

Acceptance Criteria:
- Close button (X) clearly visible
- Clicking outside modal closes it (if modal pattern used)
- Back button navigation works (if detail page pattern used)
- Closing returns to previous view (map or list)
- Search state is preserved after closing

### 5.5 Error Handling

US-015: Handle Location Permission Denied
- As a user who denies location permission
- I want to still use the app with manual search
- So that I can find collection points without sharing my location

Acceptance Criteria:
- Clear message explains location permission was denied
- Manual address search is offered as alternative
- Message is in Polish and user-friendly
- No functionality is broken
- User can grant permission later through browser settings
- Informational message on how to re-enable location

US-016: Handle Address Not Found
- As a user who enters an invalid address
- I want to see a clear error message
- So that I understand the problem and can correct it

Acceptance Criteria:
- Error message displays in Polish
- Message explains address could not be found
- Suggestions provided (check spelling, use full address)
- Search field remains populated with entered text
- User can easily edit and retry
- No application crash or blank screen

US-017: Handle No Internet Connection
- As a user with connectivity issues
- I want to see a clear message when offline
- So that I understand why the app isn't working

Acceptance Criteria:
- Offline state is detected
- Polish error message explains no connection
- Message suggests checking internet connection
- App attempts to reconnect when connection restored
- Graceful degradation of functionality
- No console errors or crashes

US-018: Handle API Errors
- As a user when the backend is unavailable
- I want to see a helpful error message
- So that I know to try again later

Acceptance Criteria:
- API errors are caught and handled
- User-friendly Polish error message displayed
- Technical details hidden from user
- Retry button provided where appropriate
- Loading states cleared properly
- Error logged for debugging

### 5.6 Performance and Usability

US-019: Fast Initial Load
- As any user visiting the site
- I want the application to load quickly
- So that I can start searching immediately

Acceptance Criteria:
- Initial page load under 3 seconds on 4G
- Map tiles load progressively
- Core functionality available before all data loads
- Loading indicators shown during data fetch
- No blank white screen during loading
- Optimized assets (images, scripts)

US-020: Responsive Mobile Experience
- As a mobile user
- I want the app to work well on my smartphone
- So that I can use it while on the go

Acceptance Criteria:
- Layout adapts to mobile screen sizes (320px minimum width)
- Touch targets are at least 44px for easy tapping
- Text is readable without zooming
- Map controls are accessible on mobile
- List view is optimized for small screens
- No horizontal scrolling required

US-021: Responsive Desktop Experience
- As a desktop user
- I want to take advantage of my larger screen
- So that I can see more information at once

Acceptance Criteria:
- Layout utilizes available screen space efficiently
- Map and list can be viewed simultaneously on wide screens
- Mouse interactions work intuitively
- Keyboard navigation supported where applicable
- Information density appropriate for larger displays
- No awkward spacing or oversized elements

### 5.7 Baseline System Functionality

US-022: Database Connection
- As the system
- The application must connect to PostgreSQL database
- So that location data can be queried

Acceptance Criteria:
- Database connection established on server startup
- Connection pooling configured for efficiency
- Connection errors handled gracefully
- Automatic reconnection on connection loss
- Health check endpoint confirms database connectivity
- Environment variables used for connection credentials

US-023: Spatial Query Execution
- As the system
- The application must execute PostGIS spatial queries
- So that nearest location searches are accurate and fast

Acceptance Criteria:
- PostGIS extension enabled in database
- Spatial indexes created and utilized
- ST_Distance function used for distance calculations
- Queries return results within 50ms
- Query results sorted by distance correctly
- Coordinate system (WGS84/4326) used consistently

US-024: API Rate Limiting
- As the system
- The API must implement rate limiting
- So that server resources are protected from abuse

Acceptance Criteria:
- Rate limit of 100 requests per 15 minutes per IP
- Rate limit headers included in responses
- 429 status code returned when limit exceeded
- Clear error message when rate limited
- Rate limit configuration via environment variables
- Legitimate users are not impacted during normal use

US-025: CORS Configuration
- As the system
- The API must allow cross-origin requests from the frontend
- So that the frontend can communicate with the backend

Acceptance Criteria:
- CORS enabled for frontend domain
- Preflight requests handled correctly
- Appropriate headers included in responses
- Development and production origins configured
- Credentials allowed if needed in future
- Security headers implemented (helmet.js)

### 5.8 Edge Cases and Extreme Scenarios

US-026: Handle User at Exact Collection Point Location
- As a user standing at a collection point
- I want to see that location identified as nearest (0.00 km)
- So that I can confirm I'm at the correct location

Acceptance Criteria:
- Distance displayed as 0.00 km when at exact coordinates
- Location still appears in results list
- Map marker and user location marker overlap visually
- No division by zero errors
- Details view accessible
- "You are here" indicator shown

US-027: Handle User Outside Poznań
- As a user accessing the app from outside Poznań
- I want to see all collection points even though none are nearby
- So that I can still explore the data

Acceptance Criteria:
- All 78 locations displayed on map regardless of user location
- Distances calculated correctly even for large values (>50km)
- No error messages for being outside coverage area
- Results still sortable by distance
- Clear indication this service covers Poznań only
- Map zooms to show all markers if user very far away

US-028: Handle Multiple Users Searching Simultaneously
- As the system under load
- The application must handle concurrent user requests
- So that all users receive accurate results

Acceptance Criteria:
- Database connection pool manages concurrent connections
- No race conditions in query execution
- Each request isolated and returns correct results
- Response times remain under target (200ms API, 2s frontend)
- System supports at least 100 concurrent users
- No data corruption or cache pollution

US-029: Handle Very Long Address Input
- As a user entering a detailed address
- I want the system to handle long input gracefully
- So that my search doesn't fail

Acceptance Criteria:
- Input field accepts up to 255 characters
- Long addresses don't break layout
- Geocoding service processes long addresses
- Input validation prevents excessively long submissions
- User feedback if input too long
- No SQL injection vulnerabilities

US-030: Handle Missing Geocoding Data
- As a system administrator
- If geocoding fails for some addresses during setup
- The system should identify and report failed geocoding attempts

Acceptance Criteria:
- Geocoding script logs all failures
- Failed addresses identified with error messages
- Partial dataset can be loaded if some addresses fail
- Manual review process documented for failed addresses
- System functions with partial data (e.g., 75/78 locations)
- Clear documentation of which locations failed geocoding

US-031: Handle Browser Geolocation Timeout
- As a user with slow GPS signal
- I want to be notified if location detection takes too long
- So that I can switch to manual search

Acceptance Criteria:
- Geolocation request times out after 10 seconds
- Timeout message displayed in Polish
- User prompted to try manual search
- Loading indicator shown during wait
- Option to cancel geolocation request
- Fallback to manual search offered

US-032: Handle Browser Without Geolocation Support
- As a user with an older browser
- I want to use manual search when geolocation is unavailable
- So that I can still find collection points

Acceptance Criteria:
- Feature detection checks for geolocation API
- Manual search interface shown if geolocation unavailable
- No JavaScript errors from missing API
- Clear message explaining situation
- Full functionality available via manual search
- Graceful degradation

## 6. Success Metrics

### 6.1 User Engagement Metrics

- Daily Active Users (DAU): Target 100+ users within first month
- Session Duration: Average 2-5 minutes per session
- Bounce Rate: Less than 30%
- Return User Rate: 20% of users return within 7 days
- Mobile vs Desktop Usage: Track ratio (expect 70% mobile)

### 6.2 Performance Metrics

- Page Load Time: 95th percentile under 3 seconds on 4G
- API Response Time: 95th percentile under 200ms
- Map Tile Loading: 95th percentile under 3 seconds
- Database Query Time: Average under 50ms
- Error Rate: Less than 1% of all requests

### 6.3 Functional Success Metrics

- Geocoding Accuracy: 95% of locations accurately geocoded
- Search Success Rate: 90% of searches return results
- Location Permission Grant Rate: Track percentage of users granting permission
- Directions Button Click Rate: 40% of users who view details click directions
- View Toggle Usage: Track map vs list view preferences

### 6.4 User Satisfaction Metrics

- Task Completion Rate: 85% of users successfully find a location
- Search Abandonment Rate: Less than 20%
- Navigation to External Maps: Track successful handoff to navigation apps
- User Feedback: Collect qualitative feedback via optional survey

### 6.5 Technical Health Metrics

- Uptime: 99.5% availability
- Database Connection Success Rate: 99.9%
- Failed Geocoding Attempts: Log and track during data processing
- Browser Compatibility: Test and ensure functionality on Chrome, Firefox, Safari, Edge (latest versions)
- CORS Errors: Zero CORS-related errors in production

### 6.6 Business Impact Metrics

- Collection Point Usage: Indirect measure through municipal data (if available)
- Cost Per User: Maintain under $0.01 per user with free tiers
- Hosting Costs: Stay within free tier limits ($0/month target)
- Development Velocity: MVP delivered within 4 weeks

### 6.7 Accessibility and Reach Metrics

- Mobile Responsiveness Score: 95+ on Google Lighthouse
- Desktop Responsiveness Score: 95+ on Google Lighthouse
- Polish Language Coverage: 100% of UI text in Polish
- Coverage: All 78 official Poznań collection points included

### 6.8 Data Quality Metrics

- Geocoding Success Rate: 95%+ of addresses successfully geocoded
- Coordinate Accuracy: Spot-check sample of 10 locations manually
- Data Freshness: Update lag documented (currently April 2024 data)
- Missing Data Points: Track percentage of locations with incomplete information
