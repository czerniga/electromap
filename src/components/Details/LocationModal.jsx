import React from 'react'
import { useLocationContext } from '../../context/LocationContext.jsx'
import { formatDistanceKm, haversineDistance } from '../../utils/distance.js'
import { mapsDeepLink } from '../../utils/platformDetection.js'

export default function LocationModal() {
  const { selectedLocation, setSelectedLocation, userPosition } = useLocationContext()
  if (!selectedLocation) return null
  const coords = selectedLocation.coordinates
  const deepLink = coords ? mapsDeepLink(coords.latitude, coords.longitude) : null

  const distance = userPosition && coords
    ? formatDistanceKm(
        haversineDistance(
          userPosition.lat,
          userPosition.lng,
          coords.latitude,
          coords.longitude
        )
      )
    : null

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-[2000] bg-black/40 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-md md:rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{selectedLocation.address}</h2>
          <button onClick={() => setSelectedLocation(null)} aria-label="Zamknij">✕</button>
        </div>
        {selectedLocation.additionalInfo && (
          <p className="text-sm text-gray-700 mb-2">{selectedLocation.additionalInfo}</p>
        )}
        {distance && <p className="text-sm mb-2">Odległość: {distance}</p>}
        {coords ? (
          <a
            className="inline-block px-3 py-2 rounded bg-blue-600 text-white"
            href={deepLink}
            target="_blank"
            rel="noreferrer"
          >
            Nawiguj
          </a>
        ) : (
          <p className="text-sm text-red-600">Brak współrzędnych dla tej lokalizacji</p>
        )}
      </div>
    </div>
  )
}
