import React from 'react'
import { useLocationContext } from '../../context/LocationContext.jsx'

export default function ViewToggle() {
  const { viewMode, setViewMode } = useLocationContext()
  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <div className="bg-white rounded shadow flex">
        <button
          className={`px-3 py-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setViewMode('map')}
        >Mapa</button>
        <button
          className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setViewMode('list')}
        >Lista</button>
      </div>
    </div>
  )
}
