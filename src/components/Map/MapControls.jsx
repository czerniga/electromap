import React, { useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { useLocationContext } from '../../context/LocationContext.jsx'
import useGeolocation from '../../hooks/useGeolocation.js'

export default function MapControls() {
  const map = useMap()
  const { userPosition } = useLocationContext()
  const { requestLocation } = useGeolocation()

  const handleCenterOnMe = useCallback(() => {
    // Always trigger geolocation request
    requestLocation()
    // If we already have a position, center immediately
    if (userPosition) {
      map.setView([userPosition.lat, userPosition.lng], map.getZoom(), { animate: true })
    }
  }, [map, userPosition, requestLocation])

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control">
        <button
          aria-label="Wyśrodkuj na mnie"
          className="px-3 py-2 rounded bg-white shadow text-sm"
          onClick={handleCenterOnMe}
        >
          Wyśrodkuj na mnie
        </button>
      </div>
    </div>
  )
}
