import { useMemo } from 'react'
import { haversineDistance } from '../utils/distance.js'

export default function useNearestLocations(userPosition, locations, limit = 10) {
  return useMemo(() => {
    if (!userPosition) return locations
    return locations
      .filter(l => l.coordinates && typeof l.coordinates.latitude === 'number' && typeof l.coordinates.longitude === 'number')
      .map(l => ({
        ...l,
        distance: haversineDistance(
          userPosition.lat,
          userPosition.lng,
          l.coordinates.latitude,
          l.coordinates.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
  }, [userPosition, locations, limit])
}
