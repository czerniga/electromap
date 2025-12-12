import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocationContext } from '../../context/LocationContext.jsx'
import MapControls from './MapControls.jsx'
import SearchBar from '../Search/SearchBar.jsx'

const center = [52.4064, 16.9252]

export default function MapView() {
  const { locations, userPosition, searchQuery, setSelectedLocation } = useLocationContext()

  const filtered = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim()
    if (!q) return locations
    return locations.filter(l => (l.address || '').toLowerCase().includes(q))
  }, [locations, searchQuery])

  return (
    <div className="h-full relative">
      <MapContainer center={center} zoom={12} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtered.map(l => (
          l.coordinates && typeof l.coordinates.latitude === 'number' && typeof l.coordinates.longitude === 'number' ? (
            <Marker key={l.id} position={[l.coordinates.latitude, l.coordinates.longitude]}>
              <Popup>
                <div className="space-y-2">
                  <div className="font-medium">{l.address}</div>
                  <button className="px-2 py-1 rounded bg-blue-600 text-white text-sm" onClick={() => setSelectedLocation(l)}>
                    Szczegóły
                  </button>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
        {userPosition && (
          <>
            <CircleMarker
              center={[userPosition.lat, userPosition.lng]}
              radius={10}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.6 }}
            />
            <Popup position={[userPosition.lat, userPosition.lng]}>Twoja lokalizacja</Popup>
          </>
        )}
        <MapControls />
      </MapContainer>
      <SearchBar />
    </div>
  )
}
