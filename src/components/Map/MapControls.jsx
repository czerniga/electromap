import React from 'react'
import { useMap } from 'react-leaflet'
import { useLocationContext } from '../../context/LocationContext.jsx'

export default function MapControls() {
  const map = useMap()
  const { userPosition } = useLocationContext()
  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <button
        className="px-3 py-2 rounded bg-white shadow text-sm"
        disabled={!userPosition}
        onClick={() => userPosition && map.setView([userPosition.lat, userPosition.lng], map.getZoom())}
      >
        Wyśrodkuj na mnie
      </button>
    </div>
  )
}
