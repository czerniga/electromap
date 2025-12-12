import React from 'react'
import { useLocationContext } from '../../context/LocationContext.jsx'
import useNearestLocations from '../../hooks/useNearestLocations.js'
import { formatDistanceKm } from '../../utils/distance.js'

export default function ListView() {
  const { locations, userPosition, searchQuery, setSelectedLocation } = useLocationContext()
  const nearest = useNearestLocations(userPosition, locations, locations.length)

  const filtered = (searchQuery ? nearest.filter(l => (l.address || '').toLowerCase().includes(searchQuery.toLowerCase())) : nearest)

  return (
    <div className="p-4 space-y-2">
      {filtered.map(l => (
        <button key={l.id} onClick={() => setSelectedLocation(l)} className="w-full text-left p-3 rounded bg-white shadow">
          <div className="font-medium">{l.address}</div>
          <div className="text-sm text-gray-600">{typeof l.distance === 'number' ? formatDistanceKm(l.distance) : '— km'}</div>
          {!l.coordinates && (
            <div className="text-xs text-red-600">Brak współrzędnych</div>
          )}
        </button>
      ))}
    </div>
  )
}
