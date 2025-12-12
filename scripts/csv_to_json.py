import csv, json, time, argparse, sys
from datetime import datetime, timezone
from typing import Optional

try:
    from geopy.geocoders import Nominatim
    from geopy.exc import GeocoderTimedOut, GeocoderServiceError
except ImportError:
    Nominatim = None  # Allow running without geopy if not geocoding

# Optional alternative provider: OpenCage
try:
    from opencage.geocoder import OpenCageGeocode
except Exception:
    OpenCageGeocode = None

INPUT_CSV = 'ewaste_locations.csv'
OUTPUT_JSON_RAW = 'public/data/locations_raw.json'
OUTPUT_JSON_GEOCODED = 'public/data/locations_geocoded.json'

STRUCTURE_VERSION = '1.0'
CITY = 'Poznań'
COUNTRY = 'Poland'


def geocode_address(geolocator, address: str, provider: str = 'nominatim', opencage_key: Optional[str] = None, timeout: float = 8.0, debug: bool = False) -> Optional[dict]:
    """Geocode a Poznań address, trying variant without 'ul.' prefix if present.
    Returns dict with latitude/longitude or None if not found."""
    # OpenCage branch
    if provider == 'opencage':
        if OpenCageGeocode is None or not opencage_key:
            if debug:
                print("[GEOCODE:OpenCage] missing library or API key")
            return None
        oc = OpenCageGeocode(opencage_key)
        base = address.strip()
        variants = []
        if base.startswith('ul. '):
            variants.append(f"{base[4:]}, Poznań, Poland")
            variants.append(f"{base}, Poznań, Poland")
        elif base.startswith('os. '):
            variants.append(f"osiedle {base[4:]}, Poznań, Poland")
            variants.append(f"{base}, Poznań, Poland")
        else:
            variants.append(f"{base}, Poznań, Poland")
        for q in variants:
            if debug:
                print(f"[GEOCODE:OpenCage] query='{q}'")
            try:
                # bounds order: south, west, north, east
                res = oc.geocode(q, language='pl', countrycode='pl', bounds=(52.3, 16.8, 52.5, 17.1))
                if res:
                    best = res[0]
                    lat = best['geometry']['lat']
                    lng = best['geometry']['lng']
                    if debug:
                        print(f"[GEOCODE:OpenCage] -> lat={lat} lon={lng} formatted='{best.get('formatted')}'")
                    if 16.8 <= lng <= 17.1 and 52.3 <= lat <= 52.5:
                        return {
                            'latitude': round(lat, 6),
                            'longitude': round(lng, 6),
                            'fullAddress': best.get('formatted'),
                            'sourceQuery': q
                        }
            except Exception as e:
                if debug:
                    print(f"[GEOCODE:OpenCage] error: {e}")
                continue
        return None

    # Default: Nominatim via geopy
    if geolocator is None:
        return None
    base = address.strip()
    queries = []
    if base.startswith('ul. '):
        queries.append(f"{base[4:]}, Poznań, Poland")  # Without 'ul.'
        queries.append(f"{base}, Poznań, Poland")      # Original
    else:
        queries.append(f"{base}, Poznań, Poland")
    for q in queries:
        for attempt in range(2):  # simple retry
            try:
                if debug:
                    print(f"[GEOCODE:Nominatim] query='{q}' attempt={attempt+1}")
                location = geolocator.geocode(
                    q,
                    timeout=timeout,
                    exactly_one=True,
                    language='pl',
                    country_codes='pl',
                    bounded=True,
                    viewbox=((16.8, 52.3), (17.1, 52.5))
                )
                if debug:
                    if location:
                        print(f"[GEOCODE:Nominatim] -> result='{getattr(location, 'address', 'N/A')}' lat={getattr(location, 'latitude', 'N/A')} lon={getattr(location, 'longitude', 'N/A')}")
                    else:
                        print("[GEOCODE:Nominatim] -> result=None")
                if location and 16.8 <= location.longitude <= 17.1 and 52.3 <= location.latitude <= 52.5:
                    return {
                        'latitude': round(location.latitude, 6),
                        'longitude': round(location.longitude, 6),
                        'fullAddress': location.address,
                        'sourceQuery': q
                    }
            except (GeocoderTimedOut, GeocoderServiceError) as e:
                if debug:
                    print(f"[GEOCODE:Nominatim] error: {e.__class__.__name__} during query='{q}' attempt={attempt+1}")
                if attempt == 0:
                    time.sleep(0.5)
                continue
            except Exception as e:
                if debug:
                    print(f"[GEOCODE:Nominatim] unexpected error: {e}")
                break
        # short pause between query variants
        time.sleep(0.2)
    return None


def convert(geocode: bool = False, limit: Optional[int] = None, rate: float = 1.1, provider: str = 'nominatim', opencage_key: Optional[str] = None, timeout: float = 8.0, debug: bool = False):
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    locations = []
    geolocator = None
    if geocode and provider == 'nominatim':
        if Nominatim is None:
            print("geopy not installed. Install with: pip install geopy", file=sys.stderr)
            sys.exit(1)
        geolocator = Nominatim(user_agent="ElektroMap/1.0 (MVP)")
    for row in rows:
        try:
            lp = int(row['Lp'])
        except ValueError:
            continue
        address = row['Ulica'].strip()
        info = row['Dodatkowe informacje'].strip()
        coord_block = None
        if geocode:
            result = geocode_address(geolocator, address, provider=provider, opencage_key=opencage_key, timeout=timeout, debug=debug)
            if result:
                coord_block = {
                    'latitude': result['latitude'],
                    'longitude': result['longitude']
                }
        locations.append({
            'id': lp,
            'lp': lp,
            'address': address,
            'additionalInfo': info,
            'coordinates': coord_block,
            'geocodedAt': datetime.now(timezone.utc).isoformat() if coord_block else None
        })
        if geocode:
            # Respect Nominatim policy ~1 req/sec
            time.sleep(rate)
        if limit and len(locations) >= limit:
            break
    locations.sort(key=lambda x: x['lp'])
    output = {
        'version': STRUCTURE_VERSION,
        'lastUpdated': datetime.now(timezone.utc).isoformat(),
        'city': CITY,
        'country': COUNTRY,
        'totalLocations': len(locations),
        'geocoded': geocode,
        'locations': locations
    }
    out_path = OUTPUT_JSON_GEOCODED if geocode else OUTPUT_JSON_RAW
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(locations)} locations to {out_path} (geocoded={geocode})")


def parse_args():
    parser = argparse.ArgumentParser(description="Convert CSV to JSON (optionally geocode).")
    parser.add_argument('--geocode', action='store_true', help='Enable geocoding via Nominatim (rate-limited).')
    parser.add_argument('--limit', type=int, help='Limit number of rows processed (for testing).')
    parser.add_argument('--rate', type=float, default=1.1, help='Delay between geocode requests (seconds). Default 1.1')
    parser.add_argument('--resume', action='store_true', help='Resume geocoding from existing geocoded JSON file.')
    parser.add_argument('--provider', choices=['nominatim','opencage'], default='nominatim', help='Geocoding provider.')
    parser.add_argument('--opencage-key', dest='opencage_key', help='OpenCage API key (required if provider=opencage).')
    parser.add_argument('--timeout', type=float, default=8.0, help='Per-request timeout in seconds.')
    parser.add_argument('--debug', action='store_true', help='Enable verbose debug logs.')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    # If resume requested, load existing and filter out processed entries
    if args.resume and args.geocode:
        try:
            existing = json.load(open(OUTPUT_JSON_GEOCODED, 'r', encoding='utf-8'))
            processed = {loc['lp'] for loc in existing.get('locations', []) if loc.get('coordinates')}
            print(f"Resume mode: {len(processed)} locations already geocoded will be skipped.")
            # Temporarily rename input CSV to a temp list of remaining rows? Simpler: modify convert to accept skip set.
            # Monkey patch: wrap original convert with skip logic.
            original_convert = convert
            def convert_with_skip(geocode: bool = False, limit: Optional[int] = None, rate: float = 1.1, provider: str = 'nominatim', opencage_key: Optional[str] = None, timeout: float = 8.0, debug: bool = False):
                with open(INPUT_CSV, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    rows = list(reader)
                # Prepare geolocator
                geolocator = None
                if geocode and provider == 'nominatim':
                    if Nominatim is None:
                        print("geopy not installed. Install with: pip install geopy", file=sys.stderr)
                        sys.exit(1)
                    geolocator = Nominatim(user_agent="ElektroMap/1.0 (MVP)")
                new_locations = []
                count = 0
                for row in rows:
                    try:
                        lp = int(row['Lp'])
                    except ValueError:
                        continue
                    if lp in processed:
                        # reuse existing entry
                        continue
                    address = row['Ulica'].strip()
                    info = row['Dodatkowe informacje'].strip()
                    coord_block = None
                    if geocode:
                        result = geocode_address(geolocator, address, provider=provider, opencage_key=opencage_key, timeout=timeout, debug=debug)
                        if result:
                            coord_block = {
                                'latitude': result['latitude'],
                                'longitude': result['longitude']
                            }
                    new_locations.append({
                        'id': lp,
                        'lp': lp,
                        'address': address,
                        'additionalInfo': info,
                        'coordinates': coord_block,
                        'geocodedAt': datetime.now(timezone.utc).isoformat() if coord_block else None
                    })
                    count += 1
                    if geocode:
                        time.sleep(rate)
                    if limit and count >= limit:
                        break
                # Merge with existing
                merged = existing.get('locations', []) + new_locations
                merged.sort(key=lambda x: x['lp'])
                output = {
                    'version': STRUCTURE_VERSION,
                    'lastUpdated': datetime.now(timezone.utc).isoformat(),
                    'city': CITY,
                    'country': COUNTRY,
                    'totalLocations': len(merged),
                    'geocoded': True,
                    'locations': merged
                }
                with open(OUTPUT_JSON_GEOCODED, 'w', encoding='utf-8') as f:
                    json.dump(output, f, ensure_ascii=False, indent=2)
                print(f"Resume complete. Total geocoded entries now: {len([l for l in merged if l.get('coordinates')])}/{len(merged)}")
            convert_with_skip(geocode=True, limit=args.limit, rate=args.rate, provider=args.provider, opencage_key=args.opencage_key, timeout=args.timeout, debug=args.debug)
        except FileNotFoundError:
            print("No existing geocoded file found; starting fresh.")
            convert(geocode=args.geocode, limit=args.limit, rate=args.rate, provider=args.provider, opencage_key=args.opencage_key, timeout=args.timeout, debug=args.debug)
    else:
        convert(geocode=args.geocode, limit=args.limit, rate=args.rate, provider=args.provider, opencage_key=args.opencage_key, timeout=args.timeout, debug=args.debug)
