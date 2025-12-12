# Architektura UI dla ElektroMap (MVP – Faza 1)

## 1. Przegląd Ramy UI

ElektroMap (MVP) to aplikacja webowa typu mobile‑first, której celem jest szybkie odnajdywanie najbliższych punktów zbiórki e‑odpadów w Poznaniu. Faza 1 działa bez backendu i bez API – dane są statyczne (plik `public/data/locations.json`) i ładowane jednokrotnie na starcie. Odległości obliczane są po stronie klienta (Haversine). Domyślny widok to mapa z markerami; alternatywą jest lista. Szczegóły punktu otwierają się jako modal (desktop/tablet) lub szuflada (mobile). Interfejs jest w języku polskim, z naciskiem na dostępność (ARIA), czytelne stany (skeletony, błędy) i prostą nawigację do zewnętrznych map.

Technologie UI: React 18, Vite, Leaflet + React‑Leaflet, Tailwind CSS, Lucide ikony. Zarządzanie stanem: wbudowane hooki React (`useState`, `useContext`) z `LocationContext`. Brak zewnętrznych kluczy API w kliencie.

## 2. Lista Widoków

### Widok: Mapa (domyślny)
- **Ścieżka**: `/`
- **Cel**: Wizualizacja wszystkich 78 punktów; szybkie rozeznanie przestrzenne; start z centrum Poznania.
- **Kluczowe informacje**: markery punktów (adres, kontekst), wskaźnik pozycji użytkownika (po zgodzie), baner zachęcający do włączenia lokalizacji, pasek wyszukiwania.
- **Kluczowe komponenty**: `MapView`, `MapControls`, `SearchBar`, `ViewToggle`, `LocationContext`.
- **UX/Accessibility/Security**: mobile‑first; cele dotykowe ≥44px; `aria-label` dla mapy i sterowania; HTTPS wymagane dla geolokalizacji; komunikaty po polsku; brak klastrowania w F1 (78 markerów wystarcza).

### Widok: Lista
- **Ścieżka**: `/list`
- **Cel**: Linearne porównanie punktów, z odległością (lub „— km” bez lokalizacji) i dodatkowymi informacjami.
- **Kluczowe informacje**: adres, odległość, dodatkowe informacje; sort alfabetyczny (bez lokalizacji) lub wg odległości (z lokalizacją).
- **Kluczowe komponenty**: `ListView`, `LocationCard`, `ViewToggle`, `SearchBar`.
- **UX/Accessibility/Security**: zachowanie kontekstu wyszukiwania przy przełączaniu; `aria-live` dla liczby wyników; preferencja widoku w `localStorage`.

### Widok: Szczegóły Lokalizacji (Modal/Szuflada)
- **Ścieżka**: `#location/:id` (hash‑routing, np. `#location/5`)
- **Cel**: Pełne dane punktu + przycisk „Nawiguj”.
- **Kluczowe informacje**: pełny adres, dodatkowy kontekst, odległość, numer Lp, linki nawigacji.
- **Kluczowe komponenty**: `LocationModal` (lazy‑load), `platformDetection` (iOS/Android/desktop), zarządzanie focus (trap).
- **UX/Accessibility/Security**: desktop/tablet – modal overlay; mobile – szuflada 80vh z gestem zamykania; zamknięcie Esc; etykiety ARIA po polsku.

### Widok: Stany Ładowania i Błędów
- **Ścieżka**: globalnie (warstwa UI)
- **Cel**: Czytelne skeletony, spójne komunikaty, brak „pustego ekranu”.
- **Kluczowe informacje**: skeleton markerów/kart, komunikaty: offline, odmowa geolokalizacji, błąd pobierania.
- **Kluczowe komponenty**: `ErrorBoundary`, skeleton UI, `messages.js`.
- **UX/Accessibility/Security**: `aria-busy` podczas ładowania; kontrasty WCAG; brak wrażliwych danych; w F1 offline = prosty komunikat.

## 3. Mapa Podróży Użytkownika

### Główny przepływ (mobile)
1. Wejście → Mapa centruje się na Poznaniu (52.4064, 16.9252), zoom 12; widoczne wszystkie markery.
2. Baner zachęcający: „Włącz lokalizację, aby znaleźć najbliższe punkty” + „Użyj mojej lokalizacji”.
3. Zgoda na lokalizację → niebieska kropka; mapa centruje się na pozycji.
4. Przełączenie na Listę → sortowanie wg odległości; szybki wybór najbliższych.
5. Klik karty/markera → Szczegóły (szuflada 80vh na mobile / modal na desktop).
6. „Nawiguj” → otwarcie natywnej aplikacji map (Android/iOS) lub Google Maps w przeglądarce.
7. Zamknięcie szczegółów → powrót do poprzedniego widoku (z zachowaniem wyszukiwania/scrollu).

### Bez zgody na lokalizację
- Mapa: 78 markerów z centrum na Poznań.
- Lista: sort alfabetyczny + placeholder „— km”.
- Wyszukiwanie: działa zwyczajnie; delikatny prompt o włączeniu lokalizacji dla sortowania po odległości.

### Wyszukiwanie adresu
- Wpis w pasku wyszukiwania filtruje markery/karty; wybór wyniku centruje mapę i otwiera popup; szczegóły dostępne z popupu.

## 4. Nawigacja i Układ

- **Przełącznik widoku**: Mapy/Listy; preferencja pamiętana w `localStorage` (`elektromap_preferred_view`).
- **Pasek wyszukiwania**: floating; mobile – top pełnej szerokości z marginesami 16px; desktop – top‑right; wbudowany przycisk geolokalizacji.
- **Szczegóły**: `#location/:id` umożliwia współdzielenie; zamknięcie przyciskiem X/Esc lub gestem.
- **Sterowanie mapą**: zoom/pan + centrowanie na pozycji użytkownika.
- **Responsywność**:
  - Mobile <768px: pionowy układ, większe cele dotykowe, szuflada dla szczegółów.
  - Tablet 768–1024px: split view (lista + mapa) opcjonalnie.
  - Desktop >1024px: panel listy ~400px + mapa obok.

## 5. Kluczowe Komponenty

- **`LocationContext`**: dane (`locations`, `loading`, `error`), stan użytkownika (`userPosition`), UI (`selectedLocation`, `viewMode`, `searchQuery`).
- **`useLocations`**: jednokrotne pobranie `locations.json`, cache w kontekście, stany ładowania/błędu.
- **`useNearestLocations`**: Haversine + sortowanie, `useMemo` (rekalkulacja przy zmianie pozycji).
- **`useGeolocation`**: obsługa zgody/błędów; aktualizacja `userPosition`.
- **`MapView`**: MapContainer, TileLayer, Marker, Popup; wskaźnik pozycji.
- **`ListView`**: karty z odległością lub „— km”; filtr wg `searchQuery`.
- **`LocationModal`** (lazy‑load): szczegóły punktu, „Nawiguj”, trap focus, zamknięcie Esc.
- **`SearchBar`**: input z ikoną celownika; czyszczenie, etykiety ARIA.
- **`distance.js`**: format metry <1 km; ≥1 km z 2 miejscami po przecinku.
- **`messages.js`**: polskie komunikaty błędów i hintów.
- **`platformDetection.js`**: maps:// (iOS), geo:/google.navigation (Android), https (desktop).
- **`ErrorBoundary`**: łagodne fallbacki i retry.

## 6. Edge Case’y i Stany Błędów

- **Offline**: komunikat po polsku; próba ponownego połączenia; brak SW w F1.
- **Odmowa geolokalizacji**: podpowiedź o wyszukiwaniu ręcznym; brak crashów; lista pokazuje „— km”.
- **Brak współrzędnych**: na liście z odznaką „Lokalizacja niedostępna”; ukryte na mapie.
- **Timeout lokalizacji**: informacja i przejście do wyszukiwania ręcznego.
- **Brak wsparcia geolokalizacji**: fallback do wyszukiwarki adresu.
- **Udostępnianie linków**: hash‑routing utrzymuje kontekst szczegółów.

## 7. Odwzorowanie Wymagań PRD

- **FR‑001/008/010/011/012/013/014**: Mapa OSM, markery, centrum na Poznań, zoom/pan, popup z informacją.
- **FR‑015/016/017/018**: Widok listy, karty, przełączanie widoków, zachowanie kontekstu.
- **FR‑002/003/005/006/007**: Geolokalizacja, odległość, sortowanie po odległości, responsywne czasy reakcji.
- **FR‑033–038**: Interfejs PL, responsywność mobile/desktop, brak auth, błędy po polsku, stany ładowania.
- **Poza zakresem F1**: DB/PostGIS/API – pozostają na F2 zgodnie z roadmapą.

## 8. Mapowanie Wymagań → Elementy UI

- „Wyświetl wszystkie punkty” → `MapView` + Markery.
- „Użyj mojej lokalizacji” → `useGeolocation` + przycisk w `SearchBar`.
- „Sortuj po odległości” → `useNearestLocations` + `ListView`.
- „Szczegóły i Nawiguj” → `LocationModal` + `platformDetection`.
- „Komunikaty po polsku” → `messages.js` + `ErrorBoundary`.
- „Mobile‑first i dostępność” → Tailwind, ARIA, ≥44px, focus‑ring.

## 9. Dostępność i Bezpieczeństwo

- **Bezpieczeństwo**: brak backendu; brak kluczy/API; HTTPS; lokalny handling geolokalizacji; brak cookies/analityki w F1.
- **Dostępność**: semantyczne HTML, ARIA po polsku, skróty klawiszowe (M/L/Esc/Enter), focus management w modalu, kontrasty WCAG AA.

## 10. Zgodność z planem API (Faza 2)

Architektura widoków jest neutralna względem źródła danych: w F2 `useLocations` może zostać zastąpione klientem REST (GET `/api/locations`, `/api/locations/nearest`, `/api/locations/:id`) bez zmian w strukturze komponentów i kontekstu.
